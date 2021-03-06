import {WebhookRequest} from "../core/webhook-request";
import * as net from "net";
import {Server} from "net";
import {SocketHandler} from "../core/socket-handler";
import {Socket} from "net";
import {BufferUtil} from "../core/buffer-util";
import {HTTPHelper} from "../core/http-helper";
import {LoggingHelper} from "../core/logging-helper";

let Logger = "WEBHOOK";

export interface WebhookReceivedCallback {
    (socket: Socket, webhookRequest: WebhookRequest): void;
}
export class WebhookManager {
    private server: Server;
    private host: string;
    private socketMap: {[id: number]: Socket} = {};
    public onWebhookReceived: WebhookReceivedCallback = null;

    constructor (private port: number) {
        this.host = "0.0.0.0";
    }

    public start(): void {
        let self = this;

        let socketIndex = 0;
        this.server = net.createServer(function(socket: Socket) {
            let webhookRequest = new WebhookRequest();
            socketIndex++;

            let socketKey = socketIndex;
            self.socketMap[socketIndex] = socket;
            socket.on("data", function(data: Buffer) {
                // Throw away the pings - too much noise
                let dataString = data.toString();
                if (dataString.length > 4 && dataString.substr(0, 3) !== "GET") {
                    LoggingHelper.info(Logger, "Webhook From " + socket.remoteAddress + ":" + socket.remotePort);
                    LoggingHelper.info(Logger, "Webhook Payload " + BufferUtil.prettyPrint(data));
                }

                // The calling socket just seems to stay open some times
                //  Would like to force it closed but don't know when to do it
                //  If we do it on the write callback on the socket, the original caller never gets the response
                // For now, if we get a second request on the socket, re-initialize the webhookRequest
                if (webhookRequest.done()) {
                    webhookRequest = new WebhookRequest();
                }

                webhookRequest.append(data);
                if (webhookRequest.done()) {
                    self.onWebhookReceived(socket, webhookRequest);
                }
            });

            socket.on("close", function () {
                delete self.socketMap[socketKey];
            });

        }).listen(this.port, this.host);

        LoggingHelper.info(Logger, "Listening on " + this.host + ":" + this.port);
    }

    public stop (callback?: () => void): void {
        let self: WebhookManager = this;
        for (let key in self.socketMap) {
            let socket = self.socketMap[key];
            socket.end();
        }

        this.server.close(function () {
            if (callback !== undefined && callback !== null) {
                callback();
            }
        });
    }
}
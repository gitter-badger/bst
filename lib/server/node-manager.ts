import * as net from "net";
import {Node} from "./node";
import {Socket} from "net";
import {SocketHandler} from "../core/socket-handler";
import {Server} from "net";
import {Global} from "../core/global";
import {LoggingHelper} from "../core/logging-helper";

let Logger = "NODEMGR";

export interface OnConnectCallback {
    (node: Node): void;
}

export interface OnKeepAliveCallback {
    (node: Node): void;
}
export class NodeManager {
    public host: string = "0.0.0.0";
    public onConnect: OnConnectCallback = null;
    public onKeepAliveCallback: OnKeepAliveCallback = null;

    private nodes: {[id: string]: Node } = {};
    public server: Server;

    constructor(private port: number) {}

    public node (nodeID: string): Node {
        return this.nodes[nodeID];
    }

    public start (callback?: () => void) {
        let self = this;
        this.server = net.createServer(function(socket: Socket) {
            let initialConnection = true;
            let node: Node = null;
            let socketHandler = new SocketHandler(socket, function(message: string) {
                // We do special handling when we first connect
                if (initialConnection) {
                    let connectData = JSON.parse(message);
                    node = new Node(connectData.id, socketHandler);
                    self.nodes[node.id] = node;

                    socketHandler.send("ACK");
                    initialConnection = false;

                    if (self.onConnect != null) {
                        self.onConnect(node);
                    }
                } else if (message === Global.KeepAliveMessage) {
                    if (self.onKeepAliveCallback !== null) {
                        self.onKeepAliveCallback(node);
                    }

                } else if (node.handlingRequest()) {
                    // Handle the case where the data received is a reply from the node to data sent to it
                    node.onReply(message);
                }
            });

            // When the socket closes, remove it from the dictionary
            socketHandler.onCloseCallback = function() {
                if (node !== null) {
                    LoggingHelper.info(Logger, "NODE CLOSED: " + node.id);
                    delete self.nodes[node.id];
                }
            };

            // We have a connection - a socket object is assigned to the connection automatically
            LoggingHelper.info(Logger, "NODE CONNECTED: " + socket.remoteAddress + ":" + socket.remotePort);

        }).listen(this.port, this.host);

        // Make a callback when the server starts up
        this.server.on("listening", function () {
            // On startup, call callback if defined
            if (callback !== undefined && callback !== null) {
                callback();
            }
        });

        LoggingHelper.info(Logger, "Listening on " + this.host + ":" + this.port);
    }

    /**
     * Calling stop tells the server to stop listening
     * However, connections are not closed until all sockets disconnect, so loop through sockets and force a disconnect
     * @param callback
     */
    public stop (callback: () => void): void {
        for (let key in this.nodes) {
            if (this.nodes.hasOwnProperty(key)) {
                let node: Node = this.node(key);
                node.socketHandler.disconnect();
                LoggingHelper.info(Logger, "NODE CLOSING: " + node.id);
            }
        }

        this.server.close(function (error: any) {
            if (error !== undefined) {
                LoggingHelper.error(Logger, "ERROR! NodeManager not stopped: " + error);
            } else {
                LoggingHelper.info(Logger, "STOPPED");
                callback();
            }

        });
    }
}
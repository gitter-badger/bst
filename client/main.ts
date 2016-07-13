#!/usr/bin/env node
/// <reference path="../typings/globals/node/index.d.ts" />

// Startup script for running BST
import {BespokeClient} from "./bespoke-client";
import {WebhookRequest} from "./../core/webhook-request";
import {ArgHelper} from "../core/arg-helper";
import {Global} from "../core/global";
import {URLMangler} from "./url-mangler";

let argHelper = new ArgHelper(process.argv);

if (argHelper.orderedCount() === 0) {
    console.error("No command specified. Must be first argument.");
    process.exit(1);
}

let command = argHelper.forIndex(0);
if (command === "debug") {
    if (argHelper.orderedCount() < 2) {
        console.error("For debug, must specify agent-id and port to forward to!");
        process.exit(1);
    }

    let agentID: string  = argHelper.forIndex(1);
    let targetPort: number = parseInt(argHelper.forIndex(2));
    let serverHost: string  = argHelper.forKeyWithDefaultString("serverHost", Global.BespokeServerHost);
    let serverPort: number = argHelper.forKeyWithDefaultNumber("serverPort", 5000);


    let bespokeClient = new BespokeClient(agentID, serverHost, serverPort, targetPort);
    bespokeClient.connect();
}

if (command === "sleep") {
    console.error("Not until Brooklyn!");
    process.exit(1);
}

if (command === "debug-url") {
    let agentID: string  = argHelper.forIndex(1);
    let url: string = argHelper.forIndex(2);

    let mangler = new URLMangler(url, agentID);
    let newUrl = mangler.mangle();
    console.log("");
    console.log("Use this URL in the Alexa Skills configuration:");
    console.log("");
    console.log("   " + newUrl);
    console.log("");
}

if (command === "help") {
    console.log("");
    console.log("Usage: bst <command>");
    console.log("");
    console.log("Commands:");
    console.log("bst debug <agent-id> <service-port>        Forwards traffic from Alexa to your local Skill service, listening on <service-port>");
    console.log("bst debug-url <agent-id> <alexa-url>       Takes a normal URL and modifies to include the <agent-id> in the query string");
    console.log("");
}
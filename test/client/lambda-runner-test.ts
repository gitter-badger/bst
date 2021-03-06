/// <reference path="../../typings/index.d.ts" />

import * as assert from "assert";
import {Global} from "../../lib/core/global";
import {LambdaRunner} from "../../lib/client/lambda-runner";
import {HTTPClient} from "../../lib/core/http-client";
import {FileUtil} from "../../lib/core/file-util";

Global.initialize();

describe("LambdaRunner", function() {
    beforeEach(function () {
        process.chdir("test/resources");
    });

    afterEach(function () {
        process.chdir("../..");
    });

    describe("#start()", function() {
        it("Starts Correctly", function(done) {
            let runner = new LambdaRunner("ExampleLambda.js", 10000);
            runner.start();

            let client = new HTTPClient();
            let inputData = {"data": "Test"};
            client.post("localhost", 10000, "", JSON.stringify(inputData), function(data: Buffer) {
                let responseString = data.toString();
                assert.equal(responseString, "{\"success\":true}");
                runner.stop();
                done();
            });

        });

        it("Handles Lambda Fail Correctly", function(done) {
            let runner = new LambdaRunner("ExampleLambda.js", 10000);
            runner.start();

            let client = new HTTPClient();
            let inputData = {"data": "Test", "doFailure": true};
            client.post("localhost", 10000, "", JSON.stringify(inputData), function(data: Buffer) {
                let responseString = data.toString();
                assert.equal(responseString, "Failure!");
                runner.stop();
                done();
            });
        });

        it("Handles Project Correctly", function(done) {
            process.chdir("exampleProject");
            let runner = new LambdaRunner("ExampleLambda.js", 10000);
            runner.start();

            let client = new HTTPClient();
            let inputData = {"data": "Test"};
            client.post("localhost", 10000, "", JSON.stringify(inputData), function(data: Buffer) {
                let o: any = JSON.parse(data.toString());
                assert.equal(true, o.success);
                assert.equal(2000, o.math);
                runner.stop();
                process.chdir("..");
                done();
            });
        });

        it("Handles Project Correctly Different Dir", function(done) {
            let runner = new LambdaRunner("exampleProject/ExampleLambda.js", 10000);
            runner.start();

            let client = new HTTPClient();
            let inputData = {"data": "Test"};
            client.post("localhost", 10000, "", JSON.stringify(inputData), function(data: Buffer) {
                let o: any = JSON.parse(data.toString());
                assert.equal(true, o.success);
                assert.equal(2000, o.math);
                runner.stop();
                done();
            });
        });

        it("Handles Reload Correctly", function(done) {
            let tempFile = "ExampleLambdaCopy.js";
            FileUtil.copyFile("ExampleLambda.js", tempFile, function() {
                let runner = new LambdaRunner(tempFile, 10000);
                runner.start();

                let client = new HTTPClient();
                let inputData = {"data": "Test"};
                client.post("localhost", 10000, "", JSON.stringify(inputData), function(data: Buffer) {
                    let o: any = JSON.parse(data.toString());
                    assert.equal(o.success, true);
                    assert.notEqual(o.hasOwnProperty("reloaded"), true);

                    FileUtil.copyFile("ExampleLambda2.js", tempFile, function() {
                        client.post("localhost", 10000, "", JSON.stringify(inputData), function(data: Buffer) {
                            o = JSON.parse(data.toString());
                            assert.equal(o.success, true);
                            assert.equal(o.reloaded, true);
                            runner.stop();
                            done();
                        });
                    });
                });
            });
        });
    });

    describe("#stop()", function() {
        it("Stops Correctly", function(done) {
            let runner = new LambdaRunner("ExampleLambda.js", 10000);
            runner.start();

            let client = new HTTPClient();
            let inputData = {"data": "Test"};
            client.post("localhost", 10000, "", JSON.stringify(inputData), function() {
                runner.stop();
                client.post("localhost", 10000, "", JSON.stringify(inputData), function(data: Buffer, success: boolean) {
                    assert.equal(data.toString().indexOf("connect ECONNREFUSED") !== -1, true);
                    assert.equal(success, false);
                    done();
                });
            });

        });
    });
});
import { parentPort } from "worker_threads";
import { CodeRunner } from "../codeRunner.js";

parentPort.on("message", (msg) => {
    const codeRunner = new CodeRunner(msg.funcName, msg.args, msg.code);
    codeRunner.on("end", (resultObj) => {
        parentPort.postMessage({ event: "end", result: resultObj });
    });

    codeRunner.start();
});

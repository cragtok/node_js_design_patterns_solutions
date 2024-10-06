import { EventEmitter } from "events";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { ThreadPool } from "./threadPool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const workerFile = join(__dirname, "workers", "codeRunnerThreadWorker.js");
const workers = new ThreadPool(workerFile, 2);

export class CodeRunnerThread extends EventEmitter {
    constructor(funcName, args, code) {
        super();
        this.funcName = funcName;
        this.args = args;
        this.code = code;
    }

    async start() {
        const worker = await workers.acquire();
        worker.postMessage({
            funcName: this.funcName,
            args: this.args,
            code: this.code,
        });

        const onMessage = (msg) => {
            if (msg.event === "end") {
                worker.removeListener("message", onMessage);
                workers.release(worker);
            }
    
            this.emit(msg.event, msg.result);
        };
    
        worker.on("message", onMessage);
    }
}

import { EventEmitter } from "events";
import { runInContext, createContext } from "vm";

export class CodeRunner extends EventEmitter {
    constructor(funcName, args, code) {
        super();
        this.funcName = funcName;
        this.args = args;
        this.code = code;
    }

    _runFunction() {
        const funcCall = `
                ${this.code}
                ${this.funcName}(${this.args});
                `;
        const context = createContext({});
        let resultObj = {};
        try {
            let result = runInContext(funcCall, context);
            resultObj.result = result || null;
        } catch (error) {
            console.log(error);
            resultObj.error = error.message;
        }
        return resultObj;
    }

    start() {
        const resultObj = this._runFunction();
        this.emit("end", resultObj);
    }
}

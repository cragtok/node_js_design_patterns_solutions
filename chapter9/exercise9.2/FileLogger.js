import { LoggerTemplate } from "./LoggerTemplate.js";
import { appendFile } from "fs/promises";

export class FileLogger extends LoggerTemplate {
    constructor(logFile) {
        super();
        this.logFile = logFile;
    }

    debug(message) {
        this._debug(message);
    }

    info(message) {
        this._info(message);
    }

    warn(message) {
        this._warn(message);
    }

    error(message) {
        this._error(message);
    }

    async _debug(message) {
        await appendFile(this.logFile, `DEBUG: ${message}`);
    }

    async _info(message) {
        await appendFile(this.logFile, `INFO: ${message}`);
    }

    async _warn(message) {
        await appendFile(this.logFile, `WARNING: ${message}`);
    }

    async _error(message) {
        await appendFile(this.logFile, `ERROR: ${message}`);
    }
}

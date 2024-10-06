import { LoggerTemplate } from "./LoggerTemplate.js";

export class ConsoleLogger extends LoggerTemplate {
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

    _debug(message) {
        console.debug(`DEBUG: ${message}`);
    }

    _info(message) {
        console.info(`INFO: ${message}`);
    }

    _warn(message) {
        console.warn(`WARNING: ${message}`);
    }

    _error(message) {
        console.error(`ERROR: ${message}`);
    }
}

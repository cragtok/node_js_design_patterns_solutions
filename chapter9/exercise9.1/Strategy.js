import { appendFile } from "fs/promises";

export const ConsoleStrategy = {
    debug(message) {
        console.debug(`DEBUG: ${message}`);
    },
    info(message) {
        console.info(`INFO: ${message}`);
    },
    warn(message) {
        console.warn(`WARNING: ${message}`);
    },
    error(message) {
        console.error(`ERROR: ${message}`);
    },
};

export const FileStrategy = function(filename) {
    this.filename = filename;
    return {
        debug: async (message) => {
            await appendFile(this.filename, `DEBUG: ${message}`);
        },
        info: async (message) => {
            await appendFile(this.filename, `INFO: ${message}`);
        },
        warn: async (message) => {
            await appendFile(this.filename, `WARNING: ${message}`);
        },
        error: async (message) => {
            await appendFile(this.filename, `ERROR: ${message}`);
        },
    };
};

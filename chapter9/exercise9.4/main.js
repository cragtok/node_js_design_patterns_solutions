import fs from "fs/promises";

class LoggerMiddlewareManager {
    constructor() {
        this.middleware = [];
    }

    use(newMiddleware) {
        if (typeof newMiddleware !== "function") {
            throw new Error("Middleware must be of type function");
        }
        this.middleware.push(newMiddleware);
    }

    async logMessage(message) {
        for (const middleware of this.middleware) {
            message = await middleware(message);
        }
    }
}

const ConsoleStrategy = {
    debug(message) {
        return `DEBUG - ${message}`;
    },
    info(message) {
        return `INFO - ${message}`;
    },
    warn(message) {
        return `WARNING - ${message}`;
    },
    error(message) {
        return `ERROR - ${message}`;
    },
};

const timestampMiddleware = (logMessage) =>
    logMessage ? `${new Date().toISOString()} - ${logMessage}` : "";

const logLevelFilter = (minLevel) => {
    const logLevels = ["INFO", "DEBUG", "WARNING", "ERROR"];
    if (!minLevel) {
        throw new Error("No max level defined");
    }

    const minLevelIndex = logLevels.indexOf(minLevel);

    if (minLevelIndex == -1) {
        throw new Error(`Invalid Log Level: ${minLevel}`);
    }

    return (message) => {
        const messageLevel = message.split(" ")[0];
        const messageLevelIndex = logLevels.indexOf(messageLevel);
        if (messageLevelIndex >= minLevelIndex) {
            return message;
        }

        return "";
    };
};

const consoleOutputMiddleware = (message) => {
    if (message) {
        console.log(message);
    }
    return message;
};

const JSONMiddleware = (message) => {
    if (!message) {
        return;
    }

    const splitMessage = message.split(" - ");

    return {
        timeStamp: splitMessage[0],
        level: splitMessage[1],
        message: splitMessage[2],
    };
};

const createWriteToFileMiddleware =
    ({ path }) =>
        async (message) => {
            if (message) {
                await fs.appendFile(path, message + "\n");
            }
            return message;
        };

const logger = new LoggerMiddlewareManager();
logger.use(logLevelFilter("WARNING"));
logger.use(timestampMiddleware);
logger.use(createWriteToFileMiddleware({ path: "logs.txt" }));
logger.use(JSONMiddleware);
logger.use(consoleOutputMiddleware);

logger.logMessage(ConsoleStrategy.info("This is an info message"));
logger.logMessage(ConsoleStrategy.debug("This is a debug message"));
logger.logMessage(ConsoleStrategy.warn("This is a warning message"));
logger.logMessage(ConsoleStrategy.error("This is an error message"));

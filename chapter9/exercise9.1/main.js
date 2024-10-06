import { Logger } from "./Logger.js";
import { FileStrategy, ConsoleStrategy } from "./Strategy.js";

const consoleLogger = new Logger(ConsoleStrategy);

consoleLogger.debug("This is an DEBUG message");
consoleLogger.info("This is an INFO message");
consoleLogger.warn("this is an WARNING message");
consoleLogger.error("This is an ERROR message");

(async function logToFile() {
    const fileStrategy = new FileStrategy("logfile.txt");
    const fileLogger = new Logger(fileStrategy);

    try {
        await fileLogger.debug("This is an DEBUG message\n");
        await fileLogger.info("This is an INFO message\n");
        await fileLogger.warn("this is an WARNING message\n");
        await fileLogger.error("This is an ERROR message\n");
    } catch (err) {
        console.error(err);
    }
})();

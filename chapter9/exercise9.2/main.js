import { ConsoleLogger } from "./ConsoleLogger.js";
import { FileLogger } from "./FileLogger.js";

const consoleLogger = new ConsoleLogger();

consoleLogger.debug("This is a DEBUG message");
consoleLogger.info("This is an INFO message");
consoleLogger.warn("This is a WARNING message");
consoleLogger.error("This is an ERROR message");

(async function() {
    const fileLogger = new FileLogger("logFile.txt");
    try {
        await fileLogger.debug("This is a DEBUG message\n");
        await fileLogger.info("This is an INFO message\n");
        await fileLogger.warn("This is a WARNING message\n");
        await fileLogger.error("This is an ERROR message\n");
    } catch (error) {
        console.error(error);
    }
})();

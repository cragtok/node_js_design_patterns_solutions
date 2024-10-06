import { ConsoleProxy } from "./ConsoleProxy.js";

const consoleProxy = new ConsoleProxy(console);

consoleProxy.log("Message - LOG");
consoleProxy.warn("Message - WARN");
consoleProxy.info("Message - INFO");
consoleProxy.debug("Message - DEBUG");
consoleProxy.error("Message - ERROR");

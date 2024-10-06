import { consoleColorDecorator } from "./ColorConsoleDecorator.js";

const decoratedConsole = consoleColorDecorator(console);

decoratedConsole.time();
decoratedConsole.log("This is normal logged text", "Also This");
decoratedConsole.info("This is normal info text");
decoratedConsole.table({
    1: "one",
    2: "two",
    2: "three",
});
decoratedConsole.red("THIS IS RED", "THIS IS ALSO RED");
decoratedConsole.yellow("THIS IS YELLOW");
decoratedConsole.green("THIS IS GREEN");
decoratedConsole.timeEnd();

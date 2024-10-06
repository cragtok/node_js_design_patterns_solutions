import { GreenConsole } from "./GreenConsole.js";
import { RedConsole } from "./RedConsole.js";
import { BlueConsole } from "./BlueConsole.js";

export function ColorConsoleFactory(color) {
    if (color === "red") {
        return new RedConsole();
    }

    if (color === "green") {
        return new GreenConsole();
    }

    if (color === "blue") {
        return new BlueConsole();
    }
}

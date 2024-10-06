import { ColorConsole } from "./ColorConsole.js";

export class BlueConsole extends ColorConsole {
    log(string) {
        console.log(`[34m${string}[0m`);
    }
}

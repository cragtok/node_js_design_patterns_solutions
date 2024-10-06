import { ColorConsole } from "./ColorConsole.js";

export class RedConsole extends ColorConsole {
    log(string) {
        console.log(`[91m${string}[0m`);
    }
}

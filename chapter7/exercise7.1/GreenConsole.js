import { ColorConsole } from "./ColorConsole.js";

export class GreenConsole extends ColorConsole {
    log(string) {
        console.log(`[32m${string}[0m`);
    }
}

export class ConsoleProxy {
    constructor(console) {
        this.console = console;
    }
    // Enhanced methods
    log(...args) {
        process.stdout.write(`${new Date().toISOString()}> `);
        this.console.log(...args);
    }
    error(...args) {
        process.stdout.write(`${new Date().toISOString()}> `);
        this.console.error(...args);
    }
    info(...args) {
        process.stdout.write(`${new Date().toISOString()}> `);
        this.console.info(...args);
    }

    debug(...args) {
        process.stdout.write(`${new Date().toISOString()}> `);
        this.console.debug(...args);
    }

    warn(...args) {
        process.stdout.write(`${new Date().toISOString()}> `);
        this.console.warn(...args);
    }

    // Delegated Methods
    dir(...args) {
        this.console.dir(...args);
    }
    time(...args) {
        this.console.time(...args);
    }
    timeEnd(...args) {
        this.console.timeEnd(...args);
    }
    timeLog(...args) {
        this.console.timeLog(...args);
    }
    trace(...args) {
        this.console.trace(...args);
    }
    assert(...args) {
        this.console.assert(...args);
    }
    clear(...args) {
        this.console.clear(...args);
    }
    count(...args) {
        this.console.count(...args);
    }
    countReset(...args) {
        this.console.countReset(...args);
    }
    group(...args) {
        this.console.group(...args);
    }
    groupEnd(...args) {
        this.console.groupEnd(...args);
    }
    table(...args) {
        this.console.table(...args);
    }
    dirxml(...args) {
        this.console.dirxml(...args);
    }

    groupCollapsed(...args) {
        this.console.groupCollapsed(...args);
    }
    Console(...args) {
        this.console.Console(...args);
    }
    profile(...args) {
        this.console.profile(...args);
    }
    profileEnd(...args) {
        this.console.profileEnd(...args);
    }
    timeStamp(...args) {
        this.console.timeStamp(...args);
    }
    context(...args) {
        this.console.context(...args);
    }
    createTask(...args) {
        this.console.createTask(...args);
    }
}

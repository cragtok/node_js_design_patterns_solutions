import styles from "ansi-styles";

export const consoleColorDecorator = (undecoratedConsole) => {
    return new Proxy(undecoratedConsole, {
        get(target, property) {
            const colors = ["red", "yellow", "green"];
            if (colors.includes(property)) {
                return function(...args) {
                    process.stdout.write(styles[property].open);
                    console.log(...args);
                    process.stdout.write(styles[property].close);
                };
            }
            return target[property];
        },
    });
};

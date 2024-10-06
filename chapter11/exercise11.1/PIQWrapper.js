export function PIQWrapper(
    wrappedObject,
    { augmentedMethods, initializationEvent }
) {
    let connected = false;
    let commandsQueue = [];

    wrappedObject.once(initializationEvent, () => {
        console.log(`Event emitted: ${initializationEvent}`);
        connected = true;
        commandsQueue.forEach((command) => command());
        commandsQueue = [];
    });

    return new Proxy(wrappedObject, {
        get(target, property) {
            if (augmentedMethods.includes(property)) {
                if (!connected) {
                    return function (...args) {
                        console.log(`Method queued: ${property}: ${args}`);
                        return new Promise((resolve, reject) => {
                            const command = () => {
                                target[property](...args).then(resolve, reject);
                            };
                            commandsQueue.push(command);
                        });
                    };
                }
            }

            return function (...args) {
                target[property](...args);
            };
        },
    });
}

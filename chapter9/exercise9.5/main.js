function delay(milliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let dateStr = new Date().toTimeString();
            let seconds = new Date().getSeconds();
            if (seconds % 2 == 0) {
                resolve({ milliseconds, dateStr });
            } else {
                reject(
                    new Error(`Ms: ${milliseconds}, Odd number: ${seconds}`)
                );
            }
        }, milliseconds);
    });
}

export class AsyncQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(task) {
        this.queue.push(task);
    }

    [Symbol.asyncIterator]() {
        const iterator = this.queue[Symbol.iterator]();

        return {
            async next() {
                const result = iterator.next();
                if (result.done) {
                    return { done: true };
                }

                try {
                    const value = await result.value;
                    return {
                        done: false,
                        value: value,
                    };
                } catch (err) {
                    return {
                        done: false,
                        value: err,
                    };
                }
            },
        };
    }
}

async function main() {
    const aq = new AsyncQueue();

    const millisecondsArray = [500, 500, 500, 500, 500, 500];

    millisecondsArray.forEach((ms) =>
        aq.enqueue(() =>
            delay(ms)
                .then((result) => console.log(result))
                .catch((err) => console.error(err))
        )
    );

    for await (const task of aq) {
        task();
    }
}

main();

export class Queue {
    constructor(executor) {
        this.items = [];
        this.commandQueue = [];

        const enqueue = (item) => {
            this.items.push(item);
            console.log(`Enqueued: ${item}`);
            this.printQueue();
            if (this.commandQueue.length) {
                const command = this.commandQueue.shift();
                command();
            }
        };

        executor(enqueue);
    }

    printQueue() {
        console.log(this.items);
    }

    dequeue() {
        return new Promise((resolve, reject) => {
            if (this.items.length) {
                return resolve(this.items.shift());
            }

            this.commandQueue.push(() => {
                const item = this.items.shift();
                console.log(`Unblocked queue: ${item}`);
                resolve(item);
            });
        });
    }
}

import { Queue } from "./Queue.js";

async function main() {
    const queue = new Queue((enqueue) => {
        setTimeout(() => {
            enqueue(4);
        }, 2000);

        enqueue(1);
        enqueue(2);
        enqueue(3);
    });

    console.log(`Dequeued: ${await queue.dequeue()}`);
    console.log(`Dequeued: ${await queue.dequeue()}`);
    console.log(`Dequeued: ${await queue.dequeue()}`);
    console.log(`Dequeued: ${await queue.dequeue()}`);
    console.log(`Dequeued: ${await queue.dequeue()}`);
}

main();

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

async function mapAsync(iterable, callback, concurrency) {
    const taskQueue = [];
    let running = 0;

    async function next() {
        // While the number of running tasks is under the limit,
        // and there are tasks available
        // keep running tasks
        while (running < concurrency && taskQueue.length > 0) {
            const task = taskQueue.shift();
            running++;
            try {
                await task();
            } finally {
                running--;
            }
        }
    }

    function runTask(task) {
        return new Promise((resolve, reject) => {
            taskQueue.push(() => {
                return task().then(resolve, reject);
            });
            process.nextTick(next);
        });
    }

    return await Promise.all(
        iterable.map((item) => runTask(() => callback(item)))
    );
}

const millisecondsArray = [500, 500, 500, 500, 500, 500];

const callback = (ms) =>
    delay(ms)
        .then((res) => console.log(res))
        .catch((err) => console.error(err));

mapAsync(millisecondsArray, callback, 3);

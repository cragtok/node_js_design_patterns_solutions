function delay(milliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const date = new Date();
            let dateStr = date.toTimeString();
            let seconds = date.getSeconds();
            if (seconds % 5 != 0) {
                resolve({ milliseconds, dateStr });
            } else {
                reject(
                    new Error(
                        `Ms: ${milliseconds}, Seconds divisible by 5: ${seconds}`
                    )
                );
            }
        }, milliseconds);
    });
}

async function allPromises(iterable) {
    const promiseResults = [];
    for (const task of iterable) {
        try {
            promiseResults.push(await task());
        } catch (error) {
            return error;
        }
    }

    return promiseResults;
}

const millisecondsArray = [100, 200, 300, 400, 500];
const promisesArray = millisecondsArray.map((ms) => () => delay(ms));

allPromises(promisesArray)
    .then((values) => console.log(values))
    .catch((error) => console.log(error));

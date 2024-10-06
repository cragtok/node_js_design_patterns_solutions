export async function asyncRoutine(label) {
    console.log(`Starting async routine ${label}`);
    return await new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Async routine ${label} completed`);
            resolve(`Async routine ${label} result`);
        }, 1000);
    });
}

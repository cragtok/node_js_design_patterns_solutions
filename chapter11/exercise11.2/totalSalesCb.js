import level from "level";
import sublevel from "subleveldown";

const db = level("example-db");
const salesDb = sublevel(db, "sales", { valueEncoding: "json" });

const batchedRequests = new Map();
const CACHE_TTL = 7 * 1000; // 7 seconds TTL
const cache = new Map();

const batchRequestEndListener = (batchedRequest, requestStartTime, cb) => {
    return ({ product, sum }) => {
        console.log(`totalSales() took: ${Date.now() - requestStartTime}ms`);
        batchedRequests.delete(product);
        batchedRequest.removeListener("dataComplete", batchRequestEndListener);
        cb(product, sum);
    };
};

export function totalSales(product, cb) {
    let sum = 0;

    const now = Date.now();
    const valueStream = salesDb.createReadStream();

    if (batchedRequests.has(product)) {
        console.log("Batching");
        const batchedRequest = batchedRequests.get(product);
        batchedRequest.on(
            "dataComplete",
            batchRequestEndListener(batchedRequest, now, cb)
        );
        return;
    }

    if (cache.has(product)) {
        console.log("Cache hit");
        console.log(`totalSales() took: ${Date.now() - now}ms`);
        process.nextTick(() => {
            cb(product, cache.get(product));
        });
        return;
    }

    batchedRequests.set(product, valueStream);

    valueStream.on("data", (transaction) => {
        if (!product || product === transaction.value.product) {
            sum += transaction.value.amount;
        }
    });

    const endListener = () => {
        console.log("Uncached and Unbatched");
        console.log(`totalSales() took: ${Date.now() - now}ms`);
        if (!cache.has(product)) {
            cache.set(product, sum);
            setTimeout(() => {
                cache.delete(product);
            }, CACHE_TTL);
        }
        if (batchedRequests.has(product)) {
            valueStream.emit("dataComplete", { product, sum });
            batchedRequests.delete(product);
        }
        valueStream.removeListener("end", endListener);
        cb(product, sum);
    };

    valueStream.once("end", endListener);
}

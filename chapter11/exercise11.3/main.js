import { asyncRoutine } from "./asyncRoutine.js";
import { createAsyncCancelable } from "./createAsyncCancelable.js";
import { CancelError } from "./cancelError.js";

const cancelable = createAsyncCancelable(function*() {
    const resA = yield asyncRoutine("A");
    console.log(resA);
    const resB = yield asyncRoutine("B");
    console.log(resB);
    const resC = yield asyncRoutine("C");
    console.log(resC);
    const resD = yield* nestedCancelable().generator;
    console.log(resD);
});

const nestedCancelable = createAsyncCancelable(function*() {
    const resA = yield asyncRoutine("AA");
    console.log(resA);
    const resB = yield asyncRoutine("BB");
    console.log(resB);
    const resC = yield asyncRoutine("CC");
    console.log(resC);
});

const { promise, cancel } = cancelable();
promise.catch((err) => {
    if (err instanceof CancelError) {
        console.log("Function canceled");
    } else {
        console.error(err);
    }
});

setTimeout(() => {
    cancel();
}, 1000);

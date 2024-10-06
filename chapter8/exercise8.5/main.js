import { createLazyBuffer } from "./createLazyBuffer.js";

const buffer = createLazyBuffer(50);


try {
    console.log("Log buffer:", buffer.toString()); // throws an error
} catch (e) {
    console.error("Error", e);
}

buffer.write("Hello to buffer");

console.log("Log buffer:", buffer.toString()); // success

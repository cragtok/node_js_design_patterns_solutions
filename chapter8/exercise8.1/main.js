import http from "http";
import { createHttpProxy } from "./HTTPProxy.js";

const httpProxy = createHttpProxy(http);

const main = async () => {
    try {
        const url = "http://jsonplaceholder.typicode.com/posts/10";
        const response = await httpProxy.get(url);
        console.log("Response:", response);
        const response2 = await httpProxy.get(url);
        console.log("Response:", response2);

        const url2 = "http://jsonplaceholder.typicode.com/albums/11";
        const response3 = await httpProxy.get(url2);
        console.log("Response:", response3);
        const response4 = await httpProxy.get(url2);
        console.log("Response:", response4);
    } catch (error) {
        console.error("Error:", error);
    }
};

main();

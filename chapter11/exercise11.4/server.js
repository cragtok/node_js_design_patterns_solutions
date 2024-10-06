import { createServer } from "http";
import { CodeRunnerThread } from "./codeRunnerThread.js";

createServer(async function (req, res) {
    if (req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        // res.end(JSON.stringify({ result: result || null }));
        return res.end("Server is running\n");
    }
    if (req.method === "POST") {
        let data = "";

        req.on("data", (chunk) => {
            data += chunk;
        });

        req.on("end", () => {
            try {
                data = JSON.parse(data);
                const { code, name: funcName, args } = data;

                if (!code || !funcName) {
                    throw new Error("Malformatted input");
                }
                console.log(`Received function: ${funcName}`);
                console.log(`Received arguments: ${args}`);
                console.log(`Received code: ${code.substring(0, 50)}...`);

                const codeRunnerThread = new CodeRunnerThread(
                    funcName,
                    args,
                    code
                );

                codeRunnerThread.on("end", (resultObj) => {
                    // console.log(`Output of ${funcName}: ${JSON.stringify(resultObj)}`);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify(resultObj));
                });

                codeRunnerThread.start();
            } catch (err) {
                console.log(err);
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: err.message }));
            }
        });
    }
}).listen(8000, () => console.log("Server started"));

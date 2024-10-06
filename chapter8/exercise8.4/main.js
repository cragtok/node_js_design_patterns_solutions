import { createFSAdapter } from "./fs-adapter.js";

const fileMap = {};

const fs = createFSAdapter(fileMap);

fs.writeFile("file.txt", "This is a sentence!", (res) => {
    console.log(res);
    fs.readFile("file.txt", { encoding: "utf8" }, (err, res) => {
        if (err) {
            return console.error(err);
        }
        console.log(res);
    });
});

fs.writeFile("file2.txt", "This is another sentence!", (res) => {
    console.log(res);
    fs.readFile("file2.txt", { encoding: "utf8" }, (err, res) => {
        if (err) {
            return console.error(err);
        }
        console.log(res);
    });
});

// try to read a missing file
fs.readFile("missing.txt", { encoding: "utf8" }, (err, res) => {
    console.error(err);
});

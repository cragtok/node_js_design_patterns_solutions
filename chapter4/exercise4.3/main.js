import fs from "fs";
import path from "path";
import { TaskQueue } from "./TaskQueue.js";

function searchFileContents(filePath, keyword, foundFiles, cb) {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return cb(err);
        }

        if (!data) {
            return cb(null);
        }
        const found = data.includes(keyword);

        if (found) {
            console.log(`Found in: ${filePath}`);
            foundFiles.push(filePath);
        }
        return cb(null);
    });
}

function spiderTask(dir, keyword, queue, foundFiles, cb) {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            return cb(err);
        }

        // console.log(`Directory: ${dir}`);
        files.forEach((item) => {
            if (item.isDirectory()) {
                spiderTask(
                    path.join(dir, item.name),
                    keyword,
                    queue,
                    foundFiles,
                    cb
                );
            } else if (item.isFile()) {
                queue.pushTask((cb) => {
                    searchFileContents(
                        path.join(dir, item.name),
                        keyword,
                        foundFiles,
                        cb
                    );
                });
            }
        });
    });
}

function spider(dir, keyword, queue, foundFiles, cb) {
    queue.pushTask(() => {
        spiderTask(dir, keyword, queue, foundFiles, cb);
    });
}

function recursiveFind(dir, keyword, cb) {
    if (arguments.length != 3) {
        throw new Error("Need 3 arguments: dir, keyword, cb");
    }

    if (!dir) {
        throw cb(new Error("dir is missing"));
    }

    if (!keyword) {
        throw new Error("keyword is missing");
    }

    if (typeof cb != "function") {
        throw new Error("cb must be a function");
    }

    const foundFiles = [];
    const fileQueue = new TaskQueue(4);
    fileQueue.on("error", (err) => cb(err));
    fileQueue.on("empty", () => cb(null, foundFiles));

    spider(dir, keyword, fileQueue, foundFiles, (err) => {
        if (err) {
            cb(err);
        } else {
            cb(null, foundFiles);
        }
    });
}

recursiveFind(process.argv[2], process.argv[3], (err, files) => {
    if (err) {
        console.error(err);
    } else {
        console.log(files);
    }
});

import { readdir } from "fs";

function listDirectoryContents(dir, nestingLevel) {
    readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            return cb(err);
        }

        let tabStr = "";
        for (let i = 0; i < nestingLevel; i++) {
            tabStr += "  ";
        }
        console.log(`${tabStr}Directory: ${dir}`);
        files.forEach((item) => {
            if (item.isDirectory()) {
                listDirectoryContents(`${dir}/${item.name}`, nestingLevel + 1);
            } else if (item.isFile()) {
                console.log(`${tabStr}${tabStr}File: ${item.name}`);
            }
        });
    });
}

function listNestedFiles(dir, cb) {
    if (arguments.length != 2) {
        throw new Error("Need 2 arguments: dir and cb");
    }

    if (!dir) {
        return cb(new Error("dir is missing"));
    }

    if (typeof cb != "function") {
        throw new Error("cb must be a function");
    }

    listDirectoryContents(dir, 0);
}

listNestedFiles(process.argv[2], (err) => {
    if (err) {
        console.error(err);
    }
});

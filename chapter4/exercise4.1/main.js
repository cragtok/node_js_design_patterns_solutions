import { readFile, access, constants, appendFile } from "fs";

function createFileTask(file, dest) {
    return function(cb) {
        access(file, constants.F_OK, (err) => {
            if (err) {
                return cb(new Error(`File does not exist: ${file}`));
            }

            readFile(file, (err, data) => {
                if (err) {
                    return cb(err);
                }

                appendFile(dest, data, (err) => {
                    if (err) {
                        return cb(err);
                    }
                    cb(null);
                });
            });
        });
    };
}

function concatFiles(files, dest, cb) {
    if (arguments.length != 3) {
        throw new Error("Need 3 arguments: files, dest and cb");
    }

    if (!Array.isArray(files)) {
        throw new Error("Empty files array");
    }

    if (!files.length) {
        return cb(new Error("files is empty"));
    }

    if (!dest) {
        return cb(new Error("dest is missing"));
    }

    if (typeof cb != "function") {
        throw new Error("cb must be a function");
    }

    const tasks = files.map((file) => createFileTask(file, dest));

    function iterate(index) {
        if (index == files.length) {
            return cb(null);
        }

        const task = tasks[index];

        task((err) => {
            if (err) {
                return cb(err);
            }
            iterate(index + 1);
        });
    }

    iterate(0);
}

concatFiles(["src1", "src2", "src3", "src4"], "destFile", (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Contents appended to destination file");
    }
});

export function createFSAdapter(fileMap) {
    return {
        readFile(filename, options, callback) {
            if (typeof options === "function") {
                callback = options;
                options = {};
            } else if (typeof options === "string") {
                options = { encoding: options };
            }

            if (!fileMap.hasOwnProperty(filename)) {
                const err = new Error(`ENOENT, open "${filename}"`);
                err.code = "ENOENT";
                err.errno = 34;
                err.path = filename;
                return callback && callback(err);
            }

            return callback && callback(fileMap[filename]);
        },
        writeFile(filename, contents, options, callback) {
            if (typeof options === "function") {
                callback = options;
                options = {};
            } else if (typeof options === "string") {
                options = { encoding: options };
            }

            fileMap[filename] = contents;

            return callback && callback(`Written to ${filename}`);
        },
    };
}

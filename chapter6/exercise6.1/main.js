import {
    createReadStream,
    createWriteStream,
    existsSync,
    mkdirSync,
    statSync,
} from "fs";
import { createGzip, createBrotliCompress, createDeflate } from "zlib";
import { basename } from "path";
import { PassThrough, Transform, pipeline } from "stream";
import { promisify } from "util";
const promisifiedPipeline = promisify(pipeline);
import { hrtime } from "process";

class ChunkCalculateStream extends Transform {
    constructor(name, inputFileSize) {
        super();
        this.name = name;
        this.inputFileSize = inputFileSize;
        this.totalChunkSize = 0;
        this.startTime;
        this.endTime;
        this.started = false;
    }

    _transform(chunk, encoding, cb) {
        if (!this.started) {
            this.started = true;
            this.startTime = Date.now();
        }
        this.totalChunkSize += chunk.length;
        this.push(chunk);
        cb();
    }

    _flush(cb) {
        this.endTime = Date.now();
        console.log("\n");
        console.log("==========================================");
        console.log(`Stats for ${this.name} Compression`);
        console.log("==========================================");
        console.log(`Input file size: ${this.inputFileSize}b`);
        console.log(`Compressed file size: ${this.totalChunkSize}b`);
        console.log(
            `Compression efficiency: ${((this.totalChunkSize * 100) / this.inputFileSize).toFixed(2)}%`
        );
        console.log(`Duration: ${this.endTime - this.startTime}ms`);
        console.log("==========================================");
        console.log("\n");
        cb();
    }
}

async function compressFile(
    inputStream,
    compressionName,
    compressionFunction,
    inputFileSize,
    outputFile
) {
    console.log(`Starting ${compressionName} compression`);
    const compressionStream = compressionFunction();
    const calculationStream = new ChunkCalculateStream(
        compressionName,
        inputFileSize
    );
    const outputStream = createWriteStream(outputFile);

    let passThroughStream = new PassThrough();
    inputStream.pipe(passThroughStream);
    await promisifiedPipeline(
        passThroughStream,
        compressionStream,
        calculationStream,
        outputStream
    );
}

async function main() {
    const inputFileName = process.argv[2];

    if (!inputFileName) {
        console.error("Input file name is missing!");
        process.exit(1);
    }

    const outputDirectoryName = "output";
    const inputFileNameBaseName = basename(inputFileName);

    if (!existsSync(outputDirectoryName)) {
        mkdirSync(outputDirectoryName);
    }

    const tasks = [
        {
            name: "gzip",
            algorithm: createGzip,
            outputFile: `${outputDirectoryName}/${inputFileNameBaseName}.gz`,
        },
        {
            name: "brotli",
            algorithm: createBrotliCompress,
            outputFile: `${outputDirectoryName}/${inputFileNameBaseName}.br`,
        },
        {
            name: "deflate",
            algorithm: createDeflate,
            outputFile: `${outputDirectoryName}/${inputFileNameBaseName}.deflate`,
        },
    ];

    const inputFileSize = statSync(inputFileName).size;
    let inputStream = createReadStream(inputFileName);

    try {
        await Promise.all(
            tasks.map((task) =>
                compressFile(
                    inputStream,
                    task.name,
                    task.algorithm,
                    inputFileSize,
                    task.outputFile
                )
            )
        );
    } catch (error) {
        console.error(error);
    }
}

main();

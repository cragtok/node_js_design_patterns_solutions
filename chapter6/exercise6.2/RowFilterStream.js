import { Transform } from "stream";

export class RowFilterStream extends Transform {
    constructor(rowLimit, options) {
        super({
            ...options,
            objectMode: true,
            highWaterMark: 10000,
        });
        // Set to -1 for no limit
        this.rowLimit = rowLimit;
        this.processedRows = 0;
    }

    _transform(chunk, encoding, cb) {
        // console.log(chunk);
        // console.log(`${this.processedRows + 1} ${chunk.lsoa_code}`);
        this.processedRows++;

        if (!this.push(chunk)) {
            console.log("BP");
        }

        if (this.rowLimit != -1 && this.processedRows === this.rowLimit) {
            this.emit("end");
            console.log(`MonitorStream: ${this.processedRows} rows processed`);
        } else {
            cb();
        }
    }

    _flush(done) {
        console.log(`MonitorStream: ${this.processedRows} rows processed`);
        done();
    }
}

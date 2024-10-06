import { Transform } from "stream";

export class YearlyCrimesStream extends Transform {
    constructor(options) {
        super({ ...options, objectMode: true });
        this.years = {};
    }

    _transform(chunk, encoding, cb) {
        if (chunk.year) {
            // console.log(`YearlyCrimesStream: ${chunk.lsoa_code} - ${chunk.year}`);

            if (!Object.hasOwn(this.years, chunk.year)) {
                this.years[chunk.year] = 1;
            } else {
                this.years[chunk.year] += 1;
            }
        }

        cb();
    }

    _flush(done) {
        console.log(this.years);
        done();
    }
}

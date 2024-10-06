import { Transform } from "stream";

export class LeastCommonCrimesStream extends Transform {
    constructor(options) {
        super({ ...options, objectMode: true });
        this.crimes = {};
    }

    _transform(chunk, encoding, cb) {
        if (chunk.major_category) {
            // console.log(
            //     `LeastCommonCrimesStream: ${chunk.lsoa_code} - ${chunk.major_category}`
            // );

            if (!Object.hasOwn(this.crimes, chunk.major_category)) {
                this.crimes[chunk.major_category] = 1;
            } else {
                this.crimes[chunk.major_category] += 1;
            }
        }

        cb();
    }

    _flush(done) {
        console.log(this.crimes);
        done();
    }
}

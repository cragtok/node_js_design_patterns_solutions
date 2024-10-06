import { Transform } from "stream";

export class MostCommonCrimeAreaStream extends Transform {
    constructor(options) {
        super({ ...options, objectMode: true });
        this.areas = {};
    }

    _transform(chunk, encoding, cb) {
        if (chunk.borough && chunk.major_category) {
            // console.log(
            //     `MostCommonCrimeAreaStream: ${chunk.lsoa_code} - ${chunk.major_category}`
            // );

            if (!Object.hasOwn(this.areas, chunk.borough)) {
                this.areas[chunk.borough] = {};
            } 

            if (
                !Object.hasOwn(this.areas[chunk.borough], chunk.major_category)
            ) {
                this.areas[chunk.borough][chunk.major_category] = 1;
            } else {
                this.areas[chunk.borough][chunk.major_category] += 1;
            }
        }

        cb();
    }

    _flush(done) {
        console.log(this.areas);
        done();
    }
}

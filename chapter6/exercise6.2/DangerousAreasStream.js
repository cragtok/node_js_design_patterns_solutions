import { Transform } from "stream";

export class DangerousAreasStream extends Transform {
    constructor(options) {
        super({ ...options, objectMode: true });
        this.areas = {};
    }

    _transform(chunk, encoding, cb) {
        if (chunk.borough) {
            // console.log(`DangerousAreasStream: ${chunk.lsoa_code} - ${chunk.borough}`);

            if (!Object.hasOwn(this.areas, chunk.borough)) {
                this.areas[chunk.borough] = 1;
            } else {
                this.areas[chunk.borough] += 1;
            }
        }

        cb();
    }

    _flush(done) {
        console.log(this.areas);
        done();
    }
}

import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { promisify } from "util";
import { PassThrough, pipeline } from "stream";
const promisifiedPipeline = promisify(pipeline);

import { RowFilterStream } from "./RowFilterStream.js";
import { YearlyCrimesStream } from "./YearlyCrimesStream.js";
import { DangerousAreasStream } from "./DangerousAreasStream.js";
import { MostCommonCrimeAreaStream } from "./MostCommonCrimeAreaStream.js";
import { LeastCommonCrimesStream } from "./LeastCommonCrimeStream.js";

async function main() {
    let inputFileStream = createReadStream(
        "./dataset/london_crime_by_lsoa.csv"
    );
    const csvParser = parse({ skip_records_with_error: true, columns: true });
    const rowFilterStream = new RowFilterStream(-1); // Row Limit - set to -1 for all rows
    const yearlyCrimesStream = new YearlyCrimesStream();
    const dangerousAreasStream = new DangerousAreasStream();
    const mostCommonCrimeAreaStream = new MostCommonCrimeAreaStream();
    const leastCommonCrimesStream = new LeastCommonCrimesStream();

    const cb = (err) => {
        if (err) {
            console.error("Error occurred in pipeline", err);
        }
    };

    try {
        pipeline(inputFileStream, csvParser, rowFilterStream, cb);
        await Promise.all([
            promisifiedPipeline(
                rowFilterStream,
                yearlyCrimesStream
            ),
            promisifiedPipeline(
                rowFilterStream,
                dangerousAreasStream
            ),
            promisifiedPipeline(
                rowFilterStream,
                mostCommonCrimeAreaStream
            ),
            promisifiedPipeline(
                rowFilterStream,
                leastCommonCrimesStream
            ),
        ]);
    } catch (error) {
        console.error(error);
    }
}

main();

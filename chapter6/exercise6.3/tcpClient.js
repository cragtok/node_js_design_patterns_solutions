import { createReadStream, existsSync, statSync } from "fs";
import { connect } from "net";
import { basename } from "path";
import { exit } from "process";

async function multiplexChannels(sources, destination) {
    let openChannels = sources.length;
    for (let i = 0; i < sources.length; i++) {
        let fileStream;
        try {
            fileStream = createReadStream(sources[i]);
        } catch (error) {
            console.error(`Error opening file ${fileName}:${error}`);
            continue;
        }

        const fileName = basename(sources[i]);

        console.log(`Initiating File Transfer for file '${fileName}'`);

        let nameBuff = Buffer.from(fileName);

        const channel_length = 1;
        const packet_type_length = 1;
        const fileNameSize_length = 4;
        const fileName_length = nameBuff.length;

        const initiationMessage = Buffer.alloc(
            channel_length +
                packet_type_length +
                fileNameSize_length +
                fileName_length
        );
        initiationMessage.writeUInt8(i + 1, 0);
        initiationMessage.writeUInt8(0, 1);
        initiationMessage.writeUInt32BE(nameBuff.length, 2);
        nameBuff.copy(initiationMessage, 6);


        destination.write(initiationMessage, () => {
            console.log(`Sending file '${fileName}'`);

            fileStream
                .on("readable", function () {
                    let chunk;
                    while ((chunk = this.read()) !== null) {
                        const channel_length = 1;
                        const packet_type_length = 1;
                        const chunkLength_length = 4;
                        const chunk_length = chunk.length;
                        const outBuff = Buffer.alloc(
                            channel_length +
                                packet_type_length +
                                chunkLength_length +
                                chunk_length
                        );
                        outBuff.writeUInt8(i + 1, 0);
                        outBuff.writeUInt8(1, 1);
                        outBuff.writeUInt32BE(chunk.length, 2);
                        chunk.copy(outBuff, 6);

                        // Packets for different file buffers may get mixed up in one write.
                        // We must handle this in the server.
                        destination.write(outBuff);
                    }
                })
                .on("end", () => {
                    const channel_length = 1;
                    const packet_type_length = 1;
                    const outBuff = Buffer.alloc(
                        channel_length + packet_type_length
                    );
                    outBuff.writeUInt8(i + 1, 0);
                    outBuff.writeUInt8(2, 1);
                    destination.write(outBuff);
                    console.log(`File '${fileName}' sent`);
                    if (--openChannels === 0) {
                        destination.end();
                    }
                });
        });
    }
}

function getFileNamesFromArgs(args) {
    const files = args.slice(2);
    if (!files.length) {
        console.error("Files list missing");
        exit(1);
    }
    console.log(`\nFile Args: ${files}\n`);

    const filteredFiles = files.filter((file) => {
        if (!existsSync(file)) {
            console.log(`File ${file} does not exist`);
            return false;
        }

        return true;
    });

    return filteredFiles;
}

function main() {
    const fileNames = getFileNamesFromArgs(process.argv);
    if (!fileNames.length) {
        console.error("Please ensure all input files exist");
        exit(1);
    }
    const socket = connect(3000, () => {
        multiplexChannels(fileNames, socket);
    }).on("error", (err) => console.error(err));
}

main();

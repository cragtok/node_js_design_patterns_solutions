import { createWriteStream } from "fs";
import { createServer } from "net";

const OUTPUT_DIRECTORY = "./files";
const PORT = 3000;
const CHANNELS = {};

function demultiplexChannels(source, destinations) {
    let chunk;

    chunk = source.read(1);
    const channel = chunk && chunk.readUInt8(0);
    if (channel === null) {
        return null;
    }

    chunk = source.read(1);
    const packetType = chunk && chunk.readUInt8(0);
    if (packetType === null) {
        return null;
    }

    if (packetType === 0) {
        console.log(`New channel: ${channel}`);

        chunk = source.read(4);
        const fileNameLength = chunk && chunk.readUInt32BE(0);
        if (fileNameLength === null) {
            return null;
        }
        console.log(`Filename length: ${fileNameLength}`);

        const fileName = source.read(fileNameLength);
        if (fileName === null) {
            return null;
        }
        console.log(`New file: ${fileName}`);

        if (!Object.hasOwn(destinations, channel)) {
            destinations[channel] = {
                fileName: fileName.toString(),
            };
            let fileOutputStream;
            try {
                fileOutputStream = createWriteStream(
                    `${OUTPUT_DIRECTORY}/${destinations[channel].fileName}`
                );
            } catch (error) {
                console.error(
                    `Error opening output file for channel ${channel}: ${error}`
                );
                delete destinations[channel];
                fileOutputStream.close();
                return null;
            }
            destinations[channel]["outputStream"] = fileOutputStream;
        }
    } else if (packetType === 1) {
        chunk = source.read(4);

        const packetLength = chunk && chunk.readUInt32BE(0);
        if (packetLength === null) {
            return null;
        }

        chunk = source.read(packetLength);
        if (chunk === null) {
            return null;
        }

        destinations[channel]["outputStream"].write(chunk);
    } else if (packetType === 2) {
        try {
            destinations[channel]["outputStream"].close();
            console.log(
                `Channel ${channel}: ${destinations[channel].fileName} written`
            );
            delete destinations[channel];
        } catch (error) {
            console.error(`Error closing channel: ${channel}: ${error}`);
        }
    }

    // when receiving multiple files, the socket may combine packets from separate files into the buffer, so we must consume all the data in the chunk
    if (source.readableLength > 0) {
        demultiplexChannels(source, destinations);
    }
}

function main() {
    const server = createServer((socket) => {
        socket
            .on("readable", () => {
                demultiplexChannels(socket, CHANNELS);
            })
            .on("end", () => {
                console.log("END");
            });
    });

    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

main();

import { readdir, readFile } from 'node:fs/promises';
import { createServer } from 'http';
import { Readable } from 'stream';
import colors from 'colors/safe.js';

async function readFrames() {
    const framesPath = 'frames';
    const files = await readdir(framesPath);

    return await Promise.all(files.map(async (file) => {
        const frame = await readFile(`${framesPath}/${file}`);
        return frame.toString();
    }));
}


const colorList = [
    'red',
    'yellow',
    'green',
    'blue',
    'magenta',
    'cyan',
    'white'
];

const numColors = colorList.length;
const selectColor = previousColor => {
    let color;

    do {
        color = Math.floor(Math.random() * numColors);
    } while (color === previousColor);

    return color;
};

const streamFrames = async (stream) => {
    let index = 0;
    let lastColor;

    let frames;
    try {
        frames = await readFrames();
    } catch (error) {
        console.log('Error loading frames');
        console.log(err);
        return;
    }

    return setInterval(() => {
        const newColor = lastColor = selectColor(lastColor);
        stream.push(colors[colorList[newColor]](frames[index]));
        index = (index + 1) % frames.length;
    }, 70);
};



const port = process.env.PORT || 3000;

createServer((req, res) => {
    const stream = new Readable();
    stream._read = function() { };
    stream.pipe(res);
    const interval = streamFrames(stream);
    req.on('close', () => {
        stream.destroy();
        clearInterval(interval);
    });
}).listen(port, err => {
    if (err) throw err;
    console.log(`Listening on localhost:${port}`);
});

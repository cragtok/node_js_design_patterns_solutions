import { EventEmitter } from "events";

function Ticker(number, callback) {
    const emitter = new EventEmitter();
    if (!number) {
        callback(new TypeError);
        return emitter;
    }

    if (number < 1) {
        callback(new RangeError);
        return emitter;
    }


    let msPassed = 0;
    let numTicksEmitted = 0;

    const tickerFunc = () => {
        msPassed += 50;
        numTicksEmitted++;
        emitter.emit("tick", numTicksEmitted, msPassed);
        if (msPassed < number) {
            setTimeout(tickerFunc, 50);
        } else {
            callback(null, numTicksEmitted);
        }
    }

    setTimeout(tickerFunc, 50);

    return emitter;
}


Ticker(1000, (err, numTicksEmitted) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Number of ticks emitted: ${numTicksEmitted}`)
    }
}).on("tick", (numTicks, msPassed) => console.log(`${msPassed}ms: Tick #${numTicks}`));

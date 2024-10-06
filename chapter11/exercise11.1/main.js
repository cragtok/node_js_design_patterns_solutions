import EventEmitter from "events";
import { PIQWrapper } from "./PIQWrapper.js";

class DB extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
    }

    async query(queryString) {
        console.log(`Query executed on DB1: ${queryString}`);
    }

    printName() {
        console.log(this.name);
    }

    connect() {
        setTimeout(() => {
            this.connected = true;
            this.emit("connected");
        }, 2000);
    }
}

async function main() {
    const db = new DB("DB1");
    db.connect();
    const wrapperDB = PIQWrapper(db, {
        augmentedMethods: ["query"],
        initializationEvent: "connected",
    });

    wrapperDB.printName();
    wrapperDB.printName();
    wrapperDB.query("INSERT INTO DB");
    wrapperDB.query("DELETE FROM DB");
    wrapperDB.query("UPDATE TABLE");
    wrapperDB.printName();
}

main();

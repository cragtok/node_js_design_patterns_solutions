import { ArrivingState, StoredState, DeliveredState } from "./stateClasses.js";

export class WarehouseItem {
    constructor(id, state) {
        this.id = id;
        // arriving, stored, delivered
        this.state = state;
    }

    store(locationId) {
        if (this.state instanceof DeliveredState) {
            throw new Error("Delivered item cannot be stored");
        }
        this.state = new StoredState(this.id, locationId);
    }
    deliver(address) {
        if (!(this.state instanceof StoredState)) {
            throw new Error("Item must be stored before being delivered");
        }

        this.state = new DeliveredState(this.id, address);
    }

    describe() {
        return this.state.describe();
    }
}

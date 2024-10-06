export class ArrivingState {
    constructor(id) {
        this.id = id;
    }

    describe() {
        return `Item ${this.id} is on its way to the warehouse`;
    }
}

export class StoredState {
    constructor(id, locationId) {
        this.id = id;
        this.locationId = locationId;
    }

    describe() {
        return `Item ${this.id} is stored in location ${this.locationId}`;
    }
}

export class DeliveredState {
    constructor(id, address) {
        this.id = id;
        this.address = address;
    }

    describe() {
        return `Item ${this.id} was delivered to ${this.address}`;
    }
}

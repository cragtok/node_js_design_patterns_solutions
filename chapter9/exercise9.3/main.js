import { WarehouseItem } from "./WarehouseItem.js";
import { ArrivingState, StoredState, DeliveredState } from "./stateClasses.js";

const item1 = new WarehouseItem("1", new ArrivingState("1"));

try {
    item1.store("w-1");
    console.log(item1.describe());

    item1.deliver("1st Avenue, New York");
    console.log(item1.describe());
} catch (error) {
    console.error(error.message);
}

const item2 = new WarehouseItem("2", new StoredState("2", "w-2"));

try {
    console.log(item2.describe());

    item2.deliver("2nd Avenue, New York");
    console.log(item2.describe());
} catch (error) {
    console.error(error.message);
}

const item3 = new WarehouseItem(
    "3",
    new DeliveredState("3", "3rd Avenue, New York")
);

try {
    console.log(item3.describe());
    item3.store();
} catch (error) {
    console.error(error.message);
}

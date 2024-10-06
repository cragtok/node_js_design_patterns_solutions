export class CancelError extends Error {
    constructor(cancelledObject) {
        super("Canceled");
        this.isCanceled = true;
        this.cancelledObject = cancelledObject;
    }
}

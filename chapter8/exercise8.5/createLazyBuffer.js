export function createLazyBuffer(size) {
    let buffer = null;
    return new Proxy(
        {},
        {
            get(target, property) {
                if (property === "write") {
                    return function(data) {
                        if (!buffer) {
                            buffer = Buffer.alloc(size);
                        }
                        buffer.write(data);
                    };
                }
                if (!buffer) {
                    return () => {
                        throw new Error(
                            `${property} method cannot be called. Please write to buffer first`
                        );
                    };
                }
                return buffer[property].bind(buffer);
            },
        }
    );
}

import { request } from "https";

export class RequestBuilder {
    setMethod(method) {
        if (!method) {
            throw new Error("Method not provided");
        }
        this.method = method;
        return this;
    }

    setHostname(hostname) {
        this.hostname = hostname;
        return this;
    }

    setHeader(header, parameter) {
        if (!this.headers) {
            this.headers = {};
        }

        this.headers[header] = parameter;
        return this;
    }

    setPort(port) {
        this.port = Number(port);
        return this;
    }

    setPath(path) {
        this.path = path;
        return this;
    }

    setBody(body) {
        this.body = body || "";
        return this;
    }

    build() {
        this.options = {
            hostname: this.hostname,
            method: this.method,
            port: this.port || 80,
            path: this.path,
        };

        if (this.headers) {
            options["headers"] = this.headers;
        }

        return this;
    }

    async invoke() {
        if (!this.options) {
            throw new Error("Request not built");
        }

        if (!this.options.method) {
            throw new Error("No method provided");
        }

        if (!this.options.hostname) {
            throw new Error("No hostname provided");
        }

        if (!this.options.path) {
            this.options.path = "/";
        }

        return new Promise((resolve, reject) => {
            const req = request(this.options, (res) => {
                res.setEncoding("utf8");
                res.on("data", (chunk) => {
                    console.log(`Body: ${chunk}`);
                });
                res.on("end", () => {
                    console.log(`No more data`);
                    resolve(res.statusCode);
                });
            });

            req.on("error", (e) => {
                console.log(`problem: ${e.message}`);
                reject(e);
            });

            if (this.method.toUpperCase() == "POST") {
                req.write(this.postData);
            }

            req.end();
        });
    }
}

export function createHttpProxy(httpClient) {
    const requestCache = {};
    return new Proxy(httpClient, {
        get(target, property) {
            if (property === "get" && typeof target[property] === "function") {
                return function(url, options, callback) {
                    return new Promise((resolve, reject) => {
                        if (requestCache.hasOwnProperty(url)) {
                            console.log("FROM CACHE: ");
                            return resolve(requestCache[url]);
                        }
                        httpClient
                            .get(url, options, (res) => {
                                let data = "";
                                res.on("data", (chunk) => {
                                    data += chunk;
                                });
                                res.on("end", () => {
                                    requestCache[url] = data;
                                    resolve(data);
                                });
                            })
                            .on("error", (err) => {
                                reject(err);
                            });
                    });
                };
            }
            return target[property];
        },
    });
}

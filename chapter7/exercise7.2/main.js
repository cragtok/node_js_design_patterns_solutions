import { RequestBuilder } from "./Builder.js";

const req = new RequestBuilder()
    .setMethod("GET")
    .setHostname("www.google.com")
    .setPort(443)
    .setPath("/")
    .build()
    .invoke();

req.then(() => console.log(`OK`)).catch((err) => console.log(`NOT OK: ${err}`));

import { test } from "vitest";
import { sanitizeHeaders } from "../../src/js/sanitizeHeaders.ts";

test.concurrent.for(["Authorization", "authorization", "AUTHORIZATION", "aUtHoRiZaTiOn"])('the "%s" header is redacted', (name, { expect }) => {
    const result = sanitizeHeaders({
        [name]: "Bearer 123"
    });

    expect(result[name]).toBe("**redacted**");
});

test.concurrent.for(["Proxy-Authorization", "Cookie", "Set-Cookie", "X-CSRF-Token", "X-XSRF-TOKEN", "X-Api-Key", "apikey", "X-Auth-Token", "X-Session-Id", "X-Client-Secret", "x-honeycomb-team"])('the "%s" header is redacted', (name, { expect }) => {
    const result = sanitizeHeaders({
        [name]: "Sensitive stuff"
    });

    expect(result[name]).toBe("**redacted**");
});

test.concurrent("when the headers are derived from a Headers object, the lowercased credential headers are redacted", ({ expect }) => {
    // A Headers object lowercases the header names. The names are hardcoded because the Headers implementation
    // of happy-dom preserves the original casing.
    const result = sanitizeHeaders({
        authorization: "Bearer 123",
        cookie: "session=123",
        "content-type": "application/json"
    });

    expect(result).toEqual({
        authorization: "**redacted**",
        cookie: "**redacted**",
        "content-type": "application/json"
    });
});

test.concurrent("the headers that are not credentials are preserved", ({ expect }) => {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Content-Length": "123",
        traceparent: "00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01"
    };

    const result = sanitizeHeaders(headers);

    expect(result).toEqual(headers);
});

test.concurrent("when the headers are indexed by their position, the headers are redacted", ({ expect }) => {
    const result = sanitizeHeaders({
        0: "Authorization,Bearer 123",
        1: "Content-Type,application/json"
    });

    expect(result).toEqual({
        0: "**redacted**",
        1: "**redacted**"
    });
});

test.concurrent.for([undefined, null, "Authorization: Bearer 123", 123])("when the headers are %s, return an empty object", (headers, { expect }) => {
    const result = sanitizeHeaders(headers);

    expect(result).toEqual({});
});

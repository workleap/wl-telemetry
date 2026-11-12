import { test } from "vitest";
import { createRequestSanitizer } from "../../src/js/createRequestSanitizer.ts";
import type { LogRocketRequest } from "../../src/js/logRocketTypes.ts";

test.concurrent("the request authorization header is redacted", ({ expect }) => {
    const request = {
        reqId: "123",
        url: "http://www.123.com",
        headers: {
            Authorization: "Sensitive stuff",
            AnotherHeader: "Other stuff"
        },
        body: "456",
        method: "POST"
    } satisfies LogRocketRequest;

    const requestSanitizer = createRequestSanitizer(x => x);
    const result = requestSanitizer(request) as LogRocketRequest;

    expect(result.headers["Authorization"]).toBe("**redacted**");
    expect(result.headers["AnotherHeader"]).toBe("Other stuff");
});

test.concurrent("the request credential headers are redacted regardless of their casing", ({ expect }) => {
    const request = {
        reqId: "123",
        url: "http://www.123.com",
        headers: {
            authorization: "Sensitive stuff",
            Cookie: "Sensitive stuff",
            "x-api-key": "Sensitive stuff",
            AnotherHeader: "Other stuff"
        },
        body: "456",
        method: "POST"
    } satisfies LogRocketRequest;

    const requestSanitizer = createRequestSanitizer(x => x);
    const result = requestSanitizer(request) as LogRocketRequest;

    expect(result.headers).toEqual({
        authorization: "**redacted**",
        Cookie: "**redacted**",
        "x-api-key": "**redacted**",
        AnotherHeader: "Other stuff"
    });
});

test.concurrent("when the request has no headers, do not throw", ({ expect }) => {
    const request = {
        reqId: "123",
        url: "http://www.123.com",
        body: "456",
        method: "POST"
    } as LogRocketRequest;

    const requestSanitizer = createRequestSanitizer(x => x);
    const result = requestSanitizer(request) as LogRocketRequest;

    expect(result.headers).toEqual({});
});

test.concurrent("the request body is redacted", ({ expect }) => {
    const request = {
        reqId: "123",
        url: "http://www.123.com",
        headers: {
            Authorization: "Sensitive stuff",
            AnotherHeader: "Other stuff"
        },
        body: "456",
        method: "POST"
    } satisfies LogRocketRequest;

    const requestSanitizer = createRequestSanitizer(x => x);
    const result = requestSanitizer(request) as LogRocketRequest;

    expect(result.body).toBe("**redacted**");
});

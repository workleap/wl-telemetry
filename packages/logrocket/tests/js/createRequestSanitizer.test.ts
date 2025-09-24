import { test } from "vitest";
import { createRequestSanitizer } from "../../src/js/createRequestSanitizer.ts";
import type { LogRocketRequest } from "../../src/js/logRocketTypes.ts";

test.concurrent("the request authorization header is redacted", ({ expect }) => {
    const request = {
        reqId: "123",
        url: "http://www.123.com",
        headers: {
            "Authorization": "Sensitive stuff",
            "AnotherHeader": "Other stuff"
        },
        body: "456",
        method: "POST"
    } satisfies LogRocketRequest;

    const requestSanitizer = createRequestSanitizer(x => x);
    const result = requestSanitizer(request) as LogRocketRequest;

    expect(result.headers["Authorization"]).toBe("**redacted**");
    expect(result.headers["AnotherHeader"]).toBe("Other stuff");
});

test.concurrent("the request body is redacted", ({ expect }) => {
    const request = {
        reqId: "123",
        url: "http://www.123.com",
        headers: {
            "Authorization": "Sensitive stuff",
            "AnotherHeader": "Other stuff"
        },
        body: "456",
        method: "POST"
    } satisfies LogRocketRequest;

    const requestSanitizer = createRequestSanitizer(x => x);
    const result = requestSanitizer(request) as LogRocketRequest;

    expect(result.body).toBe("**redacted**");
});

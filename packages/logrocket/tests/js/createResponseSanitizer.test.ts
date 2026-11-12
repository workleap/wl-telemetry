import { test } from "vitest";
import { createResponseSanitizer } from "../../src/js/createResponseSanitizer.ts";
import type { LogRocketResponse } from "../../src/js/logRocketTypes.ts";

test.concurrent("the response credential headers are redacted", ({ expect }) => {
    const response = {
        reqId: "123",
        url: "http://www.123.com",
        headers: {
            "set-cookie": "Sensitive stuff",
            "X-Auth-Token": "Sensitive stuff",
            AnotherHeader: "Other stuff"
        },
        body: "456",
        method: "POST"
    } satisfies LogRocketResponse;

    const responseSanitizer = createResponseSanitizer(x => x);
    const result = responseSanitizer(response) as LogRocketResponse;

    expect(result.headers).toEqual({
        "set-cookie": "**redacted**",
        "X-Auth-Token": "**redacted**",
        AnotherHeader: "Other stuff"
    });
});

test.concurrent("when the response has no headers, do not throw", ({ expect }) => {
    const response = {
        reqId: "123",
        url: "http://www.123.com",
        body: "456",
        method: "POST"
    } as LogRocketResponse;

    const responseSanitizer = createResponseSanitizer(x => x);
    const result = responseSanitizer(response) as LogRocketResponse;

    expect(result.headers).toEqual({});
});

test.concurrent("the response body is redacted", ({ expect }) => {
    const response = {
        reqId: "123",
        url: "http://www.123.com",
        headers: {
            AnotherHeader: "Other stuff"
        },
        body: "456",
        method: "POST"
    } satisfies LogRocketResponse;

    const responseSanitizer = createResponseSanitizer(x => x);
    const result = responseSanitizer(response) as LogRocketResponse;

    expect(result.body).toBe("**redacted**");
});

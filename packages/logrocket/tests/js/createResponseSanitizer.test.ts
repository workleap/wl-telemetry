import { test } from "vitest";
import { createResponseSanitizer } from "../../src/js/createResponseSanitizer.ts";
import type { LogRocketResponse } from "../../src/js/logRocketTypes.ts";

test.concurrent("the response body is redacted", ({ expect }) => {
    const response = {
        reqId: "123",
        url: "http://www.123.com",
        headers: {
            "AnotherHeader": "Other stuff"
        },
        body: "456",
        method: "POST"
    } satisfies LogRocketResponse;

    const responseSanitizer = createResponseSanitizer(x => x);
    const result = responseSanitizer(response) as LogRocketResponse;

    expect(result.body).toBe("**redacted**");
});

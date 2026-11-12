import { NoopLogger } from "@workleap/logging";
import { test, vi } from "vitest";
import type { LogRocketRequest, LogRocketResponse } from "../../src/js/logRocketTypes.ts";
import { getLogRocketSdkOptions } from "../../src/js/registerLogRocketInstrumentation.ts";

vi.mock("logrocket", () => ({
    default: {
        init: vi.fn(),
        identify: vi.fn(),
        log: vi.fn(),
        track: vi.fn(),
        getSessionURL: vi.fn()
    }
}));

test.concurrent("when a rootHostname is provided", ({ expect }) => {
    const result = getLogRocketSdkOptions(
        {
            rootHostname: "toto"
        },
        new NoopLogger()
    );

    expect(result).toMatchSnapshot();
});

test.concurrent("when privateFieldNames are provided", ({ expect }) => {
    const result = getLogRocketSdkOptions(
        {
            privateFieldNames: ["foo", "bar"]
        },
        new NoopLogger()
    );

    expect(result).toMatchSnapshot();
});

test.concurrent("when privateQueryParameterNames are provided", ({ expect }) => {
    const result = getLogRocketSdkOptions(
        {
            privateQueryParameterNames: ["foo", "bar"]
        },
        new NoopLogger()
    );

    expect(result).toMatchSnapshot();
});

test.concurrent("when verbose is true", ({ expect }) => {
    const result = getLogRocketSdkOptions(
        {
            verbose: true
        },
        new NoopLogger()
    );

    expect(result).toMatchSnapshot();
});

test.concurrent("with a single transformer", ({ expect }) => {
    const result = getLogRocketSdkOptions(
        {
            transformers: [
                options => {
                    options.rootHostname = "toto";

                    return options;
                }
            ]
        },
        new NoopLogger()
    );

    expect(result).toMatchSnapshot();
});

test.concurrent("with a multiple transformers", ({ expect }) => {
    const result = getLogRocketSdkOptions(
        {
            transformers: [
                options => {
                    options.rootHostname = "toto";

                    return options;
                },
                options => {
                    options.serverURL = "foo";

                    return options;
                }
            ]
        },
        new NoopLogger()
    );

    expect(result).toMatchSnapshot();
});

test.concurrent("the credential headers of the network requests and responses are redacted", ({ expect }) => {
    const result = getLogRocketSdkOptions({}, new NoopLogger());

    const request = result.network?.requestSanitizer?.({
        reqId: "123",
        url: "http://www.123.com",
        headers: {
            authorization: "Sensitive stuff",
            "Content-Type": "application/json"
        },
        body: "{}",
        method: "POST"
    });

    const response = result.network?.responseSanitizer?.({
        reqId: "123",
        url: "http://www.123.com",
        headers: {
            "set-cookie": "Sensitive stuff",
            "Content-Type": "application/json"
        },
        body: "{}",
        method: "POST",
        status: 200
    });

    expect((request as LogRocketRequest).headers).toEqual({
        authorization: "**redacted**",
        "Content-Type": "application/json"
    });

    expect((response as LogRocketResponse).headers).toEqual({
        "set-cookie": "**redacted**",
        "Content-Type": "application/json"
    });
});

test.concurrent("when a network request or response has no headers, do not throw", ({ expect }) => {
    const result = getLogRocketSdkOptions({}, new NoopLogger());

    const request = result.network?.requestSanitizer?.({
        reqId: "123",
        url: "http://www.123.com",
        body: "{}",
        method: "POST"
    } as never);

    const response = result.network?.responseSanitizer?.({
        reqId: "123",
        url: "http://www.123.com",
        body: "{}",
        method: "POST",
        status: 200
    } as never);

    expect((request as LogRocketRequest).headers).toEqual({});
    expect((response as LogRocketResponse).headers).toEqual({});
});

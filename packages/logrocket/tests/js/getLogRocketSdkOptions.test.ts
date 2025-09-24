import { NoopLogger } from "@workleap/logging";
import { test, vi } from "vitest";
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
    const result = getLogRocketSdkOptions({
        rootHostname: "toto"
    }, new NoopLogger());

    expect(result).toMatchSnapshot();
});

test.concurrent("when privateFieldNames are provided", ({ expect }) => {
    const result = getLogRocketSdkOptions({
        privateFieldNames: ["foo", "bar"]
    }, new NoopLogger());

    expect(result).toMatchSnapshot();
});

test.concurrent("when privateQueryParameterNames are provided", ({ expect }) => {
    const result = getLogRocketSdkOptions({
        privateQueryParameterNames: ["foo", "bar"]
    }, new NoopLogger());

    expect(result).toMatchSnapshot();
});

test.concurrent("when verbose is true", ({ expect }) => {
    const result = getLogRocketSdkOptions({
        verbose: true
    }, new NoopLogger());

    expect(result).toMatchSnapshot();
});

test.concurrent("with a single transformer", ({ expect }) => {
    const result = getLogRocketSdkOptions({
        transformers: [
            options => {
                options.rootHostname = "toto";

                return options;
            }
        ]
    }, new NoopLogger());

    expect(result).toMatchSnapshot();
});

test.concurrent("with a multiple transformers", ({ expect }) => {
    const result = getLogRocketSdkOptions({
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
    }, new NoopLogger());

    expect(result).toMatchSnapshot();
});

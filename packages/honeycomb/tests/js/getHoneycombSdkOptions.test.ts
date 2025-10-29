import type { Instrumentation, InstrumentationConfig } from "@opentelemetry/instrumentation";
import type { SpanProcessor } from "@opentelemetry/sdk-trace-web";
import { test } from "vitest";
import { FetchRequestPipeline } from "../../src/js/FetchRequestPipeline.ts";
import { GlobalAttributeSpanProcessor } from "../../src/js/GlobalAttributeSpanProcessor.ts";
import { getHoneycombSdkOptions } from "../../src/js/registerHoneycombInstrumentation.ts";

class DummyInstrumentation implements Instrumentation {
    instrumentationName: string = "dummy";
    instrumentationVersion: string = "1.0.0";

    disable(): void {
        throw new Error("Method not implemented.");
    }

    enable(): void {
        throw new Error("Method not implemented.");
    }

    setTracerProvider(): void {
        throw new Error("Method not implemented.");
    }

    setMeterProvider(): void {
        throw new Error("Method not implemented.");
    }

    setConfig(): void {
        throw new Error("Method not implemented.");
    }

    getConfig(): InstrumentationConfig {
        throw new Error("Method not implemented.");
    }
}

class DummySpanProcessor implements SpanProcessor {
    forceFlush(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    onStart(): void {
        throw new Error("Method not implemented.");
    }

    onEnd(): void {
        throw new Error("Method not implemented.");
    }

    shutdown(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeInstrumentationVersionsForSnapshot(options: any) {
    if (Array.isArray(options.instrumentations)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options.instrumentations.forEach(x => {
            if (x["instrumentationVersion"]) {
                delete x["instrumentationVersion"];
            }

            if (x["version"]) {
                delete x["version"];
            }

            if (x["_logger"]?.["version"]) {
                delete x["_logger"]["version"];
            }

            if (x["_tracer"]?.["version"]) {
                delete x["_tracer"]["version"];
            }
        });
    }

    return options;
}

test.concurrent("do not throw when an api key is provided", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    expect(() => getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        apiKey: "123"
    })).not.toThrow();
});

test.concurrent("do not throw when a proxy is provided", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    expect(() => getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        proxy: "https://my-proxy.com"
    })).not.toThrow();
});

test.concurrent("throw when both the api key and proxy options are not provided", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    expect(() => getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline)).toThrow();
});

test.concurrent("when verbose is true", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        verbose: true,
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when verbose is false", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        verbose: false,
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("with custom instrumentations", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        instrumentations: [new DummyInstrumentation()],
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("with custom span processors", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        spanProcessors: [new DummySpanProcessor()],
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when fetch instrumentation is false", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        fetchInstrumentation: false,
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when fetch instrumentation is a custom function", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        fetchInstrumentation: defaultOptions => ({ ...defaultOptions, ignoreNetworkEvents: false }),
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

// Intentionally not concurrent.
test("when fetch instrumentation custom function returns a request hook, automatically add the request hook to the pipeline", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        fetchInstrumentation: defaultOptions => ({
            ...defaultOptions,
            requestHook: () => {
                console.log("toto");
            }
        }),
        apiKey: "123"
    });

    expect(fetchRequestPipeline.hookCount).toBe(1);
});

test.concurrent("when xml http instrumentation is false", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        xmlHttpRequestInstrumentation: false,
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when xml http instrumentation is a custom function", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        xmlHttpRequestInstrumentation: defaultOptions => ({ ...defaultOptions, ignoreNetworkEvents: false }),
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when document load instrumentation is false", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        documentLoadInstrumentation: false,
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when document load instrumentation is a custom function", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        documentLoadInstrumentation: defaultOptions => ({ ...defaultOptions, ignoreNetworkEvents: false }),
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when user interaction instrumentation is false", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        userInteractionInstrumentation: false,
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when user interaction instrumentation is a custom function", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        userInteractionInstrumentation: defaultOptions => ({ ...defaultOptions, ignoreNetworkEvents: false }),
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("with a single transformer", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        transformers: [
            options => {
                options.serviceName = "toto";

                return options;
            }
        ],
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("with multiple transformers", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        transformers: [
            options => {
                options.serviceName = "toto";

                return options;
            },
            options => {
                options.apiKey = "toto";

                return options;
            }
        ],
        apiKey: "123"
    });

    const cleanedResult = removeInstrumentationVersionsForSnapshot(result);

    expect(cleanedResult).toMatchSnapshot();
});

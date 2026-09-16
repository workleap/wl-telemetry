import type { Instrumentation, InstrumentationConfig } from "@opentelemetry/instrumentation";
import { InMemorySpanExporter, type SpanProcessor } from "@opentelemetry/sdk-trace-web";
import { test } from "vitest";
import { FetchRequestPipeline } from "../../src/js/FetchRequestPipeline.ts";
import { GlobalAttributeSpanProcessor } from "../../src/js/GlobalAttributeSpanProcessor.ts";
import { ProxyTraceExporter } from "../../src/js/ProxyTraceExporter.ts";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function replaceTraceExportersForSnapshot(options: any) {
    if (Array.isArray(options.traceExporters)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options.traceExporters = options.traceExporters.map((x: any) => x.constructor.name);
    }

    return options;
}

test.concurrent("when a proxy is provided", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        proxy: "https://my-proxy.com"
    });

    const cleanedResult = replaceTraceExportersForSnapshot(removeInstrumentationVersionsForSnapshot(result));

    expect(cleanedResult).toMatchSnapshot();
});

test.concurrent("when a proxy is provided, disable the default exporters and add a proxy trace exporter", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        proxy: "https://my-proxy.com"
    });

    expect(result.disableDefaultTraceExporter).toBe(true);
    expect(result.disableDefaultMetricExporter).toBe(true);
    expect(result.disableDefaultLogExporter).toBe(true);
    expect(result.traceExporters).toHaveLength(1);

    const exporter = result.traceExporters![0] as ProxyTraceExporter;

    expect(exporter).toBeInstanceOf(ProxyTraceExporter);
    expect(exporter.url).toBe("https://my-proxy.com/v1/traces");
    expect(exporter.credentials).toBe("include");
});

test.concurrent("when a proxy is provided, the fetch instrumentation ignores the proxy traces url", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        proxy: "https://my-proxy.com"
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchInstrumentation = (result.instrumentations as any[]).find(x => x.instrumentationName === "@opentelemetry/instrumentation-fetch");

    expect(fetchInstrumentation.getConfig().ignoreUrls).toEqual(["https://my-proxy.com/v1/traces"]);
});

test.concurrent("when a proxy and credentials are provided, the proxy trace exporter uses the credentials", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        proxy: "https://my-proxy.com",
        credentials: "same-origin"
    });

    const exporter = result.traceExporters![0] as ProxyTraceExporter;

    expect(exporter.credentials).toBe("same-origin");
});

test.concurrent("when an api key is provided, do not disable the default exporters nor add a proxy trace exporter", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        apiKey: "123"
    });

    expect(result.disableDefaultTraceExporter).toBeUndefined();
    expect(result.disableDefaultMetricExporter).toBeUndefined();
    expect(result.disableDefaultLogExporter).toBeUndefined();
    expect(result.traceExporters).toBeUndefined();
});

test.concurrent("when a transformer changes the endpoint, the proxy trace exporter uses the transformed endpoint", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        proxy: "https://my-proxy.com",
        transformers: [
            options => {
                options.tracesEndpoint = "https://my-other-proxy.com/otlp";
                options.tracesHeaders = { "x-foo": "bar" };

                return options;
            }
        ]
    });

    const exporter = result.traceExporters![0] as ProxyTraceExporter;

    expect(exporter.url).toBe("https://my-other-proxy.com/otlp");
    expect(exporter.headers["x-foo"]).toBe("bar");
});

test.concurrent("when a transformer adds trace exporters, they are preserved", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const customExporter = new InMemorySpanExporter();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        proxy: "https://my-proxy.com",
        transformers: [
            options => {
                options.traceExporters = [customExporter];

                return options;
            }
        ]
    });

    expect(result.traceExporters).toHaveLength(2);
    expect(result.traceExporters![0]).toBe(customExporter);
    expect(result.traceExporters![1]).toBeInstanceOf(ProxyTraceExporter);
});

test.concurrent("when a transformer keeps the default trace exporter, do not add a proxy trace exporter", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        proxy: "https://my-proxy.com",
        transformers: [
            options => {
                options.disableDefaultTraceExporter = false;

                return options;
            }
        ]
    });

    expect(result.disableDefaultTraceExporter).toBe(false);
    expect(result.traceExporters).toBeUndefined();
});

test.concurrent("when a transformer keeps the default metric and log exporters, the flags are preserved", ({ expect }) => {
    const globalAttributeSpanProcessor = new GlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const result = getHoneycombSdkOptions("foo", ["/foo"], globalAttributeSpanProcessor, fetchRequestPipeline, {
        proxy: "https://my-proxy.com",
        transformers: [
            options => {
                options.disableDefaultMetricExporter = false;
                options.disableDefaultLogExporter = false;

                return options;
            }
        ]
    });

    expect(result.disableDefaultMetricExporter).toBe(false);
    expect(result.disableDefaultLogExporter).toBe(false);
});

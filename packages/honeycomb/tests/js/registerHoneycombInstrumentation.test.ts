import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { type LogRocketInstrumentationPartialClient, TelemetryContext } from "@workleap-telemetry/core";
import { afterEach, test, vi } from "vitest";
import { FetchRequestPipeline } from "../../src/js/FetchRequestPipeline.ts";
import { GlobalAttributeSpanProcessor } from "../../src/js/GlobalAttributeSpanProcessor.ts";
import {
    DeviceIdAttributeName,
    HoneycombInstrumentationRegistrator,
    type HoneycombSdkFactory,
    registerHoneycombInstrumentation,
    ServiceNamespaceAttributeName,
    TelemetryIdAttributeName
} from "../../src/js/registerHoneycombInstrumentation.ts";

class DummyGlobalAttributeSpanProcessor extends GlobalAttributeSpanProcessor {
    get attributes() {
        return this._attributes;
    }
}

class DummyHoneycombWebSdk extends HoneycombWebSDK {
    start(): void { }
}

class DummyLogRocketInstrumentationClient implements LogRocketInstrumentationPartialClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly #listeners: any[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerGetSessionUrlListener(listener: any) {
        this.#listeners.push(listener);
    }

    get listenerCount() {
        return this.#listeners.length;
    }
}

afterEach(() => {
    vi.clearAllMocks();
});

test.concurrent("when honeycomb instrumentation has already been registered, throw an error", ({ expect }) => {
    registerHoneycombInstrumentation("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com"
    });

    expect(() => registerHoneycombInstrumentation("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com"
    })).toThrow("[honeycomb] The Honeycomb instrumentation has already been registered. Did you call the \"registerHoneycombInstrumentation\" function twice?");
});

test.concurrent("set the namespace global attribute", ({ expect }) => {
    const globalAttributeSpanProcessor = new DummyGlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const honeycombSdkFactory: HoneycombSdkFactory = x => new DummyHoneycombWebSdk({
        endpoint: x.endpoint,
        serviceName: x.serviceName
    });

    const registrator = new HoneycombInstrumentationRegistrator(globalAttributeSpanProcessor, fetchRequestPipeline, honeycombSdkFactory);

    registrator.register("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com"
    });

    expect(globalAttributeSpanProcessor.attributes[ServiceNamespaceAttributeName]).toBe("foo");
});

test.concurrent("when a telemetry context is provided, set the telemetry global attributes", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const globalAttributeSpanProcessor = new DummyGlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const honeycombSdkFactory: HoneycombSdkFactory = x => new DummyHoneycombWebSdk({
        endpoint: x.endpoint,
        serviceName: x.serviceName
    });

    const registrator = new HoneycombInstrumentationRegistrator(globalAttributeSpanProcessor, fetchRequestPipeline, honeycombSdkFactory);

    registrator.register("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com",
        telemetryContext
    });

    expect(globalAttributeSpanProcessor.attributes[TelemetryIdAttributeName]).toBe(telemetryContext.telemetryId);
    expect(globalAttributeSpanProcessor.attributes[DeviceIdAttributeName]).toBe(telemetryContext.deviceId);
});

test.concurrent("when a logrocket client is provided, register a listener for logrocket get session url", ({ expect }) => {
    const globalAttributeSpanProcessor = new DummyGlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const honeycombSdkFactory: HoneycombSdkFactory = x => new DummyHoneycombWebSdk({
        endpoint: x.endpoint,
        serviceName: x.serviceName
    });

    const logRocketInstrumentationClient = new DummyLogRocketInstrumentationClient();

    const registrator = new HoneycombInstrumentationRegistrator(globalAttributeSpanProcessor, fetchRequestPipeline, honeycombSdkFactory);

    registrator.register("foo", "bar", ["/bar"], {
        proxy: "https://my-proxy.com",
        logRocketInstrumentationClient
    });

    expect(logRocketInstrumentationClient.listenerCount).toBe(1);
});


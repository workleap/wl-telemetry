import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { BootstrappingStore, TelemetryContext } from "@workleap-telemetry/core";
import { NoopLogger } from "@workleap/logging";
import { afterEach, test, vi } from "vitest";
import { FetchRequestPipeline } from "../../src/js/FetchRequestPipeline.ts";
import { GlobalAttributeSpanProcessor } from "../../src/js/GlobalAttributeSpanProcessor.ts";
import {
    DeviceIdAttributeName,
    HoneycombInstrumentationRegistrator,
    HoneycombSdkFactory,
    IsRegisteredVariableName,
    RegisterDynamicFetchRequestHookAtStartFunctionName,
    RegisterDynamicFetchRequestHookFunctionName,
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

afterEach(() => {
    vi.clearAllMocks();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete globalThis[IsRegisteredVariableName];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete globalThis[RegisterDynamicFetchRequestHookFunctionName];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete globalThis[RegisterDynamicFetchRequestHookAtStartFunctionName];
});

test.concurrent("set the namespace global attribute", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, new NoopLogger());

    const globalAttributeSpanProcessor = new DummyGlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const honeycombSdkFactory: HoneycombSdkFactory = x => new DummyHoneycombWebSdk({
        endpoint: x.endpoint,
        serviceName: x.serviceName
    });

    const registrator = new HoneycombInstrumentationRegistrator(globalAttributeSpanProcessor, fetchRequestPipeline, honeycombSdkFactory)

    registrator.register("foo", "bar", ["/bar"], telemetryContext, bootstrappingStore, {
        proxy: "https://my-proxy.com"
    });

    expect(globalAttributeSpanProcessor.attributes[ServiceNamespaceAttributeName]).toBe("foo");
});

test.concurrent("set the telemetry global attributes", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, new NoopLogger());

    const globalAttributeSpanProcessor = new DummyGlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const honeycombSdkFactory: HoneycombSdkFactory = x => new DummyHoneycombWebSdk({
        endpoint: x.endpoint,
        serviceName: x.serviceName
    });

    const registrator = new HoneycombInstrumentationRegistrator(globalAttributeSpanProcessor, fetchRequestPipeline, honeycombSdkFactory);

    registrator.register("foo", "bar", ["/bar"], telemetryContext, bootstrappingStore, {
        proxy: "https://my-proxy.com"
    })

    expect(globalAttributeSpanProcessor.attributes[TelemetryIdAttributeName]).toBe(telemetryContext.telemetryId);
    expect(globalAttributeSpanProcessor.attributes[DeviceIdAttributeName]).toBe(telemetryContext.deviceId);
});

// DEPRECATED: Grace period ends on January 1th 2026.
// Cannot be concurrent because it's using "globaThis".
test("is registered global variable is true", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, new NoopLogger());

    const globalAttributeSpanProcessor = new DummyGlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const honeycombSdkFactory: HoneycombSdkFactory = x => new DummyHoneycombWebSdk({
        endpoint: x.endpoint,
        serviceName: x.serviceName
    });

    const registrator = new HoneycombInstrumentationRegistrator(globalAttributeSpanProcessor, fetchRequestPipeline, honeycombSdkFactory);

    registrator.register("foo", "bar", ["/bar"], telemetryContext, bootstrappingStore, {
        proxy: "https://my-proxy.com"
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(globalThis[IsRegisteredVariableName]).toBeTruthy();
});

test.concurrent("register dynamic fetch request hook function is defined", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, new NoopLogger());

    const globalAttributeSpanProcessor = new DummyGlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const honeycombSdkFactory: HoneycombSdkFactory = x => new DummyHoneycombWebSdk({
        endpoint: x.endpoint,
        serviceName: x.serviceName
    });

    const registrator = new HoneycombInstrumentationRegistrator(globalAttributeSpanProcessor, fetchRequestPipeline, honeycombSdkFactory);

    registrator.register("foo", "bar", ["/bar"], telemetryContext, bootstrappingStore, {
        proxy: "https://my-proxy.com"
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(typeof globalThis[RegisterDynamicFetchRequestHookFunctionName]).toBe("function");
});

test("register dynamic fetch request hook at start function is defined", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, new NoopLogger());

    const globalAttributeSpanProcessor = new DummyGlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const honeycombSdkFactory: HoneycombSdkFactory = x => new DummyHoneycombWebSdk({
        endpoint: x.endpoint,
        serviceName: x.serviceName
    });

    const registrator = new HoneycombInstrumentationRegistrator(globalAttributeSpanProcessor, fetchRequestPipeline, honeycombSdkFactory);

    registrator.register("foo", "bar", ["/bar"], telemetryContext, bootstrappingStore, {
        proxy: "https://my-proxy.com"
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(typeof globalThis[RegisterDynamicFetchRequestHookAtStartFunctionName]).toBe("function");
});

// Cannot be concurrent because it's using "globaThis".
test("when logrocket is ready, register a listener for logrocket get session url", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: true,
        isHoneycombReady: false
    }, new NoopLogger());

    const globalAttributeSpanProcessor = new DummyGlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const honeycombSdkFactory: HoneycombSdkFactory = x => new DummyHoneycombWebSdk({
        endpoint: x.endpoint,
        serviceName: x.serviceName
    });

    const registerGetSessionUrlListenerMock = vi.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__ = registerGetSessionUrlListenerMock;

    const registrator = new HoneycombInstrumentationRegistrator(globalAttributeSpanProcessor, fetchRequestPipeline, honeycombSdkFactory);

    registrator.register("foo", "bar", ["/bar"], telemetryContext, bootstrappingStore, {
        proxy: "https://my-proxy.com"
    });

    expect(registerGetSessionUrlListenerMock).toHaveBeenCalledOnce();
});

// Cannot be concurrent because it's using "globaThis".
test("when logrocket is not ready, register a listener for logrocket get session url once logrocket is ready", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, new NoopLogger());

    const globalAttributeSpanProcessor = new DummyGlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const honeycombSdkFactory: HoneycombSdkFactory = x => new DummyHoneycombWebSdk({
        endpoint: x.endpoint,
        serviceName: x.serviceName
    });

    const registerGetSessionUrlListenerMock = vi.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__ = registerGetSessionUrlListenerMock;

    const registrator = new HoneycombInstrumentationRegistrator(globalAttributeSpanProcessor, fetchRequestPipeline, honeycombSdkFactory);

    registrator.register("foo", "bar", ["/bar"], telemetryContext, bootstrappingStore, {
        proxy: "https://my-proxy.com"
    });

    expect(registerGetSessionUrlListenerMock).not.toHaveBeenCalled();

    bootstrappingStore.dispatch({ type: "logrocket-ready" });

    expect(registerGetSessionUrlListenerMock).toHaveBeenCalledOnce();
});

// Cannot be concurrent because it's using "globaThis".
test("honeycomb is marked as ready", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, new NoopLogger());

    const globalAttributeSpanProcessor = new DummyGlobalAttributeSpanProcessor();
    const fetchRequestPipeline = new FetchRequestPipeline();

    const honeycombSdkFactory: HoneycombSdkFactory = x => new DummyHoneycombWebSdk({
        endpoint: x.endpoint,
        serviceName: x.serviceName
    });

    const registrator = new HoneycombInstrumentationRegistrator(globalAttributeSpanProcessor, fetchRequestPipeline, honeycombSdkFactory);

    registrator.register("foo", "bar", ["/bar"], telemetryContext, bootstrappingStore, {
        proxy: "https://my-proxy.com"
    });

    expect(bootstrappingStore.state.isHoneycombReady).toBeTruthy();
});



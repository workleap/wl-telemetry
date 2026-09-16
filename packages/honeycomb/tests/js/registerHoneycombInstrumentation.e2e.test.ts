import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { context, metrics, propagation, trace } from "@opentelemetry/api";
import { logs } from "@opentelemetry/api-logs";
import { afterEach, test, vi } from "vitest";
import { FetchRequestPipeline } from "../../src/js/FetchRequestPipeline.ts";
import { GlobalAttributeSpanProcessor } from "../../src/js/GlobalAttributeSpanProcessor.ts";
import { HoneycombInstrumentationRegistrator, type RegisterHoneycombInstrumentationOptions } from "../../src/js/registerHoneycombInstrumentation.ts";

// These tests run the real Honeycomb Web SDK (see the "browser" resolve condition in vitest.config.ts) to validate
// that the SDK honors the exporter options set in proxy mode. They guard against the SDK changing how the
// "traceExporters" and "disableDefault*" options are handled.

let sdk: HoneycombWebSDK | undefined;

function register(options: RegisterHoneycombInstrumentationOptions) {
    const registrator = new HoneycombInstrumentationRegistrator(
        new GlobalAttributeSpanProcessor(),
        new FetchRequestPipeline(),
        x => {
            sdk = new HoneycombWebSDK(x);

            return sdk;
        }
    );

    return registrator.register("foo", "bar", ["/bar"], {
        // The instrumentations are not needed for these tests and they patch the globals.
        fetchInstrumentation: false,
        documentLoadInstrumentation: false,
        ...options
    });
}

async function recordSpanAndFlush(name: string) {
    trace.getTracer("e2e").startSpan(name).end();

    // Shutting down the SDK flushes the batch span processor and the exporters.
    await sdk!.shutdown();
}

function getRequests(fetchMock: ReturnType<typeof vi.fn>, path: string) {
    return fetchMock.mock.calls
        .filter(([url]) => String(url).includes(path))
        .map(([url, init]) => ({ url: String(url), init: init as RequestInit }));
}

function decodeBody(init: RequestInit) {
    return new TextDecoder().decode(init.body as Uint8Array);
}

afterEach(async () => {
    await sdk?.shutdown();
    sdk = undefined;

    // The SDK registers global providers, they must be reset for the next registration.
    trace.disable();
    context.disable();
    propagation.disable();
    metrics.disable();
    logs.disable();

    vi.unstubAllGlobals();
});

test("when a proxy is provided, the spans are sent to the proxy with the credentials", async ({ expect }) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    register({
        proxy: "https://my-proxy.com"
    });

    await recordSpanAndFlush("proxy-span");

    const requests = getRequests(fetchMock, "/v1/traces");

    expect(requests).toHaveLength(1);
    expect(requests[0].url).toBe("https://my-proxy.com/v1/traces");
    expect(requests[0].init.method).toBe("POST");
    expect(requests[0].init.credentials).toBe("include");
    expect(decodeBody(requests[0].init)).toContain("proxy-span");
});

test("when a proxy is provided, the credentials option is honored", async ({ expect }) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    register({
        proxy: "https://my-proxy.com",
        credentials: "same-origin"
    });

    await recordSpanAndFlush("proxy-span");

    const requests = getRequests(fetchMock, "/v1/traces");

    expect(requests).toHaveLength(1);
    expect(requests[0].init.credentials).toBe("same-origin");
});

test("when a proxy is provided, no metrics or logs are sent to the proxy", async ({ expect }) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    register({
        proxy: "https://my-proxy.com"
    });

    await recordSpanAndFlush("proxy-span");

    expect(getRequests(fetchMock, "/v1/metrics")).toHaveLength(0);
    expect(getRequests(fetchMock, "/v1/logs")).toHaveLength(0);
});

test("when a proxy is provided, the default trace exporter of the sdk is not used", async ({ expect }) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    register({
        proxy: "https://my-proxy.com"
    });

    await recordSpanAndFlush("proxy-span");

    // The default exporter of the SDK sends the requests without credentials, a single credentialed request is expected.
    const requests = getRequests(fetchMock, "/v1/traces");

    expect(requests).toHaveLength(1);
    expect(requests.every(x => x.init.credentials === "include")).toBe(true);
});

test("when an api key is provided, the default trace exporter of the sdk is used", async ({ expect }) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    register({
        apiKey: "123"
    });

    await recordSpanAndFlush("api-key-span");

    const requests = getRequests(fetchMock, "/v1/traces");

    expect(requests).toHaveLength(1);
    expect(requests[0].url).toBe("https://api.honeycomb.io/v1/traces");
    expect(requests[0].init.credentials).toBeUndefined();
    expect(decodeBody(requests[0].init)).toContain("api-key-span");
});

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
    const registrator = new HoneycombInstrumentationRegistrator(new GlobalAttributeSpanProcessor(), new FetchRequestPipeline(), x => {
        sdk = new HoneycombWebSDK(x);

        return sdk;
    });

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
    return fetchMock.mock.calls.filter(([url]) => String(url).includes(path)).map(([url, init]) => ({ url: String(url), init: init as RequestInit }));
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
    vi.restoreAllMocks();
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

test("the private query parameters and the fragments are removed from the urls sent with the spans", async ({ expect }) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    vi.spyOn(window, "location", "get").mockReturnValue(new URL("https://app/onboarding?token=ABCDEF&email=john.doe@workleap.com&foo=bar#access_token=GHIJKL") as unknown as Location);
    vi.spyOn(document, "referrer", "get").mockReturnValue("https://app/login?token=MNOPQR&foo=bar");

    register({
        proxy: "https://my-proxy.com"
    });

    const span = trace.getTracer("e2e").startSpan("url-span");
    span.setAttribute("url.full", "https://api/search?token=STUVWX&foo=bar#access_token=YZABCD");
    span.end();

    await sdk!.shutdown();

    const requests = getRequests(fetchMock, "/v1/traces");

    expect(requests).toHaveLength(1);

    const body = decodeBody(requests[0].init);

    expect(body).toContain("https://app/onboarding?token=**redacted**&email=**redacted**&foo=bar");
    expect(body).toContain("https://app/login?token=**redacted**&foo=bar");
    expect(body).toContain("https://api/search?token=**redacted**&foo=bar");

    for (const x of ["ABCDEF", "john.doe@workleap.com", "GHIJKL", "MNOPQR", "STUVWX", "YZABCD"]) {
        expect(body).not.toContain(x);
    }
});

test("when custom private query parameter names are provided, they are removed from the urls sent with the spans", async ({ expect }) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    vi.spyOn(window, "location", "get").mockReturnValue(new URL("https://app/onboarding?token=ABCDEF&foo=GHIJKL") as unknown as Location);
    vi.spyOn(document, "referrer", "get").mockReturnValue("https://app/login?foo=MNOPQR");

    register({
        proxy: "https://my-proxy.com",
        privateQueryParameterNames: ["foo"]
    });

    await recordSpanAndFlush("url-span");

    const requests = getRequests(fetchMock, "/v1/traces");

    expect(requests).toHaveLength(1);

    const body = decodeBody(requests[0].init);

    expect(body).toContain("https://app/onboarding?token=**redacted**&foo=**redacted**");
    expect(body).toContain("https://app/login?foo=**redacted**");

    for (const x of ["ABCDEF", "GHIJKL", "MNOPQR"]) {
        expect(body).not.toContain(x);
    }
});

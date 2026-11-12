// These tests cannot be concurrent because of global mocked on LogRocket and the fetch mock.

import { type LogRocketInstrumentationPartialClient, TelemetryContext } from "@workleap-telemetry/core";
import { afterEach, type ExpectStatic, type MockInstance, test, vi } from "vitest";
import { MixpanelInitializer } from "../../src/js/initializeMixpanel.ts";
import { BaseProperties, OtherProperties, TelemetryProperties } from "../../src/js/properties.ts";

class DummyLogRocketInstrumentationClient implements LogRocketInstrumentationPartialClient {
    readonly #listeners: any[] = [];

    registerGetSessionUrlListener(listener: any) {
        this.#listeners.push(listener);
    }

    dispatchSessionUrl(sessionUrl: string) {
        this.#listeners.forEach(x => {
            x(sessionUrl);
        });
    }
}

async function getFetchCall(fetchMock: MockInstance, expect: ExpectStatic) {
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];

    const body = JSON.parse(init.body as string);

    return {
        url,
        init,
        body
    };
}

afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});

test("the custom properties are sent", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();
    const client = initializer.initialize("http://api/navigation");

    const track = client.createTrackingFunction();

    await track("event", { customProp: 123 });

    const request = await getFetchCall(fetchMock, expect);

    expect(request.url).toBe("http://api/navigation/tracking/track");
    expect(request.body.properties[BaseProperties.IsMobile]).toBeFalsy();
    expect(request.body.properties.customProp).toBe(123);
    expect(request.body.productIdentifier).toBeUndefined();
    expect(request.body.targetProductIdentifier).toBeNull();
});

test("when a telemetry context is provided at initialization, the telemetry context values are sent", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const telemetryContext = new TelemetryContext("123", "456");
    const initializer = new MixpanelInitializer();

    const client = initializer.initialize("http://api/navigation", {
        telemetryContext
    });

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.url).toBe("http://api/navigation/tracking/track");
    expect(request.body.properties[TelemetryProperties.DeviceId]).toBe(telemetryContext.deviceId);
    expect(request.body.properties[TelemetryProperties.TelemetryId]).toBe(telemetryContext.telemetryId);
});

test("when a product id is provided at initialization, the product id is sent", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();

    const client = initializer.initialize("http://api/navigation", {
        productId: "app"
    });

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.body.productIdentifier).toBe("app");
});

test("when a logrocket instrumentation client is provided, the logrocket session url is sent", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const logRocketInstrumentationClient = new DummyLogRocketInstrumentationClient();
    const initializer = new MixpanelInitializer();

    const client = initializer.initialize("http://api/navigation", {
        logRocketInstrumentationClient
    });

    const sessionUrl = "session-123";

    logRocketInstrumentationClient.dispatchSessionUrl(sessionUrl);

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.url).toBe("http://api/navigation/tracking/track");
    expect(request.body.properties[OtherProperties.LogRocketSessionUrl]).toBe(sessionUrl);
});

test("the request body include the event name", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();
    const client = initializer.initialize("http://api/navigation");

    const track = client.createTrackingFunction();

    await track("customEvent", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.body.eventName).toBe("customEvent");
});

test('when the keep alive option is provided, the fetch options include the "keepAlive" option', async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();
    const client = initializer.initialize("http://api/navigation");

    const track = client.createTrackingFunction();

    await track("keepaliveEvent", {}, { keepAlive: true });

    const request = await getFetchCall(fetchMock, expect);

    expect(request.init.keepalive).toBe(true);
});

test("when a product id is provided at initialization and a scoped product is provided, the scoped product id is sent", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();

    const client = initializer.initialize("http://api/navigation", {
        productId: "app"
    });

    const track = client.createTrackingFunction({
        productId: "scoped"
    });

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.body.productIdentifier).toBe("scoped");
});

test("when no product id is provided at initialization and a scoped product is provided, the scoped product id is sent", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();

    const client = initializer.initialize("http://api/navigation");

    const track = client.createTrackingFunction({
        productId: "scoped"
    });

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.body.productIdentifier).toBe("scoped");
});

test("when a target product id is provided, the provided id is sent", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();
    const client = initializer.initialize("http://api/navigation");

    const track = client.createTrackingFunction({
        targetProductId: "target-app"
    });

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.body.targetProductIdentifier).toBe("target-app");
});

test("when a target product id is not provided, a null value is sent", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();
    const client = initializer.initialize("http://api/navigation");

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.body).toHaveProperty("targetProductIdentifier", null);
});

test("when a base URL is provided, the endpoint include the provided base URL", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();
    const client = initializer.initialize("http://api/navigation");

    const track = client.createTrackingFunction();

    await track("customEvent", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.url).toBe("http://api/navigation/tracking/track");
});

test("when the provided base URL end with a slash is provided, the ending slash is escaped", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();
    const client = initializer.initialize("http://api/navigation/");

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.url).toBe("http://api/navigation/tracking/track");
});

test("when an environment is provided, the resolved endpoint URL match the provided environment", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();
    const client = initializer.initialize("development");

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.url).toBe("https://api.platform.workleap-dev.com/shell/navigation/tracking/track");
});

test("when a custom tracking endpoint is provided, use the provided custom endpoint", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();

    const client = initializer.initialize("http://api/navigation", {
        trackingEndpoint: "custom/tracking/endpoint"
    });

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.url).toBe("http://api/navigation/custom/tracking/endpoint");
});

test("when a custom tracking endpoint starts with slash, remove the leading slash from the provided custom tracking endpoint", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();

    const client = initializer.initialize("http://api/navigation", {
        trackingEndpoint: "/custom/endpoint"
    });

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.url).toBe("http://api/navigation/custom/endpoint");
});

test('when no tracking endpoint is provided, use the default "tracking/track" endpoint', async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();
    const client = initializer.initialize("http://api/navigation");

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.url).toBe("http://api/navigation/tracking/track");
});

test("when a custom tracking endpoint is provided with an environment, use the provided custom endpoint", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();

    const client = initializer.initialize("development", {
        trackingEndpoint: "/custom/endpoint"
    });

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.url).toBe("https://api.platform.workleap-dev.com/shell/navigation/custom/endpoint");
});

test("when a custom tracking endpoint starts with slash and an environment is provided, remove the custom tracking endpoint leading slash", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const initializer = new MixpanelInitializer();

    const client = initializer.initialize("staging", {
        trackingEndpoint: "/custom/endpoint"
    });

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.url).toBe("https://api.platform.workleap-stg.com/shell/navigation/custom/endpoint");
});

test("the private query parameters and the fragment are removed from the current url", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    vi.spyOn(window, "location", "get").mockReturnValue(new URL("https://app/onboarding?token=ABCDEF&email=john.doe@workleap.com&password=123456&foo=bar#access_token=GHIJKL") as unknown as Location);

    const initializer = new MixpanelInitializer();
    const client = initializer.initialize("http://api/navigation");

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.body.properties[BaseProperties.CurrentUrl]).toBe("https://app/onboarding?token=**redacted**&email=**redacted**&password=**redacted**&foo=bar");
});

test("when the fragment of the current url doesn't include a private query parameter, the fragment is removed", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    vi.spyOn(window, "location", "get").mockReturnValue(new URL("https://app/onboarding?foo=bar#code=ABCDEF") as unknown as Location);

    const initializer = new MixpanelInitializer();
    const client = initializer.initialize("http://api/navigation");

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.body.properties[BaseProperties.CurrentUrl]).toBe("https://app/onboarding?foo=bar");
});

test("the private query parameters are removed from the referrer", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    vi.spyOn(document, "referrer", "get").mockReturnValue("https://app/login?token=ABCDEF&email=john.doe@workleap.com&password=123456&foo=bar");

    const initializer = new MixpanelInitializer();
    const client = initializer.initialize("http://api/navigation");

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.body.properties[BaseProperties.Referrer]).toBe("https://app/login?token=**redacted**&email=**redacted**&password=**redacted**&foo=bar");
    expect(request.body.properties[BaseProperties.ReferringDomain]).toBe("app");
});

test("when custom private query parameter names are provided, they are removed from the current url and the referrer", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    vi.spyOn(window, "location", "get").mockReturnValue(new URL("https://app/onboarding?foo=bar&token=ABCDEF") as unknown as Location);
    vi.spyOn(document, "referrer", "get").mockReturnValue("https://app/login?foo=bar&token=ABCDEF");

    const initializer = new MixpanelInitializer();

    const client = initializer.initialize("http://api/navigation", {
        privateQueryParameterNames: ["foo"]
    });

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.body.properties[BaseProperties.CurrentUrl]).toBe("https://app/onboarding?foo=**redacted**&token=**redacted**");
    expect(request.body.properties[BaseProperties.Referrer]).toBe("https://app/login?foo=**redacted**&token=**redacted**");
});

test("when a custom private query parameter name includes regular expression special characters, the query parameter is removed from the current url", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    vi.spyOn(window, "location", "get").mockReturnValue(new URL("https://app/onboarding?user[email]=john.doe@workleap.com&foo=bar") as unknown as Location);

    const initializer = new MixpanelInitializer();

    const client = initializer.initialize("http://api/navigation", {
        privateQueryParameterNames: ["user[email]"]
    });

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.body.properties[BaseProperties.CurrentUrl]).toBe("https://app/onboarding?user[email]=**redacted**&foo=bar");
});

test("when a custom private query parameter name is percent-encoded in the current url, the query parameter is removed", async ({ expect }) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const url = new URL("https://app/onboarding");
    url.searchParams.set("user[email]", "john.doe@workleap.com");
    url.searchParams.set("foo", "bar");

    vi.spyOn(window, "location", "get").mockReturnValue(url as unknown as Location);

    const initializer = new MixpanelInitializer();

    const client = initializer.initialize("http://api/navigation", {
        privateQueryParameterNames: ["user[email]"]
    });

    const track = client.createTrackingFunction();

    await track("event", {});

    const request = await getFetchCall(fetchMock, expect);

    expect(request.body.properties[BaseProperties.CurrentUrl]).toBe("https://app/onboarding?user[email]=**redacted**&foo=bar");
});

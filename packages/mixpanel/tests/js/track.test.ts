// These tests cannot be concurrent because of global mocked on LogRocket.

import { type LogRocketInstrumentationPartialClient, TelemetryContext } from "@workleap-telemetry/core";
import { afterEach, test, vi } from "vitest";
import { createTrackingFunction } from "../../src/js/createTrackingFunction.ts";
import { MixpanelInitializer } from "../../src/js/initializeMixpanel.ts";
import { BaseProperties, OtherProperties, TelemetryProperties } from "../../src/js/properties.ts";

class DummyLogRocketInstrumentationClient implements LogRocketInstrumentationPartialClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly #listeners: any[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerGetSessionUrlListener(listener: any) {
        this.#listeners.push(listener);
    }

    dispatchSessionUrl(sessionUrl: string) {
        this.#listeners.forEach(x => {
            x(sessionUrl);
        });
    }
}

const fetchMock = vi.fn();

globalThis.fetch = fetchMock;

afterEach(() => {
    vi.clearAllMocks();
});

test("the custom properties are sent", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation");

    const track = createTrackingFunction();

    await track("event", { customProp: 123 });

    const [url, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(url).toBe("http://api/navigation/tracking/track");
    expect(body.properties[BaseProperties.IsMobile]).toBeFalsy();
    expect(body.properties.customProp).toBe(123);
    expect(body.productIdentifier).toBe("wlp");
    expect(body.targetProductIdentifier).toBeNull();
});

test("when a telemetry context is provided, the telemetry context values are sent", async ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation", {
        telemetryContext
    });

    const track = createTrackingFunction();

    await track("event", {});

    const [url, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(url).toBe("http://api/navigation/tracking/track");
    expect(body.properties[TelemetryProperties.DeviceId]).toBe(telemetryContext.deviceId);
    expect(body.properties[TelemetryProperties.TelemetryId]).toBe(telemetryContext.telemetryId);
});

test("when a logrocket instrumentation client is provided, the logrocket session url is sent", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();
    const logRocketInstrumentationClient = new DummyLogRocketInstrumentationClient();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation", {
        logRocketInstrumentationClient
    });

    const sessionUrl = "session-123";

    logRocketInstrumentationClient.dispatchSessionUrl(sessionUrl);

    const track = createTrackingFunction();

    await track("event", {});

    const [url, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(url).toBe("http://api/navigation/tracking/track");
    expect(body.properties[OtherProperties.LogRocketSessionUrl]).toBe(sessionUrl);
});

test("the request body include the event name", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation");

    const track = createTrackingFunction();

    await track("customEvent", {});

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(body.eventName).toBe("customEvent");
});

test("when the keep alive option is provided, the fetch options include the \"keepAlive\" option", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation");

    const track = createTrackingFunction();

    await track("keepaliveEvent", {}, { keepAlive: true });

    const [, init] = fetchMock.mock.calls[0];

    expect(init.keepalive).toBe(true);
});

test("when a target product id is provided, the request body include the provided id", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation");

    const track = createTrackingFunction({
        targetProductId: "target-app"
    });

    await track("event", {});

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(body.targetProductIdentifier).toBe("target-app");
});

test("when a target product id is not provided, the request body include the property with a null value", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation");

    const track = createTrackingFunction();

    await track("event", {});

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);

    expect(body).toHaveProperty("targetProductIdentifier", null);
});

test("when a base URL is provided, the endpoint include the provided base URL", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation");

    const track = createTrackingFunction();

    await track("customEvent", {});

    const [url] = fetchMock.mock.calls[0];

    expect(url).toBe("http://api/navigation/tracking/track");
});

test("when the provided base URL end with a slash is provided, the ending slash is escaped", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation/");

    const track = createTrackingFunction();

    await track("event", {});

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe("http://api/navigation/tracking/track");
});

test("when an environment is provided, the resolved endpoint URL match the provided environment", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "development");

    const track = createTrackingFunction();

    await track("event", {});

    const [url] = fetchMock.mock.calls[0];

    expect(url).toBe("https://api.platform.workleap-dev.com/shell/navigation/tracking/track");
});

test("when a custom tracking endpoint is provided, use the provided custom endpoint", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation", {
        trackingEndpoint: "custom/tracking/endpoint"
    });

    const track = createTrackingFunction();

    await track("event", {});

    const [url] = fetchMock.mock.calls[0];

    expect(url).toBe("http://api/navigation/custom/tracking/endpoint");
});

test("when a custom tracking endpoint starts with slash, remove the leading slash from the provided custom tracking endpoint", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation", {
        trackingEndpoint: "/custom/endpoint"
    });

    const track = createTrackingFunction();

    await track("event", {});

    const [url] = fetchMock.mock.calls[0];

    expect(url).toBe("http://api/navigation/custom/endpoint");
});

test("when no tracking endpoint is provided, use the default \"tracking/track\" endpoint", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation");

    const track = createTrackingFunction();

    await track("event", {});

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe("http://api/navigation/tracking/track");
});

test("when a custom tracking endpoint is provided with an environment, use the provided custom endpoint", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "development", {
        trackingEndpoint: "/custom/endpoint"
    });

    const track = createTrackingFunction();

    await track("event", {});

    const [url] = fetchMock.mock.calls[0];

    expect(url).toBe("https://api.platform.workleap-dev.com/shell/navigation/custom/endpoint");
});

test("when a custom tracking endpoint starts with slash and an environment is provided, remove the custom tracking endpoint leading slash", async ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "staging", {
        trackingEndpoint: "/custom/endpoint"
    });

    const track = createTrackingFunction();

    await track("event", {});

    const [url] = fetchMock.mock.calls[0];

    expect(url).toBe("https://api.platform.workleap-stg.com/shell/navigation/custom/endpoint");
});


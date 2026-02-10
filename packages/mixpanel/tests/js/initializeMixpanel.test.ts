import { type LogRocketInstrumentationPartialClient, TelemetryContext } from "@workleap-telemetry/core";
import { afterEach, test, vi } from "vitest";
import { initializeMixpanel, MixpanelInitializer } from "../../src/js/initializeMixpanel.ts";
import { TelemetryProperties } from "../../src/js/properties.ts";

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

test.concurrent("when mixpanel has already been initialized, throw an error", ({ expect }) => {
    initializeMixpanel("wlp", "http://api/navigation");

    expect(() => initializeMixpanel("wlp", "http://api/navigation")).toThrow("[mixpanel] Mixpanel has already been initialized. Did you call the \"initializeMixpanel\" function twice?");
});

test.concurrent("when a logrocket instrumentation client is provided, register a listener for logrocket get session url", ({ expect }) => {
    const globalEventProperties = new Map<string, unknown>();

    const logRocketInstrumentationClient = new DummyLogRocketInstrumentationClient();

    const initializer = new MixpanelInitializer(globalEventProperties);

    initializer.initialize("wlp", "http://api/navigation", {
        logRocketInstrumentationClient
    });

    expect(logRocketInstrumentationClient.listenerCount).toBe(1);
});

test.concurrent("when a telemetry context is provided, the telemetry context values are added as super properties", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const globalEventProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(globalEventProperties);

    initializer.initialize("wlp", "http://api/navigation", {
        telemetryContext
    });

    expect(globalEventProperties.get(TelemetryProperties.DeviceId)).toBe(telemetryContext.deviceId);
    expect(globalEventProperties.get(TelemetryProperties.TelemetryId)).toBe(telemetryContext.telemetryId);
});


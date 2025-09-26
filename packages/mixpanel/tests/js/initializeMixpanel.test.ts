import { type LogRocketInstrumentationPartialClient, TelemetryContext } from "@workleap-telemetry/core";
import { afterEach, test, vi } from "vitest";
import { MixpanelContextVariableName } from "../../src/js/context.ts";
import { initializeMixpanel, IsInitializedVariableName, MixpanelInitializer } from "../../src/js/initializeMixpanel.ts";
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

    // DEPRECATED: Grace period ends on January 1th 2026.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete globalThis[IsInitializedVariableName];
});

test.concurrent("when mixpanel has already been initialized, throw an error", ({ expect }) => {
    initializeMixpanel("wlp", "http://api/navigation");

    expect(() => initializeMixpanel("wlp", "http://api/navigation")).toThrow("[mixpanel] Mixpanel has already been initialized. Did you call the \"initializeMixpanel\" function twice?");
});

test.concurrent("when a logrocket instrumentation client is provided, register a listener for logrocket get session url", ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const logRocketInstrumentationClient = new DummyLogRocketInstrumentationClient();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation", {
        logRocketInstrumentationClient
    });

    expect(logRocketInstrumentationClient.listenerCount).toBe(1);
});

// DEPRECATED: Grace period ends on January 1th 2026.
// Cannot be concurrent because it's using "globaThis".
test("the context global variable is set", ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(globalThis[MixpanelContextVariableName]).toBeDefined();
});

// DEPRECATED: Grace period ends on January 1th 2026.
// Cannot be concurrent because it's using "globaThis".
test("the initialized global variable is set", ({ expect }) => {
    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(globalThis[IsInitializedVariableName]).toBeDefined();
});

test.concurrent("when a telemetry context is provided, the telemetry context values are added as super properties", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation", {
        telemetryContext
    });

    expect(superProperties.get(TelemetryProperties.DeviceId)).toBe(telemetryContext.deviceId);
    expect(superProperties.get(TelemetryProperties.TelemetryId)).toBe(telemetryContext.telemetryId);
});


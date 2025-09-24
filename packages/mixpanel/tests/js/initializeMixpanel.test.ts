import { NoopLogger } from "@workleap/logging";
import { BootstrappingStore, TelemetryContext } from "@workleap/telemetry";
import { __clearBootstrappingStore, __clearTelemetryContext, __setBootstrappingStore } from "@workleap/telemetry/internal";
import { afterEach, test, vi } from "vitest";
import { MixpanelContextVariableName } from "../../src/js/context.ts";
import { initializeMixpanel, IsInitializedVariableName, MixpanelInitializer } from "../../src/js/initializeMixpanel.ts";
import { TelemetryProperties } from "../../src/js/properties.ts";

afterEach(() => {
    vi.clearAllMocks();
});

test.concurrent("when mixpanel has already been initialized, throw an error", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, new NoopLogger());

    initializeMixpanel("wlp", "http://api/navigation", telemetryContext, bootstrappingStore);

    expect(() => initializeMixpanel("wlp", "http://api/navigation", telemetryContext, bootstrappingStore)).toThrow("[mixpanel] Mixpanel has already been initialized. Did you call the \"initializeMixpanel\" function twice?");
});

test.concurrent("when logrocket is ready, register a listener for logrocket get session url", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: true,
        isHoneycombReady: false
    }, new NoopLogger());

    const superProperties = new Map<string, unknown>();

    const registerGetSessionUrlListenerMock = vi.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__ = registerGetSessionUrlListenerMock;

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation", telemetryContext, bootstrappingStore);

    expect(registerGetSessionUrlListenerMock).toHaveBeenCalledOnce();
});

test.concurrent("when logrocket is not ready, register a listener for logrocket get session url once logrocket is ready", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, new NoopLogger());

    const superProperties = new Map<string, unknown>();

    const registerGetSessionUrlListenerMock = vi.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__ = registerGetSessionUrlListenerMock;

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation", telemetryContext, bootstrappingStore);

    expect(registerGetSessionUrlListenerMock).not.toHaveBeenCalled();

    bootstrappingStore.dispatch({ type: "logrocket-ready" });

    expect(registerGetSessionUrlListenerMock).toHaveBeenCalledOnce();
});

// DEPRECATED: Grace period ends on January 1th 2026.
// Cannot be concurrent because it's using "globaThis".
test("the context global variable is set", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, new NoopLogger());

    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation", telemetryContext, bootstrappingStore);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(globalThis[MixpanelContextVariableName]).toBeDefined();
});

// DEPRECATED: Grace period ends on January 1th 2026.
// Cannot be concurrent because it's using "globaThis".
test("the initialized global variable is set", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, new NoopLogger());

    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation", telemetryContext, bootstrappingStore);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(globalThis[IsInitializedVariableName]).toBeDefined();
});

test.concurrent("the telemetry context values are added as super properties", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, new NoopLogger());

    const superProperties = new Map<string, unknown>();

    const initializer = new MixpanelInitializer(superProperties);

    initializer.initialize("wlp", "http://api/navigation", telemetryContext, bootstrappingStore);

    expect(superProperties.get(TelemetryProperties.DeviceId)).toBe(telemetryContext.deviceId);
    expect(superProperties.get(TelemetryProperties.TelemetryId)).toBe(telemetryContext.telemetryId);
});


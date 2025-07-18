import { BootstrappingStore, TelemetryContext } from "@workleap/telemetry";
import { __clearBootstrappingStore, __clearTelemetryContext, __setBootstrappingStore, __setTelemetryContext } from "@workleap/telemetry/internal";
import LogRocket from "logrocket";
import { afterEach, test, vi } from "vitest";
import { DeviceIdTrait, TelemetryIdTrait } from "../src/createDefaultUserTraits.ts";
import { __resetRegistrationGuard, IsRegisteredVariableName, RegisterGetSessionUrlFunctionName, registerLogRocketInstrumentation } from "../src/registerLogRocketInstrumentation.ts";

vi.mock("logrocket", () => ({
    default: {
        init: vi.fn(),
        identify: vi.fn(),
        log: vi.fn(),
        track: vi.fn(),
        getSessionURL: vi.fn()
    }
}));

afterEach(() => {
    vi.clearAllMocks();

    __resetRegistrationGuard();
    __clearTelemetryContext();
    __clearBootstrappingStore();
});

test("when honeycomb instrumentation has already been registered, throw an error", ({ expect }) => {
    registerLogRocketInstrumentation("my-app-id");

    expect(() => registerLogRocketInstrumentation("my-app-id")).toThrow("[logrocket] The LogRocket instrumentation has already been registered. Did you call the \"registerLogRocketInstrumentation\" function twice?");
});

test("the session is identified with the telemetry context", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    __setTelemetryContext(telemetryContext);

    registerLogRocketInstrumentation("my-app-id");

    expect(LogRocket.identify).toHaveBeenCalledWith(telemetryContext.deviceId, {
        [DeviceIdTrait]: telemetryContext.deviceId,
        [TelemetryIdTrait]: telemetryContext.telemetryId
    });
});

test("is registered global variable is true", ({ expect }) => {
    registerLogRocketInstrumentation("my-app-id");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(globalThis[IsRegisteredVariableName]).toBeTruthy();
});

test("register get session url global function is defined", ({ expect }) => {
    registerLogRocketInstrumentation("my-app-id");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(typeof globalThis[RegisterGetSessionUrlFunctionName]).toBe("function");
});

test("logrocket is marked as ready", ({ expect }) => {
    const bootstrappingStore = new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    });

    __setBootstrappingStore(bootstrappingStore);

    registerLogRocketInstrumentation("my-app-id");

    expect(bootstrappingStore.state.isLogRocketReady).toBeTruthy();
});



import { TelemetryContext } from "@workleap-telemetry/core";
import LogRocket from "logrocket";
import { afterEach, test, vi } from "vitest";
import { DeviceIdTrait, TelemetryIdTrait } from "../../src/js/LogRocketInstrumentationClient.ts";
import { LogRocketInstrumentationRegistrator, registerLogRocketInstrumentation } from "../../src/js/registerLogRocketInstrumentation.ts";

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
});

test.concurrent("when honeycomb instrumentation has already been registered, throw an error", ({ expect }) => {
    registerLogRocketInstrumentation("my-app-id");

    expect(() => registerLogRocketInstrumentation("my-app-id")).toThrow("[logrocket] The LogRocket instrumentation has already been registered. Did you call the \"registerLogRocketInstrumentation\" function twice?");
});

test.concurrent("when a telemetry context is provided, the session is identified with the telemetry context values", ({ expect }) => {
    const telemetryContext = new TelemetryContext("123", "456");

    const registrator = new LogRocketInstrumentationRegistrator();

    registrator.register("my-app-id", {
        telemetryContext
    });

    expect(LogRocket.identify).toHaveBeenCalledWith(telemetryContext.deviceId, {
        [DeviceIdTrait]: telemetryContext.deviceId,
        [TelemetryIdTrait]: telemetryContext.telemetryId
    });
});

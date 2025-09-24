import { NoopLogger } from "@workleap/logging";
import { test, vi } from "vitest";
import { createTelemetryContext } from "../src/TelemetryContext.ts";
import { IdentityCookieName } from "../src/deviceId.ts";

test.concurrent("when an identity cookie is available, the device id is retrieved from the cookie", ({ expect }) => {
    const deviceId = "123";

    vi.spyOn(document, "cookie", "get").mockReturnValue(`${IdentityCookieName}=${JSON.stringify({ deviceId })}`);

    const result = createTelemetryContext(new NoopLogger());

    expect(result.deviceId).toBe(deviceId);
});

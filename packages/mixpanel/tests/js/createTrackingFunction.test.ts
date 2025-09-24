import { test } from "vitest";
import { createTrackingFunction } from "../../src/js/createTrackingFunction.ts";

// DEPRECATED: Grace period ends on January 1th 2026.
// Cannot be concurrent because it's using "globaThis".
test("when the mixpanel context is not defined, throw an error", ({ expect }) => {
    expect(() => createTrackingFunction()).toThrow("[mixpanel] The Mixpanel context is not available. Did you initialize Mixpanel with the \"initializeMixpanel\" function?");
});

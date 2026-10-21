import type { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import type { Instrumentation } from "@opentelemetry/instrumentation";

export type HoneycombSdkOptions = NonNullable<ConstructorParameters<typeof HoneycombWebSDK>[number]>;
export type HoneycombSdkInstrumentations = (Instrumentation | Instrumentation[])[];

// Previously imported from the deprecated "@opentelemetry/sdk-trace-web" package, which "@opentelemetry/sdk-trace" doesn't re-export.
// Keep it as a local type, even after the OpenTelemetry 3.x migration (see "Known pins" in ".claude/skills/update-dependencies/SKILL.md").
export type PropagateTraceHeaderCorsUrls = string | RegExp | (string | RegExp)[];

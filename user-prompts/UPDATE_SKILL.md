Review the `workleap-telemetry` skill in the `./agent-skills/workleap-telemetry` directory and make sure that all API definition and examples match the current documentation available in the `./docs` folder. Ignore anything related to standalone libraries or migration guides. Do not make any mistake.

Never update a versioned skill. You can identify a versioned skill with it's folder name pattern, e.g. `workleap-telemetry-v*`.

After making changes to the skill, spawn a review agent using the **opus** model to validate that the skill can still answer the following questions:

* What is `@workleap/telemetry` and what problems does it solve?
* How do you initialize telemetry in a frontend application using `initializeTelemetry`?
* What is `productFamily` and what values are valid (`"wlp"`, `"sg"`)?
* How does automatic correlation work across Honeycomb, LogRocket, and Mixpanel?
* What are Telemetry Id and Device Id, and how are they propagated?
* How do you configure Honeycomb tracing and what is automatically instrumented?
* How do you add custom Honeycomb spans and attributes using OpenTelemetry?
* How do you configure LogRocket session replay?
* What privacy controls does LogRocket provide (`data-public`/`data-private`)?
* How do you identify users in LogRocket using trait helpers?
* How do you configure Mixpanel analytics?
* How do you track custom events in Mixpanel?
* How do you use `MixpanelPropertiesProvider` for scoped properties?
* What React hooks are available (`useTelemetryClient`, `useHoneycombInstrumentationClient`, `useLogRocketInstrumentationClient`, `useMixpanelClient`)?
* How do you set up `NoopTelemetryClient` for Storybook and tests?
* How do you configure `LogRocketLogger` for diagnostic logging?
* What is `TelemetryProvider` and how is it used in React?
* How do standalone libraries differ from the umbrella package?
* How do you troubleshoot missing or inconsistent telemetry?

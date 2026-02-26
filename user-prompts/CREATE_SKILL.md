Using the "skill-creator" skill, create an agent skill for the **Workleap Telemetry** libraries, based on the official wl-telemetry documentation.

The purpose of this skill is to help developers correctly implement and use Workleap’s telemetry solution in frontend applications, following documented APIs and recommended patterns.

The skill should enable an agent to:

* Explain wl-telemetry’s main concepts and how they fit together, including telemetry initialization, correlation values, platform clients, and runtime usage.
* Describe how to set up telemetry in a project using the recommended initialization and configuration approach.
* Explain how correlation values are used to connect traces, sessions, logs, and events across observability tools.
* Explain how wl-telemetry integrates with Honeycomb, LogRocket and Mixpanel through correlation values.
* Provide examples of common usage patterns such as initializing telemetry, adding custom traces, configuring loggers, and safely using telemetry in non-production environments.
* Answer developer questions using only documented wl-telemetry APIs and recommended patterns.

The skill must:

* Not invent APIs, configuration options, parameters, or behaviors that are not documented.
* Not suggest undocumented or deprecated usage patterns.
* Avoid generic observability advice unless it is explicitly tied to wl-telemetry concepts.
* Treat the official wl-telemetry documentation as the single source of truth.
* Ignore everything standalone libraries, focus only on the umbrella package.
* Not have a description exceeding a maximum length of 1024 characters.

The agent should assume:

* A modern TypeScript codebase (often React-based).
* Telemetry is used to correlate frontend activity with backend traces, logs, sessions, and analytics events.
* Teams want a consistent, reviewable telemetry setup suitable for production and CI environments.

The generated skill should:

* Provide clear, concise explanations and examples.
* Be reliable for pull request reviews, developer support, and onboarding.
* Minimize token usage by focusing only on relevant wl-telemetry concepts and APIs.

Relevant questions the skill should be able to answer:

* What is wl-telemetry and what problems does it solve?
* What are correlation values and why are they important?
* What is the difference between `Telemetry Id` and `Device Id`?
* How are correlation values used to connect telemetry across tools?
* How do you initialize telemetry in an application?
* What configuration values are required when initializing telemetry?
* How does wl-telemetry integrate with Honeycomb?
* How does wl-telemetry integrate with LogRocket?
* How does wl-telemetry integrate with Mixpanel?
* How do you create custom traces or spans using OpenTelemetry with wl-telemetry?
* What is `TelemetryContext` and when should it be used?
* Why is providing loggers to wl-telemetry recommended?
* What logging integrations are supported and how are they intended to be used?
* How is the `Telemetry Id` used to correlate Honeycomb traces with LogRocket sessions?
* How can correlation values be attached to Mixpanel events?
* How do LogRocket and Mixpanel complement each other in a wl-telemetry setup?
* How should wl-telemetry be used in Storybook or other non-production environments?
* What is a Noop telemetry client and when should it be used?
* What is the umbrella package in wl-telemetry and why would a project use it?

The documentation is located in the "docs" folder. Only use the documentation of the following folders:

* ./docs/introduction
* ./docs/guides
* ./docs/reference

The skill should at least trigger when the agent encounters questions about:

* Initializing wl-telemetry in a frontend application
* Working with correlation values (`Telemetry Id`, `Device Id`) and understanding their lifecycle
* Using Honeycomb for distributed tracing and performance analysis
* Creating and enriching Honeycomb traces and spans using OpenTelemetry
* Using LogRocket for session replay, frontend debugging, and user experience investigation
* Exposing telemetry identifiers to LogRocket to support cross-tool debugging
* Using Mixpanel for product analytics and event-based insights
* Attaching telemetry and device identifiers to Mixpanel events for consistent analysis
* Understanding the distinct roles of Honeycomb, LogRocket, and Mixpanel in a wl-telemetry setup
* Correlating data across Honeycomb, LogRocket, and Mixpanel when deeper investigation is needed
* Configuring and providing loggers to wl-telemetry for diagnostics and observability
* Using wl-telemetry safely in Storybook or other non-production environments
* Using Noop telemetry clients to disable or mock telemetry collection
* Adopting and using the wl-telemetry umbrella package
* Reviewing pull requests that add or modify telemetry instrumentation
* Troubleshooting missing, incomplete, or inconsistent telemetry across tools


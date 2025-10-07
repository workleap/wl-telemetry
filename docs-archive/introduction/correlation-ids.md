---
order: 90
label: Correlation ids
meta:
    title: Correlation ids - Introduction
---

# Correlation ids

With the [@worleap/telemetry](https://www.npmjs.com/package/@workleap/telemetry) umbrella package, each telemetry platform automatically receives the same two correlation id values, in its own platform-specific naming conventions:

{.correlation-ids-table}
| Correlation id | Description | LogRocket | Honeycomb | Mixpanel |
| --- | --- | --- | --- | --- |
| Telemetry id | Identifies a single application load. It's primarily used to correlate all telemetry platforms with Honeycomb traces. | `Telemetry Id` | `app.telemetry_id` | `Telemetry Id` |
| Device id | Identifies the user's device across sessions. | `Device Id` | `app.device_id` | `Device Id` |

A similar result can be achieved with the standalone telemetry library by manually providing the same [TelemetryContext](./reference/TelemetryContext.md) instance to the libraries:

- [@workleap/logrocket](../logrocket/reference/registerLogRocketInstrumentation.md#telemetrycontext)
- [@workleap/honeycomb](../honeycomb/reference/registerHoneycombInstrumentation.md#telemetrycontext)
- [@workleap/mixpanel](../mixpanel/reference/initializeMixpanel.md#initialize-with-a-telemetry-context)

### Troubleshooting example

The following is an example of a troubleshooting workflow using the new telemetry correlation id:

- **Honeycomb**: Locate the `app.telemetry_id` attribute in a trace to retrieve its value.
- **LogRocket**: Navigate to the "Session Replay" page. Open the "User Traits" filter, select the `Telemetry Id` trait, paste the `app.telemetry_id` value, and press "Enter" to view the matching sessions.
- **Mixpanel**: Navigate to the "Events" page. Add a "filter", select the `Telemetry Id` propertt, paste the `app.telemetry_id` value, and press on the "Add" button to view the matching events.

!!!warning
This feature is available only when using the following package versions or higher:

- `@workleap/telemetry` ≥ `2.0.0`
- `@workleap/logrocket` ≥ `1.0.0`
- `@workleap/honeycomb` ≥ `6.0.0`
- `@workleap/mixpanel` ≥ `2.0.0`

If your application is using older versions, refer to the [migration guide](./migrate.md) to update.
!!!

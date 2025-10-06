---
order: 50
label: Use correlation values
---

# Use correlation values

## Correlation ids

Every telemetry platform automatically receives the same two correlation id values, in its own platform-specific naming conventions:

{.correlation-ids-table}
| Correlation id | Description | LogRocket | Honeycomb | Mixpanel |
| --- | --- | --- | --- | --- |
| Telemetry id | Identifies a single application load. It's primarily used to correlate all telemetry platforms with Honeycomb traces. | `Telemetry Id` | `app.telemetry_id` | `Telemetry Id` |
| Device id | Identifies the user's device across sessions. | `Device Id` | `app.device_id` | `Device Id` |

Those correlation ids brings together [LogRocket](https://logrocket.com/), [Honeycomb](https://www.honeycomb.io/), and [Mixpanel](https://mixpanel.com/). By linking session data, performance traces, and user interactions through consistent identifiers, it becomes possible to **trace** a **single** application **event across systems**, from backend performance to frontend behavior to product impact.

### Troubleshooting example

The following is an example of a troubleshooting workflow using the telemetry correlation ids:

- **Honeycomb**: Locate the `app.telemetry_id` attribute in a trace to retrieve its value.
- **LogRocket**: Navigate to the "Session Replay" page. Open the "User Traits" filter, select the `Telemetry Id` trait, paste the `app.telemetry_id` value, and press "Enter" to view the matching sessions.
- **Mixpanel**: Navigate to the "Events" page. Add a "filter", select the `Telemetry Id` property, paste the `app.telemetry_id` value, and press on the "Add" button to view the matching events.

## LogRocket session URL

If LogRocket instrumentation is enabled, the Honeycomb and Mixpanel libraries will automatically attach the LogRocket session URL to their traces/events once it's available:

| Honeycomb | Mixpanel |
| --- | --- |
| `app.logrocket_session_url` | `LogRocket Session URL` |

### Troubleshooting example

The following example illustrates a troubleshooting workflow using the LogRocket session URL:

- **Honeycomb**: Navigate to "Query" page, select a trace and locate the `app.logrocket_session_url` attribute in the trace and click the link. This opens the corresponding LogRocket session, where you can review the user's actions, inspect console output, and debug the issue.
- **Mixpanel**: Navigate to the "Events" page, selected an event and locate the `LogRocket Session URL` property in the event and click the link. This opens the corresponding LogRocket session, where you can review the user's actions, inspect console output, and debug the issue.

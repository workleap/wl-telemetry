---
order: 90
label: Correlation ids
meta:
    title: Correlation ids - Introduction
---

# Correlation ids

Each library sends the same two correlation id values to its respective platform, using platform-specific naming conventions for the names:

{.correlation-ids-table}
| Correlation id | Description | LogRocket | Honeycomb | Mixpanel |
| --- | --- | --- | --- | --- |
| Telemetry id | Identifies a single application load. It's primarily used to correlate all telemetry platforms with Honeycomb traces. | `Telemetry Id` | `app.telemetry_id` | `Telemetry Id` |
| Device id | Identifies the user's device across sessions. | `Device Id` | `app.device_id` | `Device Id` |

### Troubleshooting example

The following is an example of a troubleshooting workflow using the new telemetry correlation id:

- **Honeycomb**: Locate the `app.telemetry_id` attribute in a trace to retrieve its value.
- **LogRocket**: Navigate to the "Session Replay" page. Open the "User Traits" filter, select the `Telemetry Id` trait, paste the `app.telemetry_id` value, and press "Enter" to view the matching sessions.
- **Mixpanel**: Navigate to the "Events" page. Add a "filter", select the `Telemetry Id` propertt, paste the `app.telemetry_id` value, and press on the "Add" button to view the matching events.

!!!warning
This feature is available only when using the following package versions or higher:

- `@workleap/logrocket` ≥ `1.0.0`
- `@workleap/honeycomb` ≥ `6.0.0`
- `@workleap/mixpanel` ≥ `2.0.0`

If your application is using older versions, refer to the [migration guide](./migrate.md) to update.
!!!

---
order: 0
label: TelemetryContext
meta:
    title: TelemetryContext
toc:
    depth: 2-3
---

# TelemetryContext

!!!warning
Don't create your own instance of `TelemetryContext`, use a `createTelemetryContext` function instead.
!!!

An object containing the telemetry colleration ids.

## Reference

```ts
const context = new TelemetryContext(telemetryId?, device?)
```

## Parameters

- `telemetryId`: Identifies a single application load. It's primarily used to correlate with Honeycomb traces.
- `deviceId`: Identifies the user's device across sessions. This value is extracted from the shared `wl-identity` cookie, which is used across Workleap's marketing sites and web applications.


## Getters

- `telemetryId`: Return the telemetry id.
- `deviceId`: Return the device id.

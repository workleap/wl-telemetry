---
order: 100
label: getTelemetryContext
meta:
    title: getTelemetryContext - Utilities
toc:
    depth: 2-3
---

# getTelemetryContext

This utility function simplifies correlation across Workleap's three telemetry platforms: [LogRocket](https://logrocket.com/), [Honeycomb](https://www.honeycomb.io/) and [Mixpanel](https://mixpanel.com/).

## Reference

```ts
const telemetryContext = getTelemetryContext(options?: { identityCookieExpiration, identityCookieDomain, verbose });
```

### Parameters

- `options`: An optional object literal of options:
    - `identityCookieExpiration`: The `wl-identity` cookie expiration date.
    - `identityCookieDomain`: The `wl-identity` cookie domain.
    - `verbose`: Whether or not the utility function output verbose logs.

### Returns

A `TelemetryContext` object containing two correlation ids:

- `telemetryId`: Identifies a single application load. It's primarily used to correlate Honeycomb traces with other telemetry platforms.
- `deviceId`: Identifies the user's device across sessions. This value is extracted from the shared wl-identity cookie, which is used across Workleap’s marketing sites and web applications.

## Side effects

If the `wl-identity` cookie doesn't exist, `getTelemetryContext` will generate a new `deviceId` and automatically set the `wl-identity` cookie.

## Usage

### Get a context

```ts
import { getTelemetryContext } from "@workleap/telemetry";

const telemetryContext = getTelemetryContext();
```

### Specify a cookie expiration date

```ts
import { getTelemetryContext } from "@workleap/telemetry";

const telemetryContext = getTelemetryContext({ identityCookieExpiration: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
```

### Specify a cookie demain

```ts
import { getTelemetryContext } from "@workleap/telemetry";

const telemetryContext = getTelemetryContext({ identityCookieDomain: "acme.com" });
```

### Use verbose logs

```ts
import { getTelemetryContext } from "@workleap/telemetry";

const telemetryContext = getTelemetryContext({ verbose: true });
```


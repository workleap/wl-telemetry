---
order: 60
label: createTelemetryContext
meta:
    title: createTelemetryContext - Mixpanel
toc:
    depth: 2-3
---

# createTelemetryContext

Creates a [TelemetryContext](#telemetrycontext) instance containing the telemetry colleration ids.

## Reference

```ts
const telemetryContext = createTelemetryContext(options?: { identityCookieExpiration?, identityCookieDomain?, verbose?, loggers? });
```

### Parameters

- `options`: An optional object literal of options:
    - `identityCookieExpiration`: The expiration date of the `wl-identity` cookie if the cookie hasn't been already written. The default value is 365 days.
    - `identityCookieDomain`: The domain of the `wl-identity` cookie if the cookie hasn't been already written. The default value is `*.workleap`
    - `verbose`: If no loggers are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An optional array of `Logger` instances.

### Returns

A [TelemetryContext](#telemetrycontext) instance.

#### `TelemetryContext`

An object containing the telemetry colleration ids. The correlations ids include:

- `telemetryId`: Identifies a single application load. It's primarily used to correlate with Honeycomb traces.
- `deviceId`: Identifies the user's device across sessions. This value is extracted from the shared `wl-identity` cookie, which is used across Workleap's marketing sites and web applications.

## Usage

### Create a telemetry context

```ts !#3
import { createTelemetryContext } from "@workleap/mixpanel/react";

const context = createTelemetryContext();
```

### Set a custom cookie expiration

```ts !#4
import { createTelemetryContext } from "@workleap/mixpanel/react";

const context = createTelemetryContext({
    identityCookieExpiration: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
});
```

### Set a custom cookie domain

```ts !#4
import { createTelemetryContext } from "@workleap/mixpanel/react";

const context = createTelemetryContext({
    identityCookieDomain: ".contso.com";
});
```

### Verbose mode

```ts !#4
import { createTelemetryContext } from "@workleap/mixpanel/react";

const context = createTelemetryContext({
    verbose: true
});
```

### Loggers

```ts !#5
import { createTelemetryContext, LogRocketLogger } from "@workleap/mixpanel/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const context = createTelemetryContext({
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```


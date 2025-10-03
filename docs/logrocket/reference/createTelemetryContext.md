---
order: 60
label: createTelemetryContext
meta:
    title: createTelemetryContext - LogRocket
toc:
    depth: 2-3
---

# createTelemetryContext

Creates a [TelemetryContext](../../introduction/reference/TelemetryContext.md) instance containing the telemetry correlation ids.

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

A [TelemetryContext](../../introduction/reference/TelemetryContext.md) instance.

## Usage

### Create a telemetry context

```ts !#3
import { createTelemetryContext } from "@workleap/logrocket/react";

const context = createTelemetryContext();
```

### Set a custom cookie expiration

```ts !#4
import { createTelemetryContext } from "@workleap/logrocket/react";

const context = createTelemetryContext({
    identityCookieExpiration: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
});
```

### Set a custom cookie domain

```ts !#4
import { createTelemetryContext } from "@workleap/logrocket/react";

const context = createTelemetryContext({
    identityCookieDomain: ".contso.com";
});
```

### Verbose mode

```ts !#4
import { createTelemetryContext } from "@workleap/logrocket/react";

const context = createTelemetryContext({
    verbose: true
});
```

### Loggers

```ts !#5
import { createTelemetryContext, LogRocketLogger } from "@workleap/logrocket/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const context = createTelemetryContext({
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```


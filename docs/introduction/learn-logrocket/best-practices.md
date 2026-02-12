---
order: 80
label: Best practices
---

# Best practices

## Privacy

Follow [privacy best practices](./privacy.md) to reduce the risk of exposing Personally Identifiable Information (PII) in LogRocket session replays.

## Log relevant information

It's recommended to **log** as much **relevant information** as possible into the LogRocket session replay console. This is typically done using the [LogRocketLogger](../../reference/LogRocketLogger.md) class or directly through the [LogRocket SDK](https://docs.logrocket.com/reference/console).

At minimum, make sure to provide a `LogRocketLogger` instance to Workleap's libraries accepting a `loggers` option.

Here are some examples :point_down:

!!!warning
Never log any **Personally Identifiable Information (PII)**.

API responses frequently contain sensitive user data such as names, email addresses, phone numbers, or IDs. Remove all logs outputting API response before deploying to production, as these can expose private information that will be included in session replays.

For debugging, use `console.log` instead, since its output is not captured in LogRocket session replays.
!!!

### Telemetry

Initialize telemetry with a [LogRocketLogger](../../reference/LogRocketLogger.md) instance:

```ts
import { initializeTelemetry, LogRocketLogger } from "@workleap/telemetry/react";
import { LogLevel } from "@workleap/logging";

const client = initializeTelemetry("sg", {
    logRocket: {
        appId: "my-app-id"
    },
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy"
        }
    },
    mixpanel: {
        envOrTrackingApiBaseUrl: "development"
    },
    loggers: [new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

### Common Room

Initialize Common Room with a [LogRocketLogger](../../reference/LogRocketLogger.md) instance:

```ts !#6
import { registerCommonRoomInstrumentation } from "@workleap/common-room/react";
import { LogLevel } from "@workleap/logging";
import { LogRocketLogger } from "@workleap/telemetry/react"; // or from "@workleap/logrocket/react";

const client = registerCommonRoomInstrumentation("my-site-id", {
    loggers: [new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

### Squide firefly

Initialize Squide firefly with a [LogRocketLogger](../../reference/LogRocketLogger.md) instance:

```ts !#6
import { initializeFirefly } from "@squide/firefly";
import { LogLevel } from "@workleap/logging";
import { LogRocketLogger } from "@workleap/telemetry/react";

const runtime = initializeFirefly({
    loggers: [new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

### Platform widgets

Initialize platform widgets with verbose mode activated and a [LogRocketLogger](../../reference/LogRocketLogger.md) instance:

```ts !#6
import { initializeWidgets } from "@workleap-widgets/client/react";
import { LogLevel } from "@workleap/logging";
import { LogRocketLogger } from "@workleap/telemetry/react";

const widgetsRuntime = initializeWidgets("wlp", "development" , {
    loggers: [new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

---
order: 80
label: Best practices
meta:
    title: Best practices - Introduction
toc:
    depth: 2-3
---

# Best practices

## Log relevant information

It's recommended to **log** as much **relevant information** as possible into the LogRocket session replay console. This is typically done using the [LogRocketLogger](./reference/LogRocketLogger.md) class or directly through the [LogRocket SDK](https://docs.logrocket.com/reference/console).

At minimum, make sure to provide a `LogRocketLogger` instance to Workleap's libraries accepting a `loggers` option.

Here are some examples :point_down:

!!!warning
Never log any **Personally Identifiable Information (PII)**.

API responses frequently contain sensitive user data such as names, email addresses, phone numbers, or IDs. Remove all logs outputting API response before deploying to production, as these can expose private information that will be included in session replays.

For debugging, use `console.log` instead, since its output is not captured in LogRocket session replays.
!!!

### LogRocket

Register LogRocket instrumentation with a [LogRocketLogger](./reference/LogRocketLogger.md) instance:

```ts !#5
import { registerLogRocketInstrumentation, LogRocketLogger } from "@workleap/logrocket";
import { LogLevel } from "@workleap/logging";

const client = registerLogRocketInstrumentation("my-app-id", {
    loggers: [new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

### Honeycomb

Register Honeycomb instrumentation with a [LogRocketLogger](./reference/LogRocketLogger.md) instance:

```ts !#7
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { LogRocketLogger } from "@workleap/logrocket";
import { LogLevel } from "@workleap/logging";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    loggers: [new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

### Mixpanel

Initialize Mixpanel with a [LogRocketLogger](./reference/LogRocketLogger.md) instance:

```ts !#6
import { initializeMixpanel } from "@workleap/mixpanel";
import { LogRocketLogger } from "@workleap/logrocket";
import { LogLevel } from "@workleap/logging";

const client = initializeMixpanel("wlp", "development", {
    loggers: [new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

### Common Room

Initialize Mixpanel with a [LogRocketLogger](./reference/LogRocketLogger.md) instance:

```ts !#6
import { registerCommonRoomInstrumentation } from "@workleap/common-room";
import { LogRocketLogger } from "@workleap/logrocket";
import { LogLevel } from "@workleap/logging";

const client = registerCommonRoomInstrumentation("my-site-id", {
    loggers: [new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

### Squide firefly

Initialize Squide firefly with a [LogRocketLogger](./reference/LogRocketLogger.md) instance:

```ts !#6
import { initializeFirefly } from "@squide/firefly";
import { LogRocketLogger } from "@workleap/logrocket";
import { LogLevel } from "@workleap/logging";

const runtime = initializeFirefly({
    loggers: [new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

### Platform widgets

Initialize platform widgets with verbose mode activated and a [LogRocketLogger](./reference/LogRocketLogger.md) instance:

```ts !#6
import { initializeWidgets } from "@workleap-widgets/client/react";
import { LogRocketLogger } from "@workleap/logrocket";
import { LogLevel } from "@workleap/logging";

const widgetsRuntime = initializeWidgets("wlp", "development" , {
    loggers: [new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

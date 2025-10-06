---
order: 190
label: Use LogRocket logger
---

# Use LogRocket logger

By default, LogRocket session replays can display logs captured during a user session. To prevent exposure of Personally Identifiable Information (PII), Workleap's default LogRocket instrumentation disables automatic forwarding of `console.log` messages to LogRocket.

To capure logs explicitly into LogRocket, a [LogRocketLogger](../reference/LogRocketLogger.md) instance must be used.

## Install packages

First, open a terminal at the root of the application and install the packages:

```bash
pnpm add @workleap/logrocket logrocket
```

## Configure the logger

Then, create an instance of [LogRocketLogger](../reference/LogRocketLogger.md):

```ts !#3
import { LogRocketLogger } from "@workleap/logrocket/react";

const logger = new LogRocketLogger();
```

## Log a single entry

And log an entry:

```ts !#4
import { LogRocketLogger } from "@workleap/logrocket/react";

const logger = new LogRocketLogger();
logger.debug("Hello world!");
```

## Filter log entries

A minimum severity of entries to process can be configured as an option. Messages with a lower severity than the configured level will then be ignored:

```ts !#4
import { LogRocketLogger } from "@workleap/logrocket/react";

const logger = new LogRocketLogger({
    logLevel: LogLevel.error
});

// Will be ignored because "debug" is lower than the "error" severity.
logger.debug("Hello world!");
```

!!!tip
To learn more about the severity level, refer to the [reference](../reference/LogRocketLogger.md#filter-log-entries) page of `LogRocketLogger`.
!!!

## Build a complex log entry

Multiple segments can be chained to create a log entry that combines styled text, errors, and objects. To process all segments and output the log to the console, complete the chain by calling any log method:

```ts !#5-10
import { LogRocketLogger } from "@workleap/logrocket/react";

const logger = new LogRocketLogger();

logger
    .withText("Processing segment")
    .withObject({ id: 1 })
    .withText("failed with error")
    .withError(new Error("The error"))
    .debug();
```

## Try it :rocket:

Add a log to an application page, start the application in a development environment, and render the page. Login to the [LogRocket](https://app.logrocket.com/) application and navigate to the "Session Replay" page. Select the session replay and look at the right side of the page. You should see the log entry in the "console".

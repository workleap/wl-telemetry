---
order: 50
label: LogRocketLogger
meta:
    title: LogRocketLogger - LogRocket
toc:
    depth: 2-3
---

# LogRocketLogger

A logger outputting messages to a LogRocket session replay.

## Reference

```ts
const logger = new LogRocketLogger(options?: { logLevel? })
```

### Parameters

- `options`: An optional object literal of options:
    - `logLevel`: Sets the minimum severity of entries the logger will process. Possible values are `debug`, `information`, `warning`, `error`, `critical`.

### Methods

Refer to the [Logger](https://workleap.github.io/wl-logging/reference/logger) and [LoggerScope](https://workleap.github.io/wl-logging/reference/loggerscope) documentation.

## Usage

### Log a debug entry

```ts !#4
import { LogRocketLogger } from "@workleap/logrocket";

const logger = new LogRocketLogger();
logger.debug("Hello world!");
```

### Log an information entry

```ts !#4
import { LogRocketLogger } from "@workleap/logrocket";

const logger = new LogRocketLogger();
logger.information("Hello world!");
```

### Log a warning entry

```ts !#4
import { LogRocketLogger } from "@workleap/logrocket";

const logger = new LogRocketLogger();
logger.warning("Hello world!");
```

### Log an error entry

```ts !#4
import { LogRocketLogger } from "@workleap/logrocket";

const logger = new LogRocketLogger();
logger.error("Hello world!");
```

### Log a critical entry

```ts !#4
import { LogRocketLogger } from "@workleap/logrocket";

const logger = new LogRocketLogger();
logger.critical("Hello world!");
```

### Filter log entries

A minimum severity of entries to process can be configured as an option. Messages with a lower severity than the configured level will then be ignored.

```ts !#4
import { LogRocketLogger } from "@workleap/logrocket";

const logger = new LogRocketLogger({
    logLevel: LogLevel.error
});

// Will be ignored because "debug" is lower than the "error" severity.
logger.debug("Hello world!");
```

For reference, here's a description of each level:

#### Debug

- Very detailed, often verbose, logs used mainly during development.
- _Example: API request/response bodies, lifecycle hooks, variable state._

#### Information

- General events that show the normal flow of the application.
- _Example: User login, component mounted, scheduled task started._

#### Warning

- Non-critical issues that might need attention but don't break functionality.
- _Example: Deprecated API usage, retries after a failed network call._

#### Error

- Failures that prevent part of the system from working as intended.
- _Example: Unhandled exceptions, failed database query, API call failed with 500._

#### Critical

- Severe errors that cause the application to stop functioning or risk data integrity.
- _Example: Application crash, loss of critical service connection._

### Build complex log entry

Multiple segments can be chained to create a log entry that combines styled text, errors, and objects. To process all segments and output the log to the console, complete the chain by calling any log method.

```ts !#5-10
import { LogRocketLogger } from "@workleap/logrocket";

const logger = new LogRocketLogger();

logger
    .withText("Processing segment")
    .withObject({ id: 1 })
    .withText("failed with error")
    .withError(new Error("The error"))
    .debug();
```

### Use a logging scope

```ts !#4
import { LogRocketLogger } from "@workleap/logrocket";

const logger = new LogRocketLogger();
const scope = logger.startScope("Module 1 registration");

scope.debug("Registering routes...");

scope
    .withText("Routes registered!")
    .withObject([{
        path: "/foo",
        label: "Foo"
    }])
    .debug();

scope.debug("Fetching data...");

scope
    .withText("Data fetching failed")
    .withError(new Error("The specified API route doesn't exist."))
    .error();

scope.debug("Registration failed!");

// Once the scope is ended, the log entries will be outputted to the console.
scope.end();
```

### Dismiss a logging scope

A scope can be dismissed to prevent it's log entries from being outputted to the console.

```ts !#19
import { LogRocketLogger } from "@workleap/logrocket";

const logger = new LogRocketLogger();
const scope = logger.startScope("Module 1 registration");

scope.debug("Registering routes...");

scope
    .withText("Routes registered!")
    .withObject([{
        path: "/foo",
        label: "Foo"
    }])
    .debug();

scope.debug("Fetching data...");

// Will not output any log entries to the console.
scope.end({ dismiss: true });
```

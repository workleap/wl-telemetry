---
order: 200
label: Setup loggers
---

# Setup loggers

Providing loggers to the initialization or registration functions is optional but recommended, as it helps simplify troubleshooting.

## Install packages

First, open a terminal at the root of the application and install the package `@workleap/logging` package:

```bash
pnpm add @workleap/logging
```

## Configure loggers

Then update the application bootstrapping code to configure the loggers:

```tsx !#11,28-29 index.tsx
import { initializeTelemetry, LogRocketLogger, TelemetryProvider } from "@workleap/telemetry/react";
import { BrowserConsoleLogger, LogLevel, type RootLogger } from "@workleap/logging";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

// Do not do this, it's only for demo purpose.
const isDev = process.env === "development";

// Only add LogRocket logger if your product is set up with LogRocket.
const loggers: RootLogger[] = [isDev ? new BrowserConsoleLogger() : new LogRocketLogger({ logLevel: LogLevel.information })];

const telemetryClient = initializeTelemetry("sg", {
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
    verbose: isDev,
    loggers
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <TelemetryProvider client={telemetryClient}>
            <App />
        </TelemetryProvider>
    </StrictMode>
);
```

## Troubleshoot production issues

To troubleshoot production issues, remove the `LogLevel` from the `LogRocketLogger` constructor options and set the `verbose` option to `true`:

```tsx !#11,28 index.tsx
import { initializeTelemetry, LogRocketLogger, TelemetryProvider } from "@workleap/telemetry/react";
import { BrowserConsoleLogger, LogLevel, type RootLogger } from "@workleap/logging";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

// Do not do this, it's only for demo purpose.
const isDev = process.env === "development";

// Only add LogRocket logger if your product is set up with LogRocket.
const loggers: RootLogger[] = [isDev ? new BrowserConsoleLogger() : new LogRocketLogger({ logLevel })];

const telemetryClient = initializeTelemetry("sg", {
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
    verbose: true,
    loggers
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <TelemetryProvider client={telemetryClient}>
            <App />
        </TelemetryProvider>
    </StrictMode>
);
```

## Try it :rocket:

Start the application in a development environment. Open the [DevTools](https://developer.chrome.com/docs/devtools/) console, render a page, and look for log entries such as:

- `[logrocket] LogRocket instrumentation is registered.`
- `[honeycomb] Honeycomb instrumentation is registered.`
- `[mixpanel] Mixpanel is initialized.`

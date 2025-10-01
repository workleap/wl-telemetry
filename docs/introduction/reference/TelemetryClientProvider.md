---
order: 80
label: TelemetryClientProvider
meta:
    title: TelemetryClientProvider
toc:
    depth: 2-3
---

# TelemetryClientProvider

React provider to share a `TelemetryClient` instance with the application code.

## Reference

```tsx
<TelemetryClientProvider value={client}>
    <App />
</TelemetryClientProvider>
```

### Properties

- `value`: A [TelemetryClient](./TelemetryClient.md) instance.

## Usage

### Provide a client instance

```tsx !#26,28
import { initializeTelemetry, TelemetryClientProvider } from "@workleap/telemetry/react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = initializeTelemetry({
    logRocket: {
        appId: "my-app-id"
    },
    honeycomb: {
        namespace: "sample",
        serviceName: "all-platforms-sample",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy"
        }
    },
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    }
});

const root = createRoot(document.getElementById("root"));

root.render(
    <TelemetryClientProvider value={client}>
        <App />
    </TelemetryClientProvider>
);
```

### Retrieve a client instance

```ts !#3
import { useTelemetryClient } from "@workleap/telemetry/react";

const client = useTelemetryClient();

client.logRocket.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```

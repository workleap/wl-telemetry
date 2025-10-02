---
order: 80
label: TelemetryProvider
meta:
    title: TelemetryProvider
toc:
    depth: 2-3
---

# TelemetryProvider

React provider to share a `TelemetryClient` instance with the application code.

## Reference

```tsx
<TelemetryProvider client={client}>
    <App />
</TelemetryProvider>
```

### Properties

- `client`: A [TelemetryClient](./TelemetryClient.md) instance.

## Usage

### Provide a client instance

```tsx !#26,28
import { initializeTelemetry, TelemetryProvider } from "@workleap/telemetry/react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = initializeTelemetry({
    logRocket: {
        appId: "my-app-id"
    },
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
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
    <TelemetryProvider client={client}>
        <App />
    </TelemetryProvider>
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

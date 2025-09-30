---
order: 80
label: LogRocketInstrumentationClientProvider
meta:
    title: LogRocketInstrumentationClientProvider - LogRocket
toc:
    depth: 2-3
---

# LogRocketInstrumentationClientProvider

React provider to share a `LogRocketInstrumentationClient` instance with the application code.

## Reference

```tsx
<LogRocketInstrumentationClientProvider value={client}>
    <App />
</LogRocketInstrumentationClientProvider>
```

### Properties

- `value`: A [LogRocketInstrumentationClient](./LogRocketInstrumentationClient.md) instance.

## Usage

### Provide a client instance

```tsx !#10-12
import { createRoot } from "react-dom/client";
import { registerLogRocketInstrumentation, LogRocketInstrumentationClientProvider } from "@workleap/logrocket/react";
import { App } from "./App.tsx";

const client = registerLogRocketInstrumentation("my-app-id");

const root = createRoot(document.getElementById("root"));

root.render(
    <LogRocketInstrumentationClientProvider value={client}>
        <App />
    </LogRocketInstrumentationClientProvider>
);
```

### Retrieve a client instance

```tsx !#3
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";

const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```

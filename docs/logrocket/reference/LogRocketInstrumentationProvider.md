---
order: 80
label: LogRocketInstrumentationProvider
meta:
    title: LogRocketInstrumentationProvider - LogRocket
toc:
    depth: 2-3
---

# LogRocketInstrumentationProvider

React provider to share a `LogRocketInstrumentationClient` instance with the application code.

## Reference

```tsx
<LogRocketInstrumentationProvider client={client}>
    <App />
</LogRocketInstrumentationProvider>
```

### Properties

- `client`: A [LogRocketInstrumentationClient](./LogRocketInstrumentationClient.md) instance.

## Usage

### Provide a client instance

```tsx !#10-12
import { registerLogRocketInstrumentation, LogRocketInstrumentationProvider } from "@workleap/logrocket/react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = registerLogRocketInstrumentation("my-app-id");

const root = createRoot(document.getElementById("root"));

root.render(
    <LogRocketInstrumentationProvider client={client}>
        <App />
    </LogRocketInstrumentationProvider>
);
```

### Retrieve a client instance

```ts !#3
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";

const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```

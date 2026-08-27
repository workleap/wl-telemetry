# wl-telemetry API Reference

## Table of Contents

1. [Initialization](#initialization)
2. [TelemetryClient](#telemetryclient)
3. [Honeycomb API](#honeycomb-api)
4. [LogRocket API](#logrocket-api)
5. [Mixpanel API](#mixpanel-api)
6. [Logging API](#logging-api)
7. [Noop Clients](#noop-clients)

---

## Initialization

### `initializeTelemetry(options?)`

Initialize all telemetry platforms in a single call.

```typescript
import { initializeTelemetry } from "@workleap/telemetry/react";

const telemetryClient = initializeTelemetry({
  logRocket?: {
    appId: string;                    // Required: LogRocket app ID
    options?: {
      rootHostname?: string;          // Cookie domain
      privateFieldNames?: string[];   // Additional private form fields
      privateQueryParameterNames?: string[];  // Additional private URL params
      transformers?: LogRocketSdkOptionsTransformer[];
    }
  },
  honeycomb?: {
    namespace: string;                // Required: Trace namespace
    serviceName: string;              // Required: Service name in traces
    apiServiceUrls: string | RegExp | (string | RegExp)[];  // Required: URLs to instrument
    options?: {
      proxy?: string;                 // Required if no apiKey: OTEL collector URL
      apiKey?: string;                // Required if no proxy: Honeycomb API key
      instrumentations?: OpenTelemetryInstrumentation[];
      spanProcessors?: SpanProcessor[];
      fetchInstrumentation?: false | ((defaults) => FetchInstrumentationOptions);
      documentLoadInstrumentation?: false | ((defaults) => DocumentLoadInstrumentationOptions);
      xmlHttpRequestInstrumentation?: false | ((defaults) => XHRInstrumentationOptions);
      userInteractionInstrumentation?: false | ((defaults) => UserInteractionOptions);
      transformers?: HoneycombSdkOptionsTransformer[];
    }
  },
  mixpanel?: {
    productId: string;                // Required: Product identifier (e.g., "wlp")
    envOrTrackingApiBaseUrl: string;  // Required: 'production' | 'staging' | 'development' | 'local' | 'msw' | base URL
    options?: {
      trackingEndpoint?: string;      // Custom tracking endpoint path
    }
  },
  verbose?: boolean;                  // Enable debug logging
  loggers?: RootLogger[];             // Logger instances for diagnostics
});
```

**Returns**: `TelemetryClient`

---

## TelemetryClient

Main interface to access platform-specific clients.

### Properties

| Property | Type | Description |
|---|---|---|
| `logRocket` | `LogRocketInstrumentationClient \| undefined` | LogRocket client if configured |
| `honeycomb` | `HoneycombInstrumentationClient \| undefined` | Honeycomb client if configured |
| `mixpanel` | `MixpanelClient \| undefined` | Mixpanel client if configured |

### React Hook

```typescript
import { useTelemetryClient } from "@workleap/telemetry/react";

const telemetryClient = useTelemetryClient();
```

### Provider

```typescript
import { TelemetryProvider } from "@workleap/telemetry/react";

<TelemetryProvider client={telemetryClient}>
  <App />
</TelemetryProvider>
```

---

## Honeycomb API

### `HoneycombInstrumentationClient`

#### Methods

| Method | Description |
|---|---|
| `setGlobalSpanAttribute(key: string, value: any)` | Set single span attribute |
| `setGlobalSpanAttributes(attributes: Record<string, any>)` | Set multiple span attributes |
| `registerFetchRequestHook(hook: FetchRequestHook)` | Add hook at end of pipeline |
| `registerFetchRequestHookAtStart(hook: FetchRequestHook)` | Add hook at start of pipeline |

### React Hook

```typescript
import { useHoneycombInstrumentationClient } from "@workleap/telemetry/react";

const honeycombClient = useHoneycombInstrumentationClient();

// Optional: don't throw if undefined
const honeycombClient = useHoneycombInstrumentationClient({ throwOnUndefined: false });
```

### Custom Traces with OpenTelemetry

```typescript
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("my-app");
const span = tracer.startSpan("operation-name");
span.setAttribute("custom.attribute", "value");
// ... do work
span.end();
```

### Default Honeycomb Features

- Automatic fetch request tracing
- Document load monitoring
- RUM metrics (LCP, CLS, INP)
- Unmanaged error recording

---

## LogRocket API

### `LogRocketInstrumentationClient`

#### Methods

| Method | Description |
|---|---|
| `createWorkleapPlatformDefaultUserTraits(identification)` | Create standard user traits object |
| `registerGetSessionUrlListener(listener: (url: string) => void)` | Register callback for session URL |

### `createWorkleapPlatformDefaultUserTraits` Parameters

```typescript
{
  userId: string;
  organizationId: string;
  organizationName: string;
  isMigratedToWorkleap: boolean;
  isOrganizationCreator: boolean;
  isAdmin: boolean;
  // Optional product-specific attributes
  [key: string]: any;
}
```

### React Hook

```typescript
import { useLogRocketInstrumentationClient } from "@workleap/telemetry/react";

const logRocketClient = useLogRocketInstrumentationClient();

// Optional: don't throw if undefined
const logRocketClient = useLogRocketInstrumentationClient({ throwOnUndefined: false });
```

### User Identification

```typescript
import LogRocket from "logrocket";

const client = useLogRocketInstrumentationClient();
const traits = client.createWorkleapPlatformDefaultUserTraits({
  userId: "123",
  organizationId: "456",
  organizationName: "Acme Corp",
  isMigratedToWorkleap: true,
  isAdmin: true,
  isOrganizationCreator: false
});

LogRocket.identify(traits.userId, traits);
```

### Privacy Attributes

- `data-public`: Explicitly allow DOM recording
- `data-private`: Block recording within public areas

---

## Mixpanel API

### `MixpanelClient`

#### Methods

| Method | Description |
|---|---|
| `createTrackingFunction(options?)` | Create tracking function |
| `setGlobalEventProperty(key: string, value: any)` | Set single global property |
| `setGlobalEventProperties(properties: Record<string, any>)` | Set multiple global properties |

### `createTrackingFunction` Options

```typescript
{
  targetProductId?: string;  // For cross-product events
}
```

### Tracking Function Signature

```typescript
(
  eventName: string,
  properties: Record<string, any>,
  options?: { keepAlive?: boolean }
): Promise<void>
```

### React Hooks

```typescript
import { useMixpanelClient, useMixpanelTrackingFunction } from "@workleap/telemetry/react";

// Get client
const mixpanelClient = useMixpanelClient();

// Get tracking function directly (convenience)
const track = useMixpanelTrackingFunction();

// For cross-product tracking
const trackWov = useMixpanelTrackingFunction({ targetProductId: "wov" });

// Optional: don't throw if undefined
const mixpanelClient = useMixpanelClient({ throwOnUndefined: false });
```

### Event Tracking

```typescript
const track = useMixpanelTrackingFunction();

// Standard event
track("ButtonClicked", { Trigger: "ChangePlan", Location: "Header" });

// Link tracking (keeps page alive)
track("LinkClicked", { Link: "Pricing" }, { keepAlive: true });
```

---

## Logging API

### `LogRocketLogger`

Send logs to LogRocket console capture.

```typescript
import { LogRocketLogger, LogLevel } from "@workleap/telemetry/react";

const logger = new LogRocketLogger({
  logLevel?: LogLevel.debug | LogLevel.information | LogLevel.warning | LogLevel.error | LogLevel.critical
});
```

### Logger Methods

| Method | Description |
|---|---|
| `debug(message: string)` | Debug level log |
| `information(message: string)` | Information level log |
| `warning(message: string)` | Warning level log |
| `error(message: string)` | Error level log |
| `critical(message: string)` | Critical level log |
| `withText(text: string)` | Chain text segment |
| `withObject(obj: any)` | Chain object segment |
| `withError(error: Error)` | Chain error segment |
| `startScope(name: string)` | Start scoped logging |

### Usage Example

```typescript
const logger = new LogRocketLogger({ logLevel: LogLevel.information });

// Simple logging
logger.information("User logged in");

// Complex logging
logger
  .withText("Processing step")
  .withObject({ id: 123, status: "started" })
  .information();

// Scoped logging
const scope = logger.startScope("User Login");
scope.information("Starting authentication...");
// ... more logs
scope.end();
```

### Providing Loggers to Initialization

```typescript
const telemetryClient = initializeTelemetry({
  // ... config
  loggers: [new LogRocketLogger({ logLevel: LogLevel.information })],
  verbose: true
});
```

---

## Noop Clients

Fake implementations for testing and Storybook.

| Class | Purpose |
|---|---|
| `NoopTelemetryClient` | Fake TelemetryClient |
| `NoopLogRocketInstrumentationClient` | Fake LogRocket client |
| `NoopHoneycombInstrumentationClient` | Fake Honeycomb client |
| `NoopMixpanelClient` | Fake Mixpanel client |
| `NoopMixpanelTrackingFunction` | Fake tracking function |

### Usage

```typescript
import { NoopTelemetryClient, TelemetryProvider } from "@workleap/telemetry/react";

const telemetryClient = new NoopTelemetryClient();

<TelemetryProvider client={telemetryClient}>
  <ComponentUnderTest />
</TelemetryProvider>
```

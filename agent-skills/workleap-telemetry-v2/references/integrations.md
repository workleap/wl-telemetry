# wl-telemetry Integration Patterns

## Table of Contents

1. [Honeycomb Integration](#honeycomb-integration)
2. [LogRocket Integration](#logrocket-integration)
3. [Mixpanel Integration](#mixpanel-integration)
4. [Cross-Platform Correlation](#cross-platform-correlation)

---

## Honeycomb Integration

### Purpose

Honeycomb provides distributed tracing and performance monitoring for understanding system behavior and diagnosing issues.

### Default Instrumentation

When Honeycomb is configured, wl-telemetry automatically instruments:

| Feature | Description |
|---|---|
| Fetch requests | All HTTP requests via fetch API |
| Document load | Page load timing metrics |
| RUM metrics | Core Web Vitals (LCP, CLS, INP) |
| Unmanaged errors | Uncaught exceptions |

### Configuration Options

```typescript
honeycomb: {
  namespace: "your-namespace",     // Required: Trace namespace
  serviceName: "your-service",     // Required: Service name in traces
  apiServiceUrls: [/.+/g],         // Required: URLs to instrument
  options: {
    // Authentication (one required)
    proxy: "https://otel-collector",  // Recommended: OTEL collector URL
    apiKey: "hcaik_...",              // Alternative: Direct API key (less secure)

    // Custom instrumentation
    instrumentations: [],             // Additional OpenTelemetry instrumentations
    spanProcessors: [],               // Custom span processors

    // Use `false` to disable, or a function to enable/customize the instrumentation.
    fetchInstrumentation: (config) => config,                // Customize fetch instrumentation
    documentLoadInstrumentation: (config) => config,         // Customize document load instrumentation
    xmlHttpRequestInstrumentation: (config) => config,       // Providing a function enables/customizes XHR
    userInteractionInstrumentation: (config) => config,      // Providing a function enables/customizes user interactions

    transformers: []                  // SDK-level configuration transformers
  }
}
```

### Setting Custom Attributes

```typescript
const honeycombClient = useHoneycombInstrumentationClient();

// Single attribute
honeycombClient.setGlobalSpanAttribute("app.user_id", "123");

// Multiple attributes
honeycombClient.setGlobalSpanAttributes({
  "app.user_id": "123",
  "app.organization_id": "456",
  "app.environment": "production"
});
```

### Custom Traces with OpenTelemetry

```typescript
import { trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("my-app");

// Simple span
const span = tracer.startSpan("data-processing");
span.setAttribute("item.count", items.length);
// ... do work
span.end();

// With error handling
const span = tracer.startSpan("api-call");
try {
  const result = await fetchData();
  span.setAttribute("result.size", result.length);
} catch (error) {
  span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
  span.recordException(error);
  throw error;
} finally {
  span.end();
}
```

### Fetch Request Hooks

```typescript
const honeycombClient = useHoneycombInstrumentationClient();

// Add hook at end of pipeline
honeycombClient.registerFetchRequestHook((span, request) => {
  span.setAttribute("custom.header", request.headers.get("x-custom"));
});

// Add hook at start of pipeline
honeycombClient.registerFetchRequestHookAtStart((span, request) => {
  span.setAttribute("request.url", request.url);
});
```

### Automatic Correlation

Honeycomb traces automatically include:

| Attribute | Source |
|---|---|
| `app.telemetry_id` | Current session telemetry ID |
| `app.device_id` | Device ID from wl-identity cookie |
| `app.logrocket_session_url` | LogRocket session URL (if enabled) |

---

## LogRocket Integration

### Purpose

LogRocket provides session replay for debugging frontend issues and understanding user experience.

### Default Features

| Feature | Description |
|---|---|
| Session replay | Video-like recording of user sessions |
| Console capture | Log messages (opt-in via LogRocketLogger) |
| Network monitoring | Request/response capture |
| DOM interactions | Click, scroll, input tracking |

### Configuration Options

```typescript
logRocket: {
  appId: "your-app-id",           // Required: LogRocket app ID
  options: {
    rootHostname: ".workleap.com",           // Cookie domain
    privateFieldNames: ["secret"],           // Additional private form fields
    privateQueryParameterNames: ["token"],   // Additional private URL params
    transformers: []                         // SDK-level configuration transformers
  }
}
```

### Privacy Controls

LogRocket automatically redacts sensitive data. Additional controls:

**HTML Attributes:**
- `data-public`: Explicitly allow recording of this element
- `data-private`: Block recording within a public area

```html
<!-- Everything recorded -->
<div data-public>
  <p>This is recorded</p>
  <!-- This is NOT recorded -->
  <span data-private>Sensitive info</span>
</div>
```

**Default Private Fields:**
- Authorization headers
- Passwords
- Credit card numbers
- Social security numbers
- API keys

### User Identification

```typescript
import LogRocket from "logrocket";
import { useLogRocketInstrumentationClient } from "@workleap/telemetry/react";

const client = useLogRocketInstrumentationClient();

// Create standard Workleap traits
const traits = client.createWorkleapPlatformDefaultUserTraits({
  userId: "123",
  organizationId: "456",
  organizationName: "Acme Corp",
  isMigratedToWorkleap: true,
  isAdmin: true,
  isOrganizationCreator: false,
  // Optional product-specific attributes
  hasFeatureX: true
});

// Identify user
LogRocket.identify(traits.userId, traits);
```

### Session URL Access

```typescript
const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener((url) => {
  console.log("LogRocket session:", url);
  // Use URL for external integrations
});
```

### Automatic Correlation

LogRocket sessions automatically include:

| Property | Description |
|---|---|
| `Telemetry Id` | Current session telemetry ID |
| `Device Id` | Device ID from wl-identity cookie |

---

## Mixpanel Integration

### Purpose

Mixpanel provides product analytics for tracking user behavior and measuring feature adoption.

### Configuration Options

```typescript
mixpanel: {
  productId: "wlp",              // Required: Product identifier
  envOrTrackingApiBaseUrl: "production",  // Required: Environment or base URL
  options: {
    trackingEndpoint: "/track"   // Custom tracking endpoint path
  }
}
```

**Environment Values:**
- `"production"` - Production tracking API
- `"staging"` - Staging tracking API
- `"development"` - Development tracking API
- `"local"` - Local tracking API
- `"msw"` - Mock Service Worker for testing
- Custom URL - Direct base URL

### Event Tracking

```typescript
const track = useMixpanelTrackingFunction();

// Standard event
track("ButtonClicked", {
  Trigger: "ChangePlan",
  Location: "Header"
});

// Link tracking (keeps page alive during navigation)
track("LinkClicked", { Link: "Pricing" }, { keepAlive: true });
```

**Important:** `keepAlive: true` is limited to 64 KiB body size. Use only for critical link tracking.

### Cross-Product Tracking

```typescript
// Track event for another product
const trackWov = useMixpanelTrackingFunction({ targetProductId: "wov" });

trackWov("FeatureUsed", { Feature: "Dashboard" });
```

### Global Properties

```typescript
const mixpanelClient = useMixpanelClient();

// Single property
mixpanelClient.setGlobalEventProperty("Plan", "premium");

// Multiple properties
mixpanelClient.setGlobalEventProperties({
  "User Id": "123",
  "Plan": "premium",
  "Team Size": 10
});
```

### Automatic Correlation

Mixpanel events automatically include:

| Property | Description |
|---|---|
| `Telemetry Id` | Current session telemetry ID |
| `Device Id` | Device ID from wl-identity cookie |
| `LogRocket Session URL` | LogRocket session URL (if enabled) |

---

## Cross-Platform Correlation

### How Correlation Works

wl-telemetry automatically propagates two IDs across all platforms:

```
┌──────────────────────────────────────────────────────────┐
│                    TelemetryContext                       │
│                                                          │
│  Telemetry Id (per app load)  ──┬──> Honeycomb           │
│                                 ├──> LogRocket           │
│                                 └──> Mixpanel            │
│                                                          │
│  Device Id (from wl-identity)  ──┬──> Honeycomb          │
│                                  ├──> LogRocket          │
│                                  └──> Mixpanel           │
│                                                          │
│  LogRocket Session URL ─────────┬──> Honeycomb           │
│  (if LogRocket enabled)         └──> Mixpanel            │
└──────────────────────────────────────────────────────────┘
```

### Correlation Scenarios

**Scenario 1: Backend error traced to frontend**
1. Find error trace in Honeycomb with `app.telemetry_id`
2. Search LogRocket for same `Telemetry Id`
3. Watch session replay to see user actions before error

**Scenario 2: User behavior analysis**
1. Find interesting event pattern in Mixpanel
2. Use `Telemetry Id` to find corresponding Honeycomb traces
3. Analyze performance impact of behavior

**Scenario 3: Device-level investigation**
1. User reports issue but session ended
2. Use `Device Id` to find all sessions from that device
3. Correlate across all platforms

### Accessing Correlation Values

**Important:** Do not create your own `TelemetryContext` instances. Correlation values are automatically managed by wl-telemetry and propagated to all platforms.

To verify correlation IDs are working:
- **Honeycomb**: Look for `app.telemetry_id` and `app.device_id` attributes in traces
- **LogRocket**: Check the "User Traits" filter for `Telemetry Id` and `Device Id`
- **Mixpanel**: Look for `Telemetry Id` and `Device Id` properties in events

---
order: 180
label: Use with Storybook
---

# Use with Storybook

When working with third-party tools like Storybook, developpers typically don't want to send real telemetry data to external platforms. However, the code may still depend on having an instance of the telemetry clients available.

To make this easier, the library provides "noop" implementations that satisfy the same interfaces without sending any data:

- [NoopLogRocketInstrumentationClient](../reference/telemetry/NoopLogRocketInstrumentationClient.md)
- [NoopHoneycombInstrumentationClient](../reference/telemetry/NoopHoneycombInstrumentationClient.md)
- [NoopMixpanelClient](../reference/telemetry/NoopMixpanelClient.md)

## Create a Storybook decorator

To integrate with stories that depend on a telemetry client instance, start by creating a Storybook [decorator]() that provides a fake client instance to your components:

```tsx !#9-15 withTelemetryProvider.tsx
import { TelemetryClient, TelemetryProvider, NoopLogRocketInstrumentationClient, NoopHoneycombInstrumentationClient, NoopMixpanelClient } from "@workleap/telemetry/react";
import { Decorator } from "storybook-react-rsbuild";

const logRocketClient = new NoopLogRocketInstrumentationClient();
const honeycombClient = new NoopHoneycombInstrumentationClient();
const mixpanelClient = new NoopMixpanelClient();
const telemetryClient = new TelemetryClient(logRocketClient, honeycombClient, mixpanelClient);

export const withTelemetryProvider: Decorator = Story => {
    return (
        <TelemetryProvider client={client}>
            <Story />
        </TelemetryProvider>
    );
};
```

## Set up the decorator

Then, set up the decorator globally through the `preview.ts` file:

```ts !#3 preview.ts
import { withTelemetryProvider } from "./withTelemetryProvider.tsx";

export const decorators = [withTelemetryProvider];
```

Or for a specific set of stories:

```tsx !#8 MyPage.stories.tsx
import { withTelemetryProvider } from "./withTelemetryProvider.tsx";
import { MyPage } from "./MyPage.tsx";
import type { Meta, StoryObj } from "storybook-react-rsbuild";

const meta = {
    title: "MyPage",
    component: MyPage,
    decorators: [withTelemetryProvider]
} satisfies Meta<typeof MyPage>;

export default meta;

type Story = StoryObj<typeof meta>;
 
export const Default: Story = {};
```

Or for a specific story:

```tsx !#15 MyPage.stories.tsx
import { withTelemetryProvider } from "./withTelemetryProvider.tsx";
import { MyPage } from "./MyPage.tsx";
import type { Meta, StoryObj } from "storybook-react-rsbuild";

const meta = {
    title: "MyPage",
    component: MyPage
} satisfies Meta<typeof MyPage>;

export default meta;

type Story = StoryObj<typeof meta>;
 
export const Default: Story = {
    decorators: [withTelemetryProvider]
};
```








---
order: 180
label: Use with Storybook
---

# Use with Storybook

When working with third-party tools like Storybook, developpers typically don't want to send real telemetry data to external platforms. However, the code may still depend on having an instance of the telemetry clients available.

To simplify this setup, the library provides a [NoopTelemetryClient](../reference/telemetry/NoopTelemetryClient.md) class. Follow these steps to use the telemetry clients with Storybook :point_down:

## Create a Storybook decorator

First, create a Storybook [decorator](https://storybook.js.org/docs/writing-stories/decorators) that will provide a fake telemetry client instance to the components:

```tsx !#6-12 withTelemetryProvider.tsx
import { NoopTelemetryClient, TelemetryProvider } from "@workleap/telemetry/react";
import { Decorator } from "storybook-react-rsbuild";

const telemetryClient = new NoopTelemetryClient();

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

## Try it :rocket:

Start the Storybook development server and navigate to the story of a component that depends on the telemetry client. The story should render without any error.








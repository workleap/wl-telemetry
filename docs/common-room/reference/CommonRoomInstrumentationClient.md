---
order: 90
label: CommonRoomInstrumentationClient
meta:
    title: CommonRoomInstrumentationClient - Common Room
toc:
    depth: 2-3
---

# CommonRoomInstrumentationClient

!!!warning
Don't create your own instance of `CommonRoomInstrumentationClient`, use the `registerCommonRoomInstrumentation` function instead.
!!!

A lightweight client providing access to Common Room instrumentation utilities.

## Reference

```ts
const client = new CommonRoomInstrumentationClient(logger?);
```

### Parameters

- `logger`: A `Logger` instance.

### Methods

- `identify(emailAddress)`: Identify a [Common Room](https://www.commonroom.io/) user session using an email address. 

## Usage

### Identify a user

Once identified, any previous anonymous traces that share the same user id and session id will be linked to the email address. Additionally, any existing data associated with that email address will be attached to the current session.

```ts !#5
import { registerCommonRoomInstrumentation } from "@workleap/common-room/react";

const client = registerCommonRoomInstrumentation("my-site-id");

client.identify("johndoe@contoso.com");
```



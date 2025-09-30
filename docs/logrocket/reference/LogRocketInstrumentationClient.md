---
order: 90
label: LogRocketInstrumentationClient
meta:
    title: LogRocketInstrumentationClient - LogRocket
toc:
    depth: 2-3
---

# LogRocketInstrumentationClient

!!!warning
Don't instanciate your own instance of `LogRocketInstrumentationClient`, use the `registerLogRocketInstrumentation` function instead.
!!!

A lightweight client providing access to LogRocket instrumentation utilities.

## Reference

```ts
const client = new LogRocketInstrumentationClient(telemetryContext?);
```

### Parameters

- `telemetryContext`: An optional `TelemetryContext` instance.

### Methods

- `createWorkleapPlatformDefaultUserTraits(identification)`: Creates an object containing the default user traits used to identify a web user for the Workleap platform.
- `registerGetSessionUrlListener(listener)`: Registers a listener that receives the session replay URL as a parameter once it becomes available. Host applications should use [LogRocket.getSessionURL](https://docs.logrocket.com/reference/get-session-url) instead of this method.

## Usage

### Get default user traits for the Workleap platform

```ts !#6-13
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";
import LogRocket from "logrocket";

const client = registerLogRocketInstrumentation("my-app-id");

const traits = client.createWorkleapPlatformDefaultUserTraits({
    userId: "6a5e6b06-0cac-44ee-8d2b-00b9419e7da9",
    organizationId: "e6bb30f8-0a00-4928-8943-1630895a3f14",
    organizationName: "Acme",
    isMigratedToWorkleap: true,
    isOrganizationCreator: false,
    isAdmin: false
});

Logrocket.identify(traits.userId, traits);
```

#### Parameters

- `identification`: An object that uniquely identifies the current user and provide additional context about the user environment.
    - `userId`: A value that uniquely identifies the current user.
    - `organizationId`: The organization's unique id.
    - `organizationName`: The organization name.
    - `isMigratedToWorkleap`: Whether or not this user's organization has been migrated to use the WLP, or if the user has signed up to the new experience directly.
    - `isAdmin`: Whether or not the user is an administrator in the current workspace.
    - `isOrganizationCreator`: An optional value indicating whether or not the user originally signed up to create the workspace.
    - `isReportingManager`: An optional value indicating whether or not the user is a reporting manager in the current workspace.
    - `isTeamManager`: An optional value indicating whether or not the user is a team manager in the current workspace.
    - `isExecutive`: An optional object including `boolean` values indicating whether or not the user is an executive for specific product:
        - `wov`: An optional value indicating whether or not the user is an Officevibe executive.
        - `lms`: An optional value indicating whether or not the user is an LMS executive.
        - `onb`: An optional value indicating whether or not the user is an Onboarding executive.
        - `sks`: An optional value indicating whether or not the user is a Skills executive.
        - `wpm`: An optional value indicating whether or not the user is a Performance executive.
        - `pbd`: An optional value indicating whether or not the user is a Pingboard executive.
        - `cmp`: An optional value indicating whether or not the user is a Compensation executive.
    - `isCollaborator`: An optional object including `boolean` values indicating whether or not the user is a collaborator for specific product:
        - `wov`: An optional value indicating whether or not the user is an Officevibe collaborator.
        - `lms`: An optional value indicating whether or not the user is an LMS collaborator.
        - `onb`: An optional value indicating whether or not the user is an Onboarding collaborator.
        - `sks`: An optional value indicating whether or not the user is a Skills collaborator.
        - `wpm`: An optional value indicating whether or not the user is a Performance collaborator.
        - `pbd`: An optional value indicating whether or not the user is a Pingboard collaborator.
        - `cmp`: An optional value indicating whether or not the user is a Compensation collaborator.
    - `planCode`: An optional object including `string` values indicating the user plan code for specific product:
        - `wov`: An optional value indicating the user plan code for Officevibe.
        - `lms`: An optional value indicating the user plan code for LMS.
        - `onb`: An optional value indicating the user plan code for Onboarding.
        - `sks`: An optional value indicating the user plan code for Skills.
        - `wpm`: An optional value indicating the user plan code for Performance.
        - `pbd`: An optional value indicating the user plan code for Pingboard.
        - `cmp`: An optional value indicating the user plan code for Compensation.

#### Returns

An object including the default user traits matching the provided identification values:

{.user-traits-table}
User Trait Name | Description
---  | ---
User Id | <p>A value that uniquely identifies the current user.<br/>(in case of multiple workspaces, this id would be different per workspace)</p><p>ex. `fa88ed6b-9ff4-48a0-b3a6-cee17b4855e9`</p>
Organization Id | <p>The organization's id.<br />(in case of multiple workspaces, this id would be different per workspace)</p><p>ex. `6a3f4a88-b4bd-42cf-b404-7fd83ec1808d`</p>
Organization Name | The organization's name.
Is Migrated To Workleap | `true` if this user's organization has been migrated to use the WLP, or if the user has signed up to the new experience directly.
Is Admin | `true` if the user is an administrator in the current workspace.
Is Organization Creator | `true` if the user originally signed up to create the workspace.
Is Reporting Manager | `true` if this user is a reporting manager in the current workspace.
Is Team Manager | `true` if this user is a team manager in the current workspace.
Is Executive | `true` if this user is an executive in any product  in the current workspace.
Is Executive - Officevibe<br/>Is Executive - LMS<br/>Is Executive - Onboarding<br/>Is Executive - Pingboard<br/>Is Executive - Skills<br/>Is Executive - Performance | `true` if this user is an executive of the corresponding product in the current workspace.
Is Collaborator | `true` if this user is a collaborator in any product in the current workspace.
Is Collaborator - Officevibe<br/>Is Collaborator - LMS<br />Is Collaborator - Onboarding<br/>Is Collaborator - Pingboard<br/>Is Collaborator - Skills<br/>Is Collaborator - Performance | `true` if this user is a collaborator in the corresponding product in the current workspace.
Plan Code - Officevibe<br/>Plan Code - LMS<br/>Plan Code - Onboarding<br/>Plan Code - Pingboard<br/>Plan Code - Skills<br/>Plan Code - Performance | <p>Indicates the plan code for the corresponding product in the workspace.</p><p>ex. `wov-essential-monthly-std`</p>

### Send additional traits

You can send custom user traits to improve filtering in [LogRocket](https://app.logrocket.com). To do so, merge the default user traits with your additional traits before sending them:

```ts !#15
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";
import LogRocket from "logrocket";

const client = registerLogRocketInstrumentation("my-app-id");

const allTraits = {
    ...client.createWorkleapPlatformDefaultUserTraits({
        userId: "6a5e6b06-0cac-44ee-8d2b-00b9419e7da9",
        organizationId: "e6bb30f8-0a00-4928-8943-1630895a3f14",
        organizationName: "Acme",
        isMigratedToWorkleap: true,
        isOrganizationCreator: false,
        isAdmin: false
    }),
    "Additional Trait": "Trait Value"
};

Logrocket.identify(allTraits.userId, allTraits);
```

!!!info
Additional user trait names should align with [Mixpanel](https://mixpanel.com/) property conventions. We recommend using human-readable names and appending a `- {ProductName}` suffix for product-specific traits, for example: `Plan Code - Officevibe`.
!!!

### Register a session URL listener

```ts !#6-8
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";
import LogRocket from "logrocket";

const client = registerLogRocketInstrumentation("my-app-id");

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```


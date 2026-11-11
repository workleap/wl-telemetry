# Use with agents

Information about the telemetry libraries can be shared with different agents using the [workleap-telemetry](https://skills.sh/workleap/wl-telemetry/workleap-telemetry) agent skill.

## Install agent skill

Starting with pnpm `12.11` and `@workleap/telemetry` `4.1.0`, the `workleap-telemetry` agent skill is shipped with the `@workleap/telemetry` package. Approve it when pnpm reports it during an install:

```bash
pnpm approve
```

pnpm then links the skill into the project agent skill directories, such as `.claude/skills`, and keeps it matched with the installed version of `@workleap/telemetry`. For more information, refer to the pnpm [agent skills](https://pnpm.io/agent-skills) documentation.

!!!tip
If the skill was previously installed with `skills.sh`, remove it, otherwise agents will load the skill twice:

```bash
pnpm dlx skills@latest remove workleap-telemetry
```

If the skill was installed globally, add the `--global` option:

```bash
pnpm dlx skills@latest remove workleap-telemetry --global
```
!!!

## Versions

Description | Agent skill
---  | ---
Match the latest version of the library. | [workleap-telemetry](https://skills.sh/workleap/wl-telemetry/workleap-telemetry)
Match the latest `2.*` version of the library. | [workleap-telemetry-v2](https://skills.sh/workleap/wl-telemetry/workleap-telemetry-v2)

The `2.*` versions of the library don't ship an agent skill. To use the `workleap-telemetry-v2` skill, install it with [skills.sh](https://skills.sh/) by running the following command:

```bash
pnpm dlx skills@latest add https://github.com/workleap/wl-telemetry --skill workleap-telemetry-v2
```

## Try it :rocket:

Once the skill is installed, start an agent and ask it to setup a project:

```
I'm setting up telemetry in a new React + TypeScript application. Set up Workleap telemetry end-to-end using the documented APIs and patterns.
```

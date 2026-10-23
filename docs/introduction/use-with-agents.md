---
order: 40
label: Use with agents
toc:
    depth: 2-3
---

# Use with agents

Information about the telemetry libraries can be shared with different agents using the [workleap-telemetry](https://skills.sh/workleap/wl-telemetry/workleap-telemetry) agent skill.

## Install agent skill

Open a terminal and install the `workleap-telemetry` agent skill by running the following command:

```bash
pnpx skills add https://github.com/workleap/wl-telemetry --skill workleap-telemetry
```

!!!tip
The `skills.sh` CLI will prompt you to choose whether to install the skill globally or within a project. We recommend installing it **locally** so it is available for code review tools such as [Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review) or [Claude Code](https://github.com/anthropics/claude-code-action).
!!!

## Install agent skill with pnpm

Starting with pnpm `12.11`, the `workleap-telemetry` agent skill is also shipped with the `@workleap/telemetry` package. Instead of installing the skill with `skills.sh`, approve it when pnpm reports it during an install:

```bash
pnpm approve
```

pnpm then links the skill into the project agent skill directories, such as `.claude/skills`, and keeps it matched with the installed version of `@workleap/telemetry`. For more information, refer to the pnpm [agent skills](https://pnpm.io/agent-skills) documentation.

!!!warning
Install the skill either with `skills.sh` or with pnpm, not both, otherwise agents will load the skill twice.
!!!

## Versions

Description | Agent skill
---  | ---
Match the latest version of the library. | [workleap-telemetry](https://skills.sh/workleap/wl-telemetry/workleap-telemetry)
Match the latest `2.*` version of the library. | [workleap-telemetry-v2](https://skills.sh/workleap/wl-telemetry/workleap-telemetry-v2)

## Try it :rocket:

Once the skill is installed, start an agent and ask it to setup a project:

```
I'm setting up telemetry in a new React + TypeScript application. Set up Workleap telemetry end-to-end using the documented APIs and patterns.
```

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
npx skills add https://github.com/workleap/wl-telemetry --skill workleap-telemetry
```

!!!tip
The `skills.sh` CLI will prompt you to choose whether to install the skill globally or within a project. We recommend installing it **locally** so it is available for code review tools such as [Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review) or [Claude Code](https://github.com/anthropics/claude-code-action).
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

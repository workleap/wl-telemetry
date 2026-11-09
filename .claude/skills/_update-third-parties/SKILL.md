---
name: update-third-parties
description: Update the repo's third-party sources — npm dependencies, agent skills, and GitHub Actions — together or any subset. Use as "/update-third-parties". Prompts up front for which targets to update, then delegates to the `_update-dependencies`, `_update-skills`, and `_update-github-actions` skills.
disable-model-invocation: true
model: sonnet
effort: medium
metadata:
  internal: true
---

# Update third parties

Run any subset of the repo's three third-party updates, one `Agent` leaf per target. Run from the repo root.

## Delegation model

You prompt, dispatch, and report; leaves update. Each target leaf runs its skill, dispatched at the table's model and effort; never invoke the `Skill` tool yourself.

| Target | Leaf runs | Model | Effort | Refreshes |
|---|---|---|---|---|
| npm dependencies | `_update-dependencies` | opus | high | outdated workspace packages + peer ranges, then the opted-in follow-ups |
| Agent skills | `_update-skills` | sonnet | medium | the `skills add` installs tracked in `skills-lock.json` |
| GitHub Actions | `_update-github-actions` | sonnet | medium | `uses:` refs in `.github/workflows/` (Renovate stays the scheduled path) |

## 1. Ask once, up front

A single prompt carrying both multi-select questions — one interaction, never a second round — nothing pre-selected:

- **Targets** — the three above. None chosen -> stop.
- **After the dependency update** — reset + install (`pnpm reset` + `pnpm install`) / validate (build, lint, test, all three sample apps in a browser). Applies only when npm dependencies is selected.

Every decision the leaves would ask is settled here — collected or pre-answered. Leaves never prompt.

## 2. Run the selected targets

One leaf per selected target. Sequential, in table order — deps before skills, so the skills' package gates see the bumped versions; GitHub Actions is independent and runs last only to keep the diff easy to review. Brief each leaf (the bullets are the leaf's instructions, not yours):

- Invoke your target's skill — its `Leaf runs` name from the table — via the `Skill` tool; never read-and-inline its SKILL.md. End your final message with the skill's report.
- Never prompt; a stop per the skill's own rules -> report it.
- Deps leaf: skip the skill's step-1 prompt entirely and run exactly the follow-ups checked here (pass them verbatim; none checked -> none). The validation step needs a prerequisite that's missing -> skip that part and say so, never ask.

A blocked target never aborts the others — record, move on.

## Report

One combined summary: a one-line result per selected target (from its leaf's report) and the follow-up results from the deps leaf. Note unselected and blocked targets.

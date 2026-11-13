# CLAUDE.md

`@workleap/telemetry` — telemetry libraries for Workleap web applications. See [CONTRIBUTING.md](./CONTRIBUTING.md) for commands and workflows.

## Agent skills

- `agent-skills/workleap-telemetry/` is the only source of the published skill. `@workleap/telemetry` ships it for pnpm: the package's `prepack` script copies it to `packages/telemetry/skills/`, which is gitignored and removed by `postpack`. Never commit a copy, since `skills.sh` could then discover two `workleap-telemetry` skills.
- Every change to `agent-skills/workleap-telemetry/` needs a `patch` changeset for `@workleap/telemetry`, otherwise pnpm users never receive it. The CI fails a pull request that changes the skill without adding one. Never add `[skip ci]` to a commit that changes the skill: it skips that check and the release.
- `agent-skills/workleap-telemetry-v2/` is a versioned skill. It is not shipped in a package, needs no changeset, and must never be updated.
- `.claude-plugin/marketplace.json` exists so `skills.sh` finds the skills from the repository root. Keep its paths in sync if a skill moves.

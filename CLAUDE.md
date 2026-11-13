# CLAUDE.md

`@workleap/telemetry` — telemetry libraries for Workleap web applications. See [CONTRIBUTING.md](./CONTRIBUTING.md) for commands and workflows.

## Agent skills

- `agent-skills/workleap-telemetry/` is the only source of the published skill. `@workleap/telemetry` ships it for pnpm: the package's `prepack` script copies it to `packages/telemetry/skills/`, which is gitignored and removed by `postpack`. Never commit a copy, since `skills.sh` could then discover two `workleap-telemetry` skills.
- Every change to `agent-skills/workleap-telemetry/` needs a `patch` changeset for `@workleap/telemetry`, otherwise pnpm users never receive it. The CI fails a pull request that changes the skill without adding one. Never add `[skip ci]` to a commit that changes the skill: it skips that check and the release.
- `agent-skills/workleap-telemetry-v2/` is a versioned skill. It is not shipped in a package, needs no changeset, and must never be updated.
- `.claude-plugin/marketplace.json` exists so `skills.sh` finds the skills from the repository root. Keep its paths in sync if a skill moves.

## GitHub Actions

Renovate merges its GitHub Actions updates into `main` without a pull request. See [CONTRIBUTING.md](./CONTRIBUTING.md#github-actions) for the setup and what it depends on.

- Never remove the `renovate/**` push trigger from `ci.yml`: Renovate never merges a branch that has no passing check.
- Pin every `uses:` to a commit hash with its release in a comment (`owner/repo@<sha> # vX.Y.Z`), never to a tag (`@v7`, `@latest`) or a branch. Never drop the version comment: Renovate ignores a hash that has none.
- Never move `anthropics/claude-code-action` back into the shared Renovate group, and never add a `schedule` to throttle it.
- Never replace the `automerge` settings of `renovate.json` with the organization's `all-automerge.json` preset, which leaves major updates out, and never add a branch protection on `main` that requires a pull request or an approval, which stops the auto-merge.

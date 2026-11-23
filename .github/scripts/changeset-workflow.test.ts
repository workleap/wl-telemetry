// node --test .github/scripts/changeset-workflow.test.ts
//
// The Changesets workflow holds the npm publishing identity (npm Trusted Publishing, through id-token: write).
// These tests fail when a change gives that identity to a job that installs or builds the packages, or takes
// the publish job out of its protected environment.
// Read "Release the packages" in CONTRIBUTING.md before changing the workflow or these tests.
import { deepStrictEqual, match, strictEqual } from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import { parse } from "yaml";

interface Step {
    uses?: string;
    run?: string;
    with?: Record<string, unknown>;
}

interface Job {
    permissions?: Record<string, string>;
    environment?: string;
    steps: Step[];
}

interface Workflow {
    permissions?: Record<string, string>;
    jobs: Record<string, Job>;
}

const root = resolve(import.meta.dirname, "../..");
const workflow = parse(readFileSync(resolve(root, ".github/workflows/changeset.yml"), "utf8")) as Workflow;
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")) as { scripts: Record<string, string> };

const jobs = Object.entries(workflow.jobs);
const steps = jobs.flatMap(([, job]) => job.steps);

const BuildCommand = /\b(build|build-pkg|turbo|rslib)\b/;
const InstallCommand = /\bpnpm (install|i|add|update|up|dlx)\b/;

function jobNames(predicate: (job: Job) => boolean) {
    return jobs.filter(([, job]) => predicate(job)).map(([name]) => name);
}

function runs(job: Job, command: RegExp) {
    return job.steps.flatMap(step => (step.run !== undefined && command.test(step.run) ? [step.run] : []));
}

const publishJobNames = jobNames(job => job.steps.some(step => step.with?.["publish-script"] !== undefined));
const publishJob = workflow.jobs[publishJobNames[0]];

describe("changeset.yml", () => {
    it("gives a job no permission it does not declare", () => {
        deepStrictEqual(workflow.permissions, {});
    });

    it("has a single job that publishes", () => {
        strictEqual(publishJobNames.length, 1);
    });

    it("gives the npm publishing identity to the job that publishes, and to no other job", () => {
        deepStrictEqual(
            jobNames(job => job.permissions?.["id-token"] !== undefined),
            publishJobNames
        );
    });

    it("binds the job that publishes to the npm-publish environment", () => {
        strictEqual(publishJob.environment, "npm-publish");
    });

    it("runs no build in the job that publishes", () => {
        deepStrictEqual(runs(publishJob, BuildCommand), []);
    });

    it("only installs the workspace root in the job that publishes", () => {
        deepStrictEqual(runs(publishJob, InstallCommand), ["pnpm install --frozen-lockfile --ignore-scripts --filter workspace-root"]);
    });

    it("only runs changeset publish as the publish script", () => {
        const publishScripts = publishJob.steps.map(step => step.with?.["publish-script"]).filter(script => script !== undefined);

        deepStrictEqual(publishScripts, ["pnpm publish-pkg"]);
        strictEqual(packageJson.scripts["publish-pkg"], "changeset publish");
    });

    it("gives a read-only token to a job that builds", () => {
        const buildJobs = jobs.filter(([, job]) => runs(job, BuildCommand).length > 0);

        strictEqual(buildJobs.length, 1);

        for (const [, job] of buildJobs) {
            deepStrictEqual(job.permissions, { contents: "read" });
        }
    });

    it("installs from the lockfile, without lifecycle scripts, in every job", () => {
        for (const [, job] of jobs) {
            for (const run of runs(job, InstallCommand)) {
                match(run, /^pnpm install --frozen-lockfile --ignore-scripts( --filter \S+)+$/);
            }
        }
    });

    it("pins every action to a commit", () => {
        for (const step of steps) {
            if (step.uses !== undefined) {
                match(step.uses, /^[\w.-]+\/[\w./-]+@[0-9a-f]{40}$/);
            }
        }
    });

    it("restores no cache", () => {
        deepStrictEqual(
            steps.filter(step => step.uses?.startsWith("actions/cache") || step.with?.cache !== undefined),
            []
        );
    });
});

// node --test .github/scripts/changeset-workflow.test.ts
//
// The Changesets workflow holds the npm publishing identity (npm Trusted Publishing, through id-token: write).
// These tests fail when a change gives that identity to a job that builds the packages, adds a step to the
// publish job, or takes the publish job out of its protected environment.
// Read "The Changesets workflow" in CONTRIBUTING.md before changing the workflow or these tests.
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

const workflow = parse(readFileSync(resolve(import.meta.dirname, "../workflows/changeset.yml"), "utf8")) as Workflow;

const jobs = Object.entries(workflow.jobs);
const steps = jobs.flatMap(([, job]) => job.steps);

const BuildCommand = /\b(build|build-pkg|turbo|rslib)\b/;
const InstallCommand = "pnpm install --frozen-lockfile --ignore-scripts";

function jobNames(predicate: (job: Job) => boolean) {
    return jobs.filter(([, job]) => predicate(job)).map(([name]) => name);
}

// "actions/checkout@<sha>" -> "actions/checkout"
function actionName(step: Step) {
    return step.uses?.split("@")[0];
}

function uses(job: Job, action: string) {
    return job.steps.some(step => actionName(step) === action);
}

function builds(job: Job) {
    return job.steps.some(step => step.run !== undefined && BuildCommand.test(step.run));
}

const publishJobNames = jobNames(job => uses(job, "changesets/action/publish") || uses(job, "changesets/action"));
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

    it("only installs the Changesets CLI and publishes in the job that publishes", () => {
        deepStrictEqual(
            publishJob.steps.map(step => actionName(step) ?? step.run),
            ["actions/checkout", "pnpm/action-setup", "actions/setup-node", InstallCommand, "changesets/action/publish"]
        );
    });

    it("publishes the tarballs of the pack job, not the output of a script", () => {
        const publishStep = publishJob.steps.find(step => actionName(step) === "changesets/action/publish");

        deepStrictEqual(Object.keys(publishStep?.with ?? {}), ["pack-dir-artifact-id"]);
    });

    it("gives a read-only token to the job that builds and packs", () => {
        const buildJobNames = jobNames(builds);

        deepStrictEqual(
            buildJobNames,
            jobNames(job => uses(job, "changesets/action/pack"))
        );
        strictEqual(buildJobNames.length, 1);
        deepStrictEqual(workflow.jobs[buildJobNames[0]].permissions, { contents: "read" });
    });

    it("installs from the lockfile, without lifecycle scripts, in every job", () => {
        for (const step of steps) {
            if (step.run?.includes("pnpm install")) {
                strictEqual(step.run, InstallCommand);
            }

            if (actionName(step) === "pnpm/action-setup") {
                strictEqual(step.with?.run_install, false);
            }
        }
    });

    it("leaves no credentials in the checkout of any job", () => {
        for (const step of steps) {
            if (actionName(step) === "actions/checkout") {
                strictEqual(step.with?.["persist-credentials"], false);
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
            steps.filter(step => actionName(step)?.startsWith("actions/cache") || step.with?.cache !== undefined),
            []
        );
    });
});

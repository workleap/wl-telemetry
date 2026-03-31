import { loadEnv } from "@rsbuild/core";
import { defineDevConfig } from "@workleap/rsbuild-configs";
import path from "node:path";

const { parsed } = loadEnv({
    cwd: path.resolve("../../../..")
});

export default defineDevConfig({
    environmentVariables: {
        ...parsed,
        HONEYCOMB_API_KEY: process.env.HONEYCOMB_API_KEY
    }
});

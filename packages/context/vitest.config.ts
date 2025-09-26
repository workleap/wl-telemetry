import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        include: ["tests/**/*.test.ts"],
        exclude: ["node_modules", "dist"],
        testTransformMode: {
            web: [".ts"]
        },
        reporters: "verbose"
    },
    cacheDir: "./node_modules/.cache/vitest"
});

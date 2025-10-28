import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "happy-dom",
        include: ["tests/**/*.test.{ts,tsx}"],
        exclude: ["node_modules", "dist"],
        reporters: "verbose"
    },
    cacheDir: "./node_modules/.cache/vitest"
});

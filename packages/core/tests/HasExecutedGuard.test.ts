import { test } from "vitest";
import { HasExecutedGuard } from "../src/HasExecutedGuard.ts";

test.concurrent("when the \"throw\" function is called once, do nothing", ({ expect }) => {
    const guard = new HasExecutedGuard();

    expect(guard.hasExecuted).toBeFalsy();

    guard.throw("foo");

    expect(guard.hasExecuted).toBeTruthy();
});

test.concurrent("when the \"throw\" function is called twice, throw an error", ({ expect }) => {
    const guard = new HasExecutedGuard();

    guard.throw("foo");

    expect(() => guard.throw("foo")).toThrow(/foo/);
});

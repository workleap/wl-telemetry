import { afterEach, test, vi } from "vitest";
import { FetchRequestPipeline, type FetchRequestHookFunction } from "../../src/js/FetchRequestPipeline.ts";
import { DummySpan } from "../utils.ts";

afterEach(() => {
    vi.clearAllMocks();
});

test.concurrent("when a request is dispatched, all the hooks are executed", ({ expect }) => {
    const pipeline = new FetchRequestPipeline();

    const hook1 = vi.fn();
    const hook2 = vi.fn();
    const hook3 = vi.fn();

    pipeline.registerHook(hook1);
    pipeline.registerHook(hook2);
    pipeline.registerHook(hook3);

    const request: RequestInit = { method: "GET" };

    pipeline.dispatchRequest(new DummySpan(), request);

    expect(hook1).toHaveBeenCalledTimes(1);
    expect(hook2).toHaveBeenCalledTimes(1);
    expect(hook3).toHaveBeenCalledTimes(1);
});

test.concurrent("when a hook returns true, subsequent hooks are not executed", ({ expect }) => {
    const pipeline = new FetchRequestPipeline();

    const hook1 = vi.fn((() => true) as FetchRequestHookFunction);
    const hook2 = vi.fn();
    const hook3 = vi.fn();

    pipeline.registerHook(hook1);
    pipeline.registerHook(hook2);
    pipeline.registerHook(hook3);

    const request: RequestInit = { method: "GET" };

    pipeline.dispatchRequest(new DummySpan(), request);

    expect(hook1).toHaveBeenCalledTimes(1);
    expect(hook2).not.toHaveBeenCalled();
    expect(hook3).not.toHaveBeenCalled();
});

test.concurrent("when a hook returns false, subsequent hooks are executed", ({ expect }) => {
    const pipeline = new FetchRequestPipeline();

    const hook1 = vi.fn(() => false);
    const hook2 = vi.fn();
    const hook3 = vi.fn();

    // This is expected to test this case.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    pipeline.registerHook(hook1);
    pipeline.registerHook(hook2);
    pipeline.registerHook(hook3);

    const request: RequestInit = { method: "GET" };

    pipeline.dispatchRequest(new DummySpan(), request);

    expect(hook1).toHaveBeenCalledTimes(1);
    expect(hook2).toHaveBeenCalledTimes(1);
    expect(hook3).toHaveBeenCalledTimes(1);
});

test.concurrent("when a hook return something else than true, subsequent hooks are executed", ({ expect }) => {
    const pipeline = new FetchRequestPipeline();

    const hook1 = vi.fn(() => 1);
    const hook2 = vi.fn();
    const hook3 = vi.fn();

    // This is expected to test this case.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    pipeline.registerHook(hook1);
    pipeline.registerHook(hook2);
    pipeline.registerHook(hook3);

    const request: RequestInit = { method: "GET" };

    pipeline.dispatchRequest(new DummySpan(), request);

    expect(hook1).toHaveBeenCalledTimes(1);
    expect(hook2).toHaveBeenCalledTimes(1);
    expect(hook3).toHaveBeenCalledTimes(1);
});

test.concurrent("when a hook is registered at start, it's executed first", ({ expect }) => {
    const pipeline = new FetchRequestPipeline();

    const hook1 = vi.fn();
    const hook2 = vi.fn();
    const hook3 = vi.fn();

    pipeline.registerHook(hook1);
    pipeline.registerHook(hook2);
    pipeline.registerHookAtStart(hook3);

    const request: RequestInit = { method: "GET" };

    pipeline.dispatchRequest(new DummySpan(), request);

    expect(hook1).toHaveBeenCalledTimes(1);
    expect(hook2).toHaveBeenCalledTimes(1);
    expect(hook3).toHaveBeenCalledTimes(1);

    expect(hook3.mock.invocationCallOrder[0]).toBeLessThan(hook1.mock.invocationCallOrder[0]);
    expect(hook3.mock.invocationCallOrder[0]).toBeLessThan(hook2.mock.invocationCallOrder[0]);
});

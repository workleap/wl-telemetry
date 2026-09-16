import { ExportResultCode, type ExportResult } from "@opentelemetry/core";
import { InMemorySpanExporter, type ReadableSpan, SimpleSpanProcessor, WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { createServer, type IncomingMessage, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, afterEach, beforeAll, beforeEach, test } from "vitest";
import { ProxyTraceExporter } from "../../src/js/ProxyTraceExporter.ts";

// Exercises the exporter against a real HTTP server behaving like the proxies: the requests are authenticated with a
// session cookie and rejected with a 401 otherwise. The test environment (happy-dom) emulates a browser Fetch API,
// including the CORS preflight requests and the cookie jar, which makes the "credentials" behavior observable.

interface ReceivedRequest {
    method: string | undefined;
    url: string | undefined;
    origin: string | undefined;
    cookie: string | undefined;
    contentType: string | undefined;
    body: string;
}

const SessionCookieName = "wl-session";

let server: Server;
let serverUrl: string;
let receivedRequests: ReceivedRequest[] = [];

function readBody(request: IncomingMessage) {
    return new Promise<string>(resolve => {
        const chunks: Buffer[] = [];

        request.on("data", chunk => chunks.push(chunk));
        request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
}

function hasSessionCookie(cookieHeader: string | undefined) {
    return (cookieHeader ?? "").split(";").some(x => x.trim().startsWith(`${SessionCookieName}=`));
}

beforeAll(async () => {
    server = createServer(async (request, response) => {
        const body = await readBody(request);

        receivedRequests.push({
            method: request.method,
            url: request.url,
            origin: request.headers.origin,
            cookie: request.headers.cookie,
            contentType: request.headers["content-type"],
            body
        });

        // A credentialed cross-origin request requires a specific origin and "Access-Control-Allow-Credentials".
        const corsHeaders = {
            "Access-Control-Allow-Origin": request.headers.origin ?? "",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": request.headers["access-control-request-headers"] ?? "content-type",
            "Vary": "Origin"
        };

        // The JSON content type triggers a CORS preflight request.
        if (request.method === "OPTIONS") {
            response.writeHead(204, corsHeaders);
            response.end();

            return;
        }

        if (!hasSessionCookie(request.headers.cookie)) {
            response.writeHead(401, { ...corsHeaders, "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Unauthorized" }));

            return;
        }

        response.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
        response.end(JSON.stringify({}));
    });

    // Listen on the document hostname so the document cookies apply to the server, like an application and its proxy sharing a domain.
    await new Promise<void>(resolve => server.listen(0, globalThis.location.hostname, resolve));

    serverUrl = `http://${globalThis.location.hostname}:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

beforeEach(() => {
    receivedRequests = [];
});

afterEach(() => {
    document.cookie = `${SessionCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
});

function createSpans() {
    const memoryExporter = new InMemorySpanExporter();

    const provider = new WebTracerProvider({
        spanProcessors: [new SimpleSpanProcessor(memoryExporter)]
    });

    provider.getTracer("integration").startSpan("integration-span").end();

    return memoryExporter.getFinishedSpans();
}

function exportSpans(exporter: ProxyTraceExporter, spans: ReadableSpan[]) {
    return new Promise<ExportResult>(resolve => {
        exporter.export(spans, resolve);
    });
}

function getPostRequests() {
    return receivedRequests.filter(x => x.method === "POST");
}

test("send the session cookie with the request", async ({ expect }) => {
    document.cookie = `${SessionCookieName}=abc123; path=/`;

    const exporter = new ProxyTraceExporter({
        url: `${serverUrl}/v1/traces`,
        headers: { "Content-Type": "application/json" }
    });

    const result = await exportSpans(exporter, createSpans());

    expect(result.code).toBe(ExportResultCode.SUCCESS);

    const requests = getPostRequests();

    expect(requests).toHaveLength(1);
    expect(requests[0].url).toBe("/v1/traces");
    expect(requests[0].origin).toBe(globalThis.location.origin);
    expect(requests[0].cookie).toBe(`${SessionCookieName}=abc123`);
    expect(requests[0].contentType).toBe("application/json");

    const payload = JSON.parse(requests[0].body);

    expect(payload.resourceSpans[0].scopeSpans[0].spans[0].name).toBe("integration-span");
});

test("the json content type triggers a cors preflight request", async ({ expect }) => {
    document.cookie = `${SessionCookieName}=abc123; path=/`;

    const exporter = new ProxyTraceExporter({
        url: `${serverUrl}/v1/traces`,
        headers: { "Content-Type": "application/json" }
    });

    await exportSpans(exporter, createSpans());

    expect(receivedRequests.some(x => x.method === "OPTIONS" && x.url === "/v1/traces")).toBe(true);
});

test("fail without retrying when there is no session cookie", async ({ expect }) => {
    const exporter = new ProxyTraceExporter({
        url: `${serverUrl}/v1/traces`,
        headers: { "Content-Type": "application/json" }
    });

    const result = await exportSpans(exporter, createSpans());

    expect(result.code).toBe(ExportResultCode.FAILED);
    expect(result.error?.message).toContain("401");

    const requests = getPostRequests();

    expect(requests).toHaveLength(1);
    expect(requests[0].cookie).toBeUndefined();
});

test("do not send the session cookie when the credentials are omitted", async ({ expect }) => {
    document.cookie = `${SessionCookieName}=abc123; path=/`;

    const exporter = new ProxyTraceExporter({
        url: `${serverUrl}/v1/traces`,
        headers: { "Content-Type": "application/json" },
        credentials: "omit"
    });

    const result = await exportSpans(exporter, createSpans());

    expect(result.code).toBe(ExportResultCode.FAILED);

    const requests = getPostRequests();

    expect(requests).toHaveLength(1);
    expect(requests[0].cookie).toBeUndefined();
});

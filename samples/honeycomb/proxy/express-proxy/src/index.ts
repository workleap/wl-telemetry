import cors from "cors";
import * as dotenv from "dotenv";
import express, { json, type Request, type Response } from "express";
import path from "node:path";

dotenv.config({
    path: [path.resolve("../../../../.env.local")]
});

// The proxy authenticates the trace requests with a session cookie, like the real proxies do. The browser only sends
// the cookie when the trace requests are sent with the credentials, which is what the Honeycomb instrumentation does.
const SessionCookieName = "wl-sample-session";

const app = express();
const port = 5678;

app.use(json());

// A credentialed cross-origin request requires a specific origin and "Access-Control-Allow-Credentials: true".
app.use(cors({
    origin: ["http://localhost:8080"],
    methods: ["POST"],
    credentials: true
}));

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

function hasSessionCookie(req: Request) {
    return (req.headers.cookie ?? "").split(";").some(x => x.trim().startsWith(`${SessionCookieName}=`));
}

app.post("/v1/traces", async (req: Request, res: Response) => {
    if (!hasSessionCookie(req)) {
        console.warn(`[server]: Rejected a trace request without a "${SessionCookieName}" cookie.`);

        res.status(401).json({
            success: false,
            message: `The "${SessionCookieName}" cookie is required.`
        });

        return;
    }

    const payload = req.body;

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-honeycomb-team": process.env.HONEYCOMB_API_KEY ?? ""
        },
        body: JSON.stringify(payload)
    };

    try {
        const honeycombResponse = await fetch("https://api.honeycomb.io/v1/traces", options);

        console.log(`[server]: Forwarded a trace request to Honeycomb, status ${honeycombResponse.status}.`);

        res.status(honeycombResponse.status).json({
            success: honeycombResponse.ok
        });
    } catch (error: unknown) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : JSON.stringify(error)
        });
    }
});

import cors from "cors";
import * as dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import Mixpanel from "mixpanel";
import fs from "node:fs";
import https from "node:https";
import path from "node:path";

dotenv.config({
    path: [path.resolve("../../../.env.local")]
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const projectToken = process.env.MIXPANEL_PROJECT_TOKEN!;

const mixpanel = Mixpanel.init(projectToken, {
    verbose: true
});

const app = express();
const port = 5678;

const certificates = {
    key: fs.readFileSync("../local.workleap.com-key.pem"),
    cert: fs.readFileSync("../local.workleap.com.pem")
};

app.use(cors({
    origin: "https://local.workleap.com",
    credentials: true
}));

app.use(express.json());

https.createServer(certificates, app).listen(port, "127.0.0.1", () => {
    console.log(`[server]: Server is running at http://local.workleap.com:${port}`);
});

// Local tracking service endpoint because the SSD tracking service only works
// for products and requires an auth cookie.
app.post("/api/shell/navigation/tracking/track", (req: Request, res: Response) => {
    const {
        eventName,
        properties
    } = req.body;

    mixpanel.track(eventName, properties);

    res.status(200).send("OK");
});

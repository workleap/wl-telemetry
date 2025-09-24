import type { Logger } from "@workleap/logging";
import { v4 as uuidv4 } from "uuid";
import { getDeviceId, setDeviceId } from "./deviceId.ts";

export const TelemetryContextVariableName = "__WLP_TELEMETRY_CONTEXT__";

export class TelemetryContext {
    readonly #telemetryId: string;
    readonly #deviceId: string;

    constructor(telemetryId: string, deviceId: string) {
        this.#telemetryId = telemetryId;
        this.#deviceId = deviceId;
    }

    get telemetryId() {
        return this.#telemetryId;
    }

    get deviceId() {
        return this.#deviceId;
    }
}

export interface CreateTelemetryContextOptions {
    identityCookieExpiration?: Date;
    identityCookieDomain?: string;
}

export function createTelemetryContext(logger: Logger, options: CreateTelemetryContextOptions = {}) {
    const {
        identityCookieExpiration = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        identityCookieDomain = ".workleap.com"
    } = options;

    let deviceId = getDeviceId(logger);

    if (!deviceId) {
        deviceId = uuidv4();

        setDeviceId(deviceId, identityCookieExpiration, identityCookieDomain, logger);
    }

    const telemetryId = uuidv4();

    logger.information(`[telemetry] Telemetry id is: ${telemetryId}`);
    logger.information(`[telemetry] Device id is: ${deviceId}`);

    return new TelemetryContext(telemetryId, deviceId);
}

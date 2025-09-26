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

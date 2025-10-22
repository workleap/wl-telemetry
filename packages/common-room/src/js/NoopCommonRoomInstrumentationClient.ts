import type { CommonRoomInstrumentationClient } from "./CommonRoomInstrumentationClient.ts";

export class NoopCommonRoomInstrumentationClient implements CommonRoomInstrumentationClient {
    identify() {}
}

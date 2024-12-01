import { TransportHttp } from "./http.js";
import { TransportWebSocket } from "./webSocket.js";
export * from "./http.js";
export * from "./transport.js";
export * from "./webSocket.js";
export declare function transportFromUri(uri: string, config?: {
    timeout?: number;
}): TransportHttp | TransportWebSocket;
//# sourceMappingURL=advanced.d.ts.map
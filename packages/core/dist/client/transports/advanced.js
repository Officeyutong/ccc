import { TransportHttp } from "./http.js";
import { TransportWebSocket } from "./webSocket.js";
export * from "./http.js";
export * from "./transport.js";
export * from "./webSocket.js";
export function transportFromUri(uri, config) {
    if (uri.startsWith("wss://")) {
        return new TransportWebSocket(uri, config?.timeout);
    }
    return new TransportHttp(uri, config?.timeout);
}

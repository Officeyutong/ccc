"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transportFromUri = transportFromUri;
const http_js_1 = require("./http.js");
const webSocket_js_1 = require("./webSocket.js");
__exportStar(require("./http.js"), exports);
__exportStar(require("./transport.js"), exports);
__exportStar(require("./webSocket.js"), exports);
function transportFromUri(uri, config) {
    if (uri.startsWith("wss://")) {
        return new webSocket_js_1.TransportWebSocket(uri, config?.timeout);
    }
    return new http_js_1.TransportHttp(uri, config?.timeout);
}

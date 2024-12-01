"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPublicMainnet = void 0;
const isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
const clientPublicMainnet_advanced_js_1 = require("./clientPublicMainnet.advanced.js");
const clientTypes_js_1 = require("./clientTypes.js");
const index_js_1 = require("./jsonRpc/index.js");
/**
 * @public
 */
class ClientPublicMainnet extends index_js_1.ClientJsonRpc {
    constructor(config) {
        super(config?.url ??
            (typeof isomorphic_ws_1.default !== "undefined"
                ? "wss://mainnet.ckb.dev/ws"
                : "https://mainnet.ckb.dev/"), config);
        this.config = config;
    }
    get scripts() {
        return this.config?.scripts ?? clientPublicMainnet_advanced_js_1.MAINNET_SCRIPTS;
    }
    get addressPrefix() {
        return "ckb";
    }
    async getKnownScript(script) {
        const found = this.scripts[script];
        if (!found) {
            throw new Error(`No script information was found for ${script} on ${this.addressPrefix}`);
        }
        return clientTypes_js_1.ScriptInfo.from(found);
    }
}
exports.ClientPublicMainnet = ClientPublicMainnet;

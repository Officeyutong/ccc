"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPublicTestnet = void 0;
const isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
const clientPublicTestnet_advanced_js_1 = require("./clientPublicTestnet.advanced.js");
const clientTypes_js_1 = require("./clientTypes.js");
const index_js_1 = require("./jsonRpc/index.js");
/**
 * @public
 */
class ClientPublicTestnet extends index_js_1.ClientJsonRpc {
    constructor(config) {
        super(config?.url ??
            (typeof isomorphic_ws_1.default !== "undefined"
                ? "wss://testnet.ckb.dev/ws"
                : "https://testnet.ckb.dev/"), config);
        this.config = config;
    }
    get scripts() {
        return this.config?.scripts ?? clientPublicTestnet_advanced_js_1.TESTNET_SCRIPTS;
    }
    get addressPrefix() {
        return "ckt";
    }
    async getKnownScript(script) {
        const found = this.scripts[script];
        return clientTypes_js_1.ScriptInfo.from(found);
    }
}
exports.ClientPublicTestnet = ClientPublicTestnet;

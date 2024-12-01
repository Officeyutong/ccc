import WebSocket from "isomorphic-ws";
import { TESTNET_SCRIPTS } from "./clientPublicTestnet.advanced.js";
import { ScriptInfo } from "./clientTypes.js";
import { ClientJsonRpc } from "./jsonRpc/index.js";
/**
 * @public
 */
export class ClientPublicTestnet extends ClientJsonRpc {
    constructor(config) {
        super(config?.url ??
            (typeof WebSocket !== "undefined"
                ? "wss://testnet.ckb.dev/ws"
                : "https://testnet.ckb.dev/"), config);
        this.config = config;
    }
    get scripts() {
        return this.config?.scripts ?? TESTNET_SCRIPTS;
    }
    get addressPrefix() {
        return "ckt";
    }
    async getKnownScript(script) {
        const found = this.scripts[script];
        return ScriptInfo.from(found);
    }
}

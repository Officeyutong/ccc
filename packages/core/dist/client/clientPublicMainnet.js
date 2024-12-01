import WebSocket from "isomorphic-ws";
import { MAINNET_SCRIPTS } from "./clientPublicMainnet.advanced.js";
import { ScriptInfo } from "./clientTypes.js";
import { ClientJsonRpc } from "./jsonRpc/index.js";
/**
 * @public
 */
export class ClientPublicMainnet extends ClientJsonRpc {
    constructor(config) {
        super(config?.url ??
            (typeof WebSocket !== "undefined"
                ? "wss://mainnet.ckb.dev/ws"
                : "https://mainnet.ckb.dev/"), config);
        this.config = config;
    }
    get scripts() {
        return this.config?.scripts ?? MAINNET_SCRIPTS;
    }
    get addressPrefix() {
        return "ckb";
    }
    async getKnownScript(script) {
        const found = this.scripts[script];
        if (!found) {
            throw new Error(`No script information was found for ${script} on ${this.addressPrefix}`);
        }
        return ScriptInfo.from(found);
    }
}

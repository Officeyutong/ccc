import { ClientCache } from "./cache/index.js";
import { TESTNET_SCRIPTS } from "./clientPublicTestnet.advanced.js";
import { KnownScript, ScriptInfo } from "./clientTypes.js";
import { ClientJsonRpc } from "./jsonRpc/index.js";
/**
 * @public
 */
export declare class ClientPublicTestnet extends ClientJsonRpc {
    private readonly config?;
    constructor(config?: {
        url?: string;
        timeout?: number;
        scripts?: typeof TESTNET_SCRIPTS;
        cache?: ClientCache;
    } | undefined);
    get scripts(): typeof TESTNET_SCRIPTS;
    get addressPrefix(): string;
    getKnownScript(script: KnownScript): Promise<ScriptInfo>;
}
//# sourceMappingURL=clientPublicTestnet.d.ts.map
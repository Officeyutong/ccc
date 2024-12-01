import { ClientCache } from "./cache/index.js";
import { MAINNET_SCRIPTS } from "./clientPublicMainnet.advanced.js";
import { KnownScript, ScriptInfo } from "./clientTypes.js";
import { ClientJsonRpc } from "./jsonRpc/index.js";
/**
 * @public
 */
export declare class ClientPublicMainnet extends ClientJsonRpc {
    private readonly config?;
    constructor(config?: {
        url?: string;
        timeout?: number;
        scripts?: typeof MAINNET_SCRIPTS;
        cache?: ClientCache;
    } | undefined);
    get scripts(): typeof MAINNET_SCRIPTS;
    get addressPrefix(): string;
    getKnownScript(script: KnownScript): Promise<ScriptInfo>;
}
//# sourceMappingURL=clientPublicMainnet.d.ts.map
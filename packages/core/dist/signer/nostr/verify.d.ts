import { BytesLike } from "../../bytes/index.js";
import { NostrEvent } from "./signerNostr.js";
/**
 * @public
 */
export declare function buildNostrEventFromMessage(message: string | BytesLike): NostrEvent;
export declare function verifyMessageNostrEvent(message: string | BytesLike, signature: string, address: string): boolean;
//# sourceMappingURL=verify.d.ts.map
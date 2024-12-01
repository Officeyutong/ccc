import { schnorr } from "@noble/curves/secp256k1";
import { sha256 } from "@noble/hashes/sha256";
import { bech32 } from "bech32";
import { bytesFrom } from "../../bytes/index.js";
import { hexFrom } from "../../hex/index.js";
/**
 * @public
 */
export function buildNostrEventFromMessage(message) {
    if (typeof message === "string") {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const event = JSON.parse(message);
            if (typeof event === "object" &&
                typeof event.created_at === "number" &&
                typeof event.kind === "number" &&
                typeof event.content === "string" &&
                Array.isArray(event.args) &&
                event.args.every((tag) => Array.isArray(tag) &&
                    tag.every((v) => typeof v === "string"))) {
                return event;
            }
        }
        catch (_) { }
    }
    return {
        kind: 23335,
        created_at: 0,
        content: typeof message === "string" ? message : hexFrom(message),
        tags: [],
    };
}
export function verifyMessageNostrEvent(message, signature, address) {
    const { words } = bech32.decode(address);
    const publicKey = hexFrom(bech32.fromWords(words)).slice(2);
    const event = buildNostrEventFromMessage(message);
    const serialized = JSON.stringify([
        0,
        publicKey,
        event.created_at,
        event.kind,
        event.tags,
        event.content,
    ]);
    const eventHash = hexFrom(sha256(bytesFrom(serialized, "utf8")));
    try {
        return schnorr.verify(signature.slice(2), eventHash.slice(2), publicKey);
    }
    catch (_) {
        return false;
    }
}

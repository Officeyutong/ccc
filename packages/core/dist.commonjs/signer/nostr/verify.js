"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNostrEventFromMessage = buildNostrEventFromMessage;
exports.verifyMessageNostrEvent = verifyMessageNostrEvent;
const secp256k1_1 = require("@noble/curves/secp256k1");
const sha256_1 = require("@noble/hashes/sha256");
const bech32_1 = require("bech32");
const index_js_1 = require("../../bytes/index.js");
const index_js_2 = require("../../hex/index.js");
/**
 * @public
 */
function buildNostrEventFromMessage(message) {
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
        content: typeof message === "string" ? message : (0, index_js_2.hexFrom)(message),
        tags: [],
    };
}
function verifyMessageNostrEvent(message, signature, address) {
    const { words } = bech32_1.bech32.decode(address);
    const publicKey = (0, index_js_2.hexFrom)(bech32_1.bech32.fromWords(words)).slice(2);
    const event = buildNostrEventFromMessage(message);
    const serialized = JSON.stringify([
        0,
        publicKey,
        event.created_at,
        event.kind,
        event.tags,
        event.content,
    ]);
    const eventHash = (0, index_js_2.hexFrom)((0, sha256_1.sha256)((0, index_js_1.bytesFrom)(serialized, "utf8")));
    try {
        return secp256k1_1.schnorr.verify(signature.slice(2), eventHash.slice(2), publicKey);
    }
    catch (_) {
        return false;
    }
}

import { secp256k1 } from "@noble/curves/secp256k1";
import { magicHash } from "bitcoinjs-message";
import { bytesFrom } from "../../bytes/index.js";
import { hexFrom } from "../../hex/index.js";
/**
 * @public
 */
export function verifyMessageBtcEcdsa(message, signature, publicKey) {
    const challenge = typeof message === "string" ? message : hexFrom(message).slice(2);
    const [_, ...rawSign] = bytesFrom(signature, "base64");
    return secp256k1.verify(bytesFrom(rawSign), magicHash(challenge), publicKey);
}

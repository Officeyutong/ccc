"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageHashCkbSecp256k1 = messageHashCkbSecp256k1;
exports.verifyMessageCkbSecp256k1 = verifyMessageCkbSecp256k1;
const secp256k1_1 = require("@noble/curves/secp256k1");
const index_js_1 = require("../../bytes/index.js");
const index_js_2 = require("../../hasher/index.js");
const index_js_3 = require("../../hex/index.js");
const index_js_4 = require("../../num/index.js");
/**
 * @public
 */
function messageHashCkbSecp256k1(message) {
    const msg = typeof message === "string" ? message : (0, index_js_3.hexFrom)(message);
    const buffer = (0, index_js_1.bytesFrom)(`Nervos Message:${msg}`, "utf8");
    return (0, index_js_2.hashCkb)(buffer);
}
/**
 * @public
 */
function verifyMessageCkbSecp256k1(message, signature, publicKey) {
    const signatureBytes = (0, index_js_1.bytesFrom)(signature);
    return secp256k1_1.secp256k1.verify(new secp256k1_1.secp256k1.Signature((0, index_js_4.numFrom)(signatureBytes.slice(0, 32)), (0, index_js_4.numFrom)(signatureBytes.slice(32, 64))).addRecoveryBit(Number((0, index_js_4.numFrom)(signatureBytes.slice(64, 65)))), (0, index_js_1.bytesFrom)(messageHashCkbSecp256k1(message)), (0, index_js_1.bytesFrom)(publicKey));
}

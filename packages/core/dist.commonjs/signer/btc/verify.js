"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMessageBtcEcdsa = verifyMessageBtcEcdsa;
const secp256k1_1 = require("@noble/curves/secp256k1");
const bitcoinjs_message_1 = require("bitcoinjs-message");
const index_js_1 = require("../../bytes/index.js");
const index_js_2 = require("../../hex/index.js");
/**
 * @public
 */
function verifyMessageBtcEcdsa(message, signature, publicKey) {
    const challenge = typeof message === "string" ? message : (0, index_js_2.hexFrom)(message).slice(2);
    const [_, ...rawSign] = (0, index_js_1.bytesFrom)(signature, "base64");
    return secp256k1_1.secp256k1.verify((0, index_js_1.bytesFrom)(rawSign), (0, bitcoinjs_message_1.magicHash)(challenge), publicKey);
}

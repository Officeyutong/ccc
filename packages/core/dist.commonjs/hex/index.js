"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexFrom = hexFrom;
const index_js_1 = require("../bytes/index.js");
/**
 * Converts a HexLike value to a Hex string.
 * @public
 *
 * @param hex - The value to convert, which can be a string, Uint8Array, ArrayBuffer, or number array.
 * @returns A Hex string representing the value.
 *
 * @example
 * ```typescript
 * const hexString = hexFrom("68656c6c6f"); // Outputs "0x68656c6c6f"
 * const hexStringFromBytes = hexFrom(new Uint8Array([104, 101, 108, 108, 111])); // Outputs "0x68656c6c6f"
 * ```
 */
function hexFrom(hex) {
    return `0x${(0, index_js_1.bytesTo)((0, index_js_1.bytesFrom)(hex), "hex") || "0"}`;
}

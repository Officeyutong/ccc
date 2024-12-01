import { bytesFrom, bytesTo } from "../bytes/index.js";
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
export function hexFrom(hex) {
    return `0x${bytesTo(bytesFrom(hex), "hex") || "0"}`;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numMin = numMin;
exports.numMax = numMax;
exports.numFrom = numFrom;
exports.numToHex = numToHex;
exports.numToBytes = numToBytes;
exports.numLeToBytes = numLeToBytes;
exports.numBeToBytes = numBeToBytes;
exports.numFromBytes = numFromBytes;
exports.numLeFromBytes = numLeFromBytes;
exports.numBeFromBytes = numBeFromBytes;
const index_js_1 = require("../bytes/index.js");
const index_js_2 = require("../hex/index.js");
/**
 * Get the min among all numbers.
 * @public
 *
 * @param numbers - numbers.
 * @returns The min numbers among them.
 *
 * @example
 * ```typescript
 * numMin(1, 2, 3); // Outputs 1n
 * ```
 */
function numMin(a, ...numbers) {
    let min = numFrom(a);
    numbers.forEach((nLike) => {
        const n = numFrom(nLike);
        if (n < min) {
            min = n;
        }
    });
    return min;
}
/**
 * Get the max among all numbers.
 * @public
 *
 * @param numbers - numbers.
 * @returns The max numbers among them.
 *
 * @example
 * ```typescript
 * numMax(1, 2, 3); // Outputs 3n
 * ```
 */
function numMax(a, ...numbers) {
    let max = numFrom(a);
    numbers.forEach((nLike) => {
        const n = numFrom(nLike);
        if (n > max) {
            max = n;
        }
    });
    return max;
}
/**
 * Converts a NumLike value to a Num (bigint).
 * @public
 *
 * @param val - The value to convert, which can be a string, number, bigint, or HexLike.
 * @returns A Num (bigint) representing the value.
 *
 * @example
 * ```typescript
 * const num = numFrom("12345"); // Outputs 12345n
 * const numFromHex = numFrom("0x3039"); // Outputs 12345n
 * ```
 */
function numFrom(val) {
    if (typeof val === "bigint") {
        return val;
    }
    if (typeof val === "string" || typeof val === "number") {
        return BigInt(val);
    }
    return BigInt((0, index_js_2.hexFrom)(val));
}
/**
 * Converts a NumLike value to a hexadecimal string.
 * @public
 *
 * @param val - The value to convert, which can be a string, number, bigint, or HexLike.
 * @returns A Hex string representing the numeric value.
 *
 * @example
 * ```typescript
 * const hex = numToHex(12345); // Outputs "0x3039"
 * ```
 */
function numToHex(val) {
    return `0x${numFrom(val).toString(16)}`;
}
/**
 * Converts a NumLike value to a byte array in little-endian order.
 * @public
 *
 * @param val - The value to convert, which can be a string, number, bigint, or HexLike.
 * @param bytes - The number of bytes to use for the representation. If not provided, the exact number of bytes needed is used.
 * @returns A Uint8Array containing the byte representation of the numeric value.
 *
 * @example
 * ```typescript
 * const bytes = numToBytes(12345, 4); // Outputs Uint8Array [57, 48, 0, 0]
 * ```
 */
function numToBytes(val, bytes) {
    return numLeToBytes(val, bytes);
}
/**
 * Converts a NumLike value to a byte array in little-endian order.
 * @public
 *
 * @param val - The value to convert, which can be a string, number, bigint, or HexLike.
 * @param bytes - The number of bytes to use for the representation. If not provided, the exact number of bytes needed is used.
 * @returns A Uint8Array containing the byte representation of the numeric value.
 *
 * @example
 * ```typescript
 * const bytes = numLeToBytes(12345, 4); // Outputs Uint8Array [57, 48, 0, 0]
 * ```
 */
function numLeToBytes(val, bytes) {
    return numBeToBytes(val, bytes).reverse();
}
/**
 * Converts a NumLike value to a byte array in big-endian order.
 * @public
 *
 * @param val - The value to convert, which can be a string, number, bigint, or HexLike.
 * @param bytes - The number of bytes to use for the representation. If not provided, the exact number of bytes needed is used.
 * @returns A Uint8Array containing the byte representation of the numeric value.
 *
 * @example
 * ```typescript
 * const bytes = numBeToBytes(12345, 4); // Outputs Uint8Array [0, 0, 48, 57]
 * ```
 */
function numBeToBytes(val, bytes) {
    const rawBytes = (0, index_js_1.bytesFrom)(numFrom(val).toString(16));
    if (bytes == null) {
        return rawBytes;
    }
    return (0, index_js_1.bytesConcat)(Array.from(Array(bytes - rawBytes.length), () => 0), rawBytes);
}
/**
 * Converts a byte array to a Num (bigint) assuming little-endian order.
 * @public
 *
 * @param val - The byte array to convert.
 * @returns A Num (bigint) representing the numeric value.
 *
 * @example
 * ```typescript
 * const num = numFromBytes(new Uint8Array([57, 48, 0, 0])); // Outputs 12345n
 * ```
 */
function numFromBytes(val) {
    return numLeFromBytes(val);
}
/**
 * Converts a byte array to a Num (bigint) assuming little-endian order.
 * @public
 *
 * @param val - The byte array to convert.
 * @returns A Num (bigint) representing the numeric value.
 *
 * @example
 * ```typescript
 * const num = numLeFromBytes(new Uint8Array([57, 48, 0, 0])); // Outputs 12345n
 * ```
 */
function numLeFromBytes(val) {
    return numBeFromBytes([...(0, index_js_1.bytesFrom)(val)].reverse());
}
/**
 * Converts a byte array to a Num (bigint) assuming big-endian order.
 * @public
 *
 * @param val - The byte array to convert.
 * @returns A Num (bigint) representing the numeric value.
 *
 * @example
 * ```typescript
 * const num = numBeFromBytes(new Uint8Array([0, 0, 48, 57])); // Outputs 12345n
 * ```
 */
function numBeFromBytes(val) {
    return numFrom((0, index_js_1.bytesFrom)(val));
}

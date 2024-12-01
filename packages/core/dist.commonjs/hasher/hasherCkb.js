"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasherCkb = void 0;
exports.hashCkb = hashCkb;
exports.hashTypeId = hashTypeId;
const blake2b_1 = require("@noble/hashes/blake2b");
const index_js_1 = require("../bytes/index.js");
const index_js_2 = require("../ckb/index.js");
const index_js_3 = require("../hex/index.js");
const index_js_4 = require("../num/index.js");
const advanced_js_1 = require("./advanced.js");
/**
 * @public
 */
class HasherCkb {
    /**
     * Creates an instance of Hasher.
     *
     * @param outLength - The output length of the hash in bytes. Default is 32.
     * @param personal - The personal string for the Blake2b algorithm. Default is CKB_BLAKE2B_PERSONAL.
     */
    constructor(outLength = 32, personal = advanced_js_1.CKB_BLAKE2B_PERSONAL) {
        this.hasher = blake2b_1.blake2b.create({
            personalization: personal,
            dkLen: outLength,
        });
    }
    /**
     * Updates the hash with the given data.
     *
     * @param data - The data to update the hash with.
     * @returns The current Hasher instance for chaining.
     *
     * @example
     * ```typescript
     * const hasher = new Hasher();
     * hasher.update("some data").update("more data");
     * const hash = hasher.digest();
     * ```
     */
    update(data) {
        this.hasher.update((0, index_js_1.bytesFrom)(data));
        return this;
    }
    /**
     * Finalizes the hash and returns the digest as a hexadecimal string.
     *
     * @returns The hexadecimal string representation of the hash.
     *
     * @example
     * ```typescript
     * const hasher = new Hasher();
     * hasher.update("some data");
     * const hash = hasher.digest(); // Outputs something like "0x..."
     * ```
     */
    digest() {
        return (0, index_js_3.hexFrom)(this.hasher.digest());
    }
}
exports.HasherCkb = HasherCkb;
/**
 * Computes the CKB hash of the given data using the Blake2b algorithm.
 * @public
 *
 * @param data - The data to hash.
 * @returns The hexadecimal string representation of the hash.
 *
 * @example
 * ```typescript
 * const hash = hashCkb("some data"); // Outputs something like "0x..."
 * ```
 */
function hashCkb(...data) {
    const hasher = new HasherCkb();
    data.forEach((d) => hasher.update(d));
    return hasher.digest();
}
/**
 * Computes the Type ID hash of the given data.
 * @public
 *
 * @param cellInputLike - The first cell input of the transaction.
 * @param outputIndex - The output index of the Type ID cell.
 * @returns The hexadecimal string representation of the hash.
 *
 * @example
 * ```typescript
 * const hash = hashTypeId(cellInput, outputIndex); // Outputs something like "0x..."
 * ```
 */
function hashTypeId(cellInputLike, outputIndex) {
    return hashCkb(index_js_2.CellInput.from(cellInputLike).toBytes(), (0, index_js_4.numLeToBytes)(outputIndex, 8));
}

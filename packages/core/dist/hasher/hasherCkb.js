import { blake2b } from "@noble/hashes/blake2b";
import { bytesFrom } from "../bytes/index.js";
import { CellInput } from "../ckb/index.js";
import { hexFrom } from "../hex/index.js";
import { numLeToBytes } from "../num/index.js";
import { CKB_BLAKE2B_PERSONAL } from "./advanced.js";
/**
 * @public
 */
export class HasherCkb {
    /**
     * Creates an instance of Hasher.
     *
     * @param outLength - The output length of the hash in bytes. Default is 32.
     * @param personal - The personal string for the Blake2b algorithm. Default is CKB_BLAKE2B_PERSONAL.
     */
    constructor(outLength = 32, personal = CKB_BLAKE2B_PERSONAL) {
        this.hasher = blake2b.create({
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
        this.hasher.update(bytesFrom(data));
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
        return hexFrom(this.hasher.digest());
    }
}
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
export function hashCkb(...data) {
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
export function hashTypeId(cellInputLike, outputIndex) {
    return hashCkb(CellInput.from(cellInputLike).toBytes(), numLeToBytes(outputIndex, 8));
}

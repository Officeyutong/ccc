import { BytesLike } from "../bytes/index.js";
import { CellInputLike } from "../ckb/index.js";
import { Hex } from "../hex/index.js";
import { NumLike } from "../num/index.js";
import { Hasher } from "./hasher.js";
/**
 * @public
 */
export declare class HasherCkb implements Hasher {
    private readonly hasher;
    /**
     * Creates an instance of Hasher.
     *
     * @param outLength - The output length of the hash in bytes. Default is 32.
     * @param personal - The personal string for the Blake2b algorithm. Default is CKB_BLAKE2B_PERSONAL.
     */
    constructor(outLength?: number, personal?: string);
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
    update(data: BytesLike): HasherCkb;
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
    digest(): Hex;
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
export declare function hashCkb(...data: BytesLike[]): Hex;
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
export declare function hashTypeId(cellInputLike: CellInputLike, outputIndex: NumLike): Hex;
//# sourceMappingURL=hasherCkb.d.ts.map
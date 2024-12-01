import { Bytes, BytesLike } from "../bytes/index.js";
import { Client, KnownScript } from "../client/index.js";
import { Hex, HexLike } from "../hex/index.js";
import * as mol from "./molecule.advanced/index.js";
/**
 * @public
 */
export type HashTypeLike = string | number | bigint;
/**
 * @public
 */
export type HashType = "type" | "data" | "data1" | "data2";
/**
 * Converts a HashTypeLike value to a HashType.
 * @public
 *
 * @param val - The value to convert, which can be a string, number, or bigint.
 * @returns The corresponding HashType.
 *
 * @throws Will throw an error if the input value is not a valid hash type.
 *
 * @example
 * ```typescript
 * const hashType = hashTypeFrom(1); // Outputs "data"
 * const hashType = hashTypeFrom("type"); // Outputs "type"
 * ```
 */
export declare function hashTypeFrom(val: HashTypeLike): HashType;
/**
 * Converts a HashTypeLike value to its corresponding byte representation.
 * @public
 *
 * @param hashType - The hash type value to convert.
 * @returns A Uint8Array containing the byte representation of the hash type.
 *
 * @example
 * ```typescript
 * const hashTypeBytes = hashTypeToBytes("type"); // Outputs Uint8Array [0]
 * ```
 */
export declare function hashTypeToBytes(hashType: HashTypeLike): Bytes;
/**
 * Converts a byte-like value to a HashType.
 * @public
 *
 * @param bytes - The byte-like value to convert.
 * @returns The corresponding HashType.
 *
 * @throws Will throw an error if the input bytes do not correspond to a valid hash type.
 *
 * @example
 * ```typescript
 * const hashType = hashTypeFromBytes(new Uint8Array([0])); // Outputs "type"
 * ```
 */
export declare function hashTypeFromBytes(bytes: BytesLike): HashType;
/**
 * @public
 */
export type ScriptLike = {
    codeHash: BytesLike;
    hashType: HashTypeLike;
    args: BytesLike;
};
/**
 * @public
 */
export declare class Script {
    codeHash: Hex;
    hashType: HashType;
    args: Hex;
    /**
     * Creates an instance of Script.
     *
     * @param codeHash - The code hash of the script.
     * @param hashType - The hash type of the script.
     * @param args - The arguments for the script.
     */
    constructor(codeHash: Hex, hashType: HashType, args: Hex);
    get occupiedSize(): number;
    /**
     * Clone a script.
     *
     * @returns A cloned Script instance.
     *
     * @example
     * ```typescript
     * const script1 = script0.clone();
     * ```
     */
    clone(): Script;
    /**
     * Creates a Script instance from a ScriptLike object.
     *
     * @param script - A ScriptLike object or an instance of Script.
     * @returns A Script instance.
     *
     * @example
     * ```typescript
     * const script = Script.from({
     *   codeHash: "0x1234...",
     *   hashType: "type",
     *   args: "0xabcd..."
     * });
     * ```
     */
    static from(script: ScriptLike): Script;
    /**
     * Creates a Script instance from client and known script.
     *
     * @param knownScript - A KnownScript enum.
     * @param args - Args for the script.
     * @param client - A ScriptLike object or an instance of Script.
     * @returns A promise that resolves to the script instance.
     *
     * @example
     * ```typescript
     * const script = await Script.fromKnownScript(
     *   client,
     *   KnownScript.XUdt,
     *   args: "0xabcd..."
     * );
     * ```
     */
    static fromKnownScript(client: Client, knownScript: KnownScript, args: HexLike): Promise<Script>;
    /**
     * Converts the Script instance to molecule data format.
     *
     * @returns An object representing the script in molecule data format.
     */
    _toMolData(): {
        codeHash: Bytes;
        hashType: Bytes;
        args: Bytes;
    };
    /**
     * Converts the Script instance to bytes.
     *
     * @returns A Uint8Array containing the script bytes.
     *
     * @example
     * ```typescript
     * const scriptBytes = script.toBytes();
     * ```
     */
    toBytes(): Bytes;
    /**
     * Get hash of a script
     *
     * @returns Hash of this script
     *
     * @example
     * ```typescript
     * const hash = script.hash();
     * ```
     */
    hash(): Hex;
    /**
     * Creates a Script instance from a byte-like value or molecule Script.
     *
     * @param bytes - The byte-like value or molecule Script to convert.
     * @returns A Script instance.
     *
     * @example
     * ```typescript
     * const script = Script.fromBytes(new Uint8Array([/* script bytes *\/]));
     * ```
     */
    static fromBytes(bytes: BytesLike | mol.Script): Script;
    /**
     * Compares the current Script instance with another ScriptLike object for equality.
     *
     * @param val - The ScriptLike object to compare with.
     * @returns True if the scripts are equal, otherwise false.
     *
     * @example
     * ```typescript
     * const isEqual = script.eq(anotherScript);
     * ```
     */
    eq(val: ScriptLike): boolean;
}
//# sourceMappingURL=script.d.ts.map
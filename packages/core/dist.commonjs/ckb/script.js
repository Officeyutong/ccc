"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Script = void 0;
exports.hashTypeFrom = hashTypeFrom;
exports.hashTypeToBytes = hashTypeToBytes;
exports.hashTypeFromBytes = hashTypeFromBytes;
const index_js_1 = require("../bytes/index.js");
const index_js_2 = require("../hasher/index.js");
const index_js_3 = require("../hex/index.js");
const mol = __importStar(require("./molecule.advanced/index.js"));
const script_advanced_js_1 = require("./script.advanced.js");
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
function hashTypeFrom(val) {
    const hashType = (() => {
        if (typeof val === "number") {
            return script_advanced_js_1.NUM_TO_HASH_TYPE[val];
        }
        if (typeof val === "bigint") {
            return script_advanced_js_1.NUM_TO_HASH_TYPE[Number(val)];
        }
        if (!script_advanced_js_1.HASH_TYPES.includes(val)) {
            return;
        }
        return val;
    })();
    if (hashType === undefined) {
        throw new Error(`Invalid hash type ${val}`);
    }
    return hashType;
}
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
function hashTypeToBytes(hashType) {
    return (0, index_js_1.bytesFrom)([script_advanced_js_1.HASH_TYPE_TO_NUM[hashTypeFrom(hashType)]]);
}
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
function hashTypeFromBytes(bytes) {
    return script_advanced_js_1.NUM_TO_HASH_TYPE[(0, index_js_1.bytesFrom)(bytes)[0]];
}
/**
 * @public
 */
class Script {
    /**
     * Creates an instance of Script.
     *
     * @param codeHash - The code hash of the script.
     * @param hashType - The hash type of the script.
     * @param args - The arguments for the script.
     */
    constructor(codeHash, hashType, args) {
        this.codeHash = codeHash;
        this.hashType = hashType;
        this.args = args;
    }
    get occupiedSize() {
        return 33 + (0, index_js_1.bytesFrom)(this.args).length;
    }
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
    clone() {
        return new Script(this.codeHash, this.hashType, this.args);
    }
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
    static from(script) {
        if (script instanceof Script) {
            return script;
        }
        return new Script((0, index_js_3.hexFrom)(script.codeHash), hashTypeFrom(script.hashType), (0, index_js_3.hexFrom)(script.args));
    }
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
    static async fromKnownScript(client, knownScript, args) {
        const script = await client.getKnownScript(knownScript);
        return new Script(script.codeHash, script.hashType, (0, index_js_3.hexFrom)(args));
    }
    /**
     * Converts the Script instance to molecule data format.
     *
     * @returns An object representing the script in molecule data format.
     */
    _toMolData() {
        return {
            codeHash: (0, index_js_1.bytesFrom)(this.codeHash),
            hashType: hashTypeToBytes(this.hashType),
            args: (0, index_js_1.bytesFrom)(this.args),
        };
    }
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
    toBytes() {
        return (0, index_js_1.bytesFrom)(mol.SerializeScript(this._toMolData()));
    }
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
    hash() {
        return (0, index_js_2.hashCkb)(this.toBytes());
    }
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
    static fromBytes(bytes) {
        const view = bytes instanceof mol.Script ? bytes : new mol.Script((0, index_js_1.bytesFrom)(bytes));
        return new Script((0, index_js_3.hexFrom)(view.getCodeHash().raw()), hashTypeFromBytes([view.getHashType()]), (0, index_js_3.hexFrom)(view.getArgs().raw()));
    }
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
    eq(val) {
        const script = Script.from(val);
        return (this.codeHash === script.codeHash &&
            this.args === script.args &&
            this.hashType === script.hashType);
    }
}
exports.Script = Script;

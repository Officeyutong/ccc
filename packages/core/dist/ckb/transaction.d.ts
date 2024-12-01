import { ClientCollectableSearchKeyFilterLike } from "../advancedBarrel.js";
import { Bytes, BytesLike } from "../bytes/index.js";
import { CellDepInfoLike, Client, KnownScript } from "../client/index.js";
import { Hasher } from "../hasher/index.js";
import { Hex, HexLike } from "../hex/index.js";
import { Num, NumLike } from "../num/index.js";
import { Signer } from "../signer/index.js";
import * as mol from "./molecule.advanced/index.js";
import { Script, ScriptLike } from "./script.js";
import { LumosTransactionSkeletonType } from "./transactionLumos.js";
/**
 * @public
 */
export type DepTypeLike = string | number | bigint;
/**
 * @public
 */
export type DepType = "depGroup" | "code";
/**
 * Converts a DepTypeLike value to a DepType.
 * @public
 *
 * @param val - The value to convert, which can be a string, number, or bigint.
 * @returns The corresponding DepType.
 *
 * @throws Will throw an error if the input value is not a valid dep type.
 *
 * @example
 * ```typescript
 * const depType = depTypeFrom(1); // Outputs "code"
 * const depType = depTypeFrom("depGroup"); // Outputs "depGroup"
 * ```
 */
export declare function depTypeFrom(val: DepTypeLike): DepType;
/**
 * Converts a DepTypeLike value to its corresponding byte representation.
 * @public
 *
 * @param depType - The dep type value to convert.
 * @returns A Uint8Array containing the byte representation of the dep type.
 *
 * @example
 * ```typescript
 * const depTypeBytes = depTypeToBytes("code"); // Outputs Uint8Array [1]
 * ```
 */
export declare function depTypeToBytes(depType: DepTypeLike): Bytes;
/**
 * Converts a byte-like value to a DepType.
 * @public
 *
 * @param bytes - The byte-like value to convert.
 * @returns The corresponding DepType.
 *
 * @throws Will throw an error if the input bytes do not correspond to a valid dep type.
 *
 * @example
 * ```typescript
 * const depType = depTypeFromBytes(new Uint8Array([1])); // Outputs "code"
 * ```
 */
export declare function depTypeFromBytes(bytes: BytesLike): DepType;
/**
 * @public
 */
export type OutPointLike = {
    txHash: HexLike;
    index: NumLike;
};
/**
 * @public
 */
export declare class OutPoint {
    txHash: Hex;
    index: Num;
    /**
     * Creates an instance of OutPoint.
     *
     * @param txHash - The transaction hash.
     * @param index - The index of the output in the transaction.
     */
    constructor(txHash: Hex, index: Num);
    /**
     * Clone an OutPoint.
     *
     * @returns A cloned OutPoint instance.
     *
     * @example
     * ```typescript
     * const outPoint1 = outPoint0.clone();
     * ```
     */
    clone(): OutPoint;
    /**
     * Creates an OutPoint instance from an OutPointLike object.
     *
     * @param outPoint - An OutPointLike object or an instance of OutPoint.
     * @returns An OutPoint instance.
     *
     * @example
     * ```typescript
     * const outPoint = OutPoint.from({ txHash: "0x...", index: 0 });
     * ```
     */
    static from(outPoint: OutPointLike): OutPoint;
    /**
     * Converts the OutPoint instance to molecule data format.
     *
     * @returns An object representing the outpoint in molecule data format.
     */
    _toMolData(): {
        txHash: Bytes;
        index: Bytes;
    };
    /**
     * Converts the OutPoint instance to bytes.
     *
     * @returns A Uint8Array containing the outpoint bytes.
     *
     * @example
     * ```typescript
     * const outPointBytes = outPoint.toBytes();
     * ```
     */
    toBytes(): Bytes;
    /**
     * Creates an OutPoint instance from a byte-like value or molecule OutPoint.
     *
     * @param bytes - The byte-like value or molecule OutPoint to convert.
     * @returns An OutPoint instance.
     *
     * @example
     * ```typescript
     * const outPoint = OutPoint.fromBytes(new Uint8Array([/* outpoint bytes *\/]));
     * ```
     */
    static fromBytes(bytes: BytesLike | mol.OutPoint): OutPoint;
    /**
     * Compares the current OutPoint instance with another OutPointLike object for equality.
     *
     * @param val - The OutPointLike object to compare with.
     * @returns True if the out points are equal, otherwise false.
     *
     * @example
     * ```typescript
     * const isEqual = outPoint.eq(anotherOutPoint);
     * ```
     */
    eq(val: OutPointLike): boolean;
}
/**
 * @public
 */
export type CellOutputLike = {
    capacity: NumLike;
    lock: ScriptLike;
    type?: ScriptLike | null;
};
/**
 * @public
 */
export declare class CellOutput {
    capacity: Num;
    lock: Script;
    type?: Script | undefined;
    /**
     * Creates an instance of CellOutput.
     *
     * @param capacity - The capacity of the cell.
     * @param lock - The lock script of the cell.
     * @param type - The optional type script of the cell.
     */
    constructor(capacity: Num, lock: Script, type?: Script | undefined);
    get occupiedSize(): number;
    /**
     * Clone a CellOutput.
     *
     * @returns A cloned CellOutput instance.
     *
     * @example
     * ```typescript
     * const cellOutput1 = cellOutput0.clone();
     * ```
     */
    clone(): CellOutput;
    /**
     * Creates a CellOutput instance from a CellOutputLike object.
     *
     * @param cellOutput - A CellOutputLike object or an instance of CellOutput.
     * @returns A CellOutput instance.
     *
     * @example
     * ```typescript
     * const cellOutput = CellOutput.from({
     *   capacity: 1000n,
     *   lock: { codeHash: "0x...", hashType: "type", args: "0x..." },
     *   type: { codeHash: "0x...", hashType: "type", args: "0x..." }
     * });
     * ```
     */
    static from(cellOutput: CellOutputLike): CellOutput;
    /**
     * Converts the CellOutput instance to molecule data format.
     *
     * @returns An object representing the cell output in molecule data format.
     */
    _toMolData(): {
        capacity: Bytes;
        lock: {
            codeHash: Bytes;
            hashType: Bytes;
            args: Bytes;
        };
        type: {
            codeHash: Bytes;
            hashType: Bytes;
            args: Bytes;
        } | undefined;
    };
    /**
     * Converts the CellOutput instance to bytes.
     *
     * @returns A Uint8Array containing the cell output bytes.
     *
     * @example
     * ```typescript
     * const cellOutputBytes = cellOutput.toBytes();
     * ```
     */
    toBytes(): Bytes;
    /**
     * Creates a CellOutput instance from a byte-like value or molecule CellOutput.
     *
     * @param bytes - The byte-like value or molecule CellOutput to convert.
     * @returns A CellOutput instance.
     *
     * @example
     * ```typescript
     * const cellOutput = CellOutput.fromBytes(new Uint8Array([/* cell output bytes *\/]));
     * ```
     */
    static fromBytes(bytes: BytesLike | mol.CellOutput): CellOutput;
}
/**
 * @public
 */
export type CellLike = {
    outPoint: OutPointLike;
    cellOutput: CellOutputLike;
    outputData: HexLike;
};
/**
 * @public
 */
export declare class Cell {
    outPoint: OutPoint;
    cellOutput: CellOutput;
    outputData: Hex;
    /**
     * Creates an instance of Cell.
     *
     * @param outPoint - The output point of the cell.
     * @param cellOutput - The cell output of the cell.
     * @param outputData - The output data of the cell.
     */
    constructor(outPoint: OutPoint, cellOutput: CellOutput, outputData: Hex);
    /**
     * Creates a Cell instance from a CellLike object.
     *
     * @param cell - A CellLike object or an instance of Cell.
     * @returns A Cell instance.
     */
    static from(cell: CellLike): Cell;
    /**
     * Clone a Cell
     *
     * @returns A cloned Cell instance.
     *
     * @example
     * ```typescript
     * const cell1 = cell0.clone();
     * ```
     */
    clone(): Cell;
}
/**
 * @public
 */
export type EpochLike = [NumLike, NumLike, NumLike];
/**
 * @public
 */
export type Epoch = [Num, Num, Num];
/**
 * @public
 */
export declare function epochFrom(epochLike: EpochLike): Epoch;
/**
 * @public
 */
export declare function epochFromHex(hex: HexLike): Epoch;
/**
 * @public
 */
export declare function epochToHex(epochLike: EpochLike): Hex;
/**
 * @public
 */
export type SinceLike = {
    relative: "absolute" | "relative";
    metric: "blockNumber" | "epoch" | "timestamp";
    value: NumLike;
} | NumLike;
/**
 * @public
 */
export declare class Since {
    relative: "absolute" | "relative";
    metric: "blockNumber" | "epoch" | "timestamp";
    value: Num;
    /**
     * Creates an instance of Since.
     *
     * @param relative - Absolute or relative
     * @param metric - The metric of since
     * @param value - The value of since
     */
    constructor(relative: "absolute" | "relative", metric: "blockNumber" | "epoch" | "timestamp", value: Num);
    /**
     * Clone a Since.
     *
     * @returns A cloned Since instance.
     *
     * @example
     * ```typescript
     * const since1 = since0.clone();
     * ```
     */
    clone(): Since;
    /**
     * Creates a Since instance from a SinceLike object.
     *
     * @param since - A SinceLike object or an instance of Since.
     * @returns A Since instance.
     *
     * @example
     * ```typescript
     * const since = Since.from("0x1234567812345678");
     * ```
     */
    static from(since: SinceLike): Since;
    /**
     * Converts the Since instance to num.
     *
     * @returns A num
     *
     * @example
     * ```typescript
     * const num = since.toNum();
     * ```
     */
    toNum(): Num;
    /**
     * Creates a Since instance from a num-like value.
     *
     * @param numLike - The num-like value to convert.
     * @returns A Since instance.
     *
     * @example
     * ```typescript
     * const since = Since.fromNum("0x0");
     * ```
     */
    static fromNum(numLike: NumLike): Since;
}
/**
 * @public
 */
export type CellInputLike = {
    previousOutput: OutPointLike;
    since?: SinceLike | NumLike | null;
    cellOutput?: CellOutputLike | null;
    outputData?: HexLike | null;
};
/**
 * @public
 */
export declare class CellInput {
    previousOutput: OutPoint;
    since: Num;
    cellOutput?: CellOutput | undefined;
    outputData?: Hex | undefined;
    /**
     * Creates an instance of CellInput.
     *
     * @param previousOutput - The previous outpoint of the cell.
     * @param since - The since value of the cell input.
     * @param cellOutput - The optional cell output associated with the cell input.
     * @param outputData - The optional output data associated with the cell input.
     */
    constructor(previousOutput: OutPoint, since: Num, cellOutput?: CellOutput | undefined, outputData?: Hex | undefined);
    /**
     * Clone a CellInput.
     *
     * @returns A cloned CellInput instance.
     *
     * @example
     * ```typescript
     * const cellInput1 = cellInput0.clone();
     * ```
     */
    clone(): CellInput;
    /**
     * Creates a CellInput instance from a CellInputLike object.
     *
     * @param cellInput - A CellInputLike object or an instance of CellInput.
     * @returns A CellInput instance.
     *
     * @example
     * ```typescript
     * const cellInput = CellInput.from({
     *   previousOutput: { txHash: "0x...", index: 0 },
     *   since: 0n
     * });
     * ```
     */
    static from(cellInput: CellInputLike): CellInput;
    /**
     * Complete extra infos in the input. Like the output of the out point.
     * The instance will be modified.
     *
     * @returns true if succeed.
     * @example
     * ```typescript
     * await cellInput.completeExtraInfos();
     * ```
     */
    completeExtraInfos(client: Client): Promise<void>;
    /**
     * Converts the CellInput instance to molecule data format.
     *
     * @returns An object representing the cell input in molecule data format.
     */
    _toMolData(): {
        previousOutput: {
            txHash: Bytes;
            index: Bytes;
        };
        since: Bytes;
    };
    /**
     * Converts the CellInput instance to bytes.
     *
     * @returns A Uint8Array containing the cell input bytes.
     *
     * @example
     * ```typescript
     * const cellInputBytes = cellInput.toBytes();
     * ```
     */
    toBytes(): Bytes;
    /**
     * Creates a CellInput instance from a byte-like value or molecule CellInput.
     *
     * @param bytes - The byte-like value or molecule CellInput to convert.
     * @returns A CellInput instance.
     *
     * @example
     * ```typescript
     * const cellInput = CellInput.fromBytes(new Uint8Array([/* cell input bytes *\/]));
     * ```
     */
    static fromBytes(bytes: BytesLike | mol.CellInput): CellInput;
}
/**
 * @public
 */
export type CellDepLike = {
    outPoint: OutPointLike;
    depType: DepTypeLike;
};
/**
 * @public
 */
export declare class CellDep {
    outPoint: OutPoint;
    depType: DepType;
    /**
     * Creates an instance of CellDep.
     *
     * @param outPoint - The outpoint of the cell dependency.
     * @param depType - The dependency type.
     */
    constructor(outPoint: OutPoint, depType: DepType);
    /**
     * Clone a CellDep.
     *
     * @returns A cloned CellDep instance.
     *
     * @example
     * ```typescript
     * const cellDep1 = cellDep0.clone();
     * ```
     */
    clone(): CellDep;
    /**
     * Creates a CellDep instance from a CellDepLike object.
     *
     * @param cellDep - A CellDepLike object or an instance of CellDep.
     * @returns A CellDep instance.
     *
     * @example
     * ```typescript
     * const cellDep = CellDep.from({
     *   outPoint: { txHash: "0x...", index: 0 },
     *   depType: "depGroup"
     * });
     * ```
     */
    static from(cellDep: CellDepLike): CellDep;
    /**
     * Converts the CellDep instance to molecule data format.
     *
     * @returns An object representing the cell dependency in molecule data format.
     */
    _toMolData(): {
        outPoint: {
            txHash: Bytes;
            index: Bytes;
        };
        depType: Bytes;
    };
    /**
     * Converts the CellDep instance to bytes.
     *
     * @returns A Uint8Array containing the cell dependency bytes.
     *
     * @example
     * ```typescript
     * const cellDepBytes = cellDep.toBytes();
     * ```
     */
    toBytes(): Bytes;
    /**
     * Creates a CellDep instance from a byte-like value or molecule CellDep.
     *
     * @param bytes - The byte-like value or molecule CellDep to convert.
     * @returns A CellDep instance.
     *
     * @example
     * ```typescript
     * const cellDep = CellDep.fromBytes(new Uint8Array([/* cell dep bytes *\/]));
     * ```
     */
    fromBytes(bytes: BytesLike | mol.CellDep): CellDep;
    /**
     * Compares the current CellDep instance with another CellDepLike object for equality.
     *
     * @param val - The CellDepLike object to compare with.
     * @returns True if the cell deps are equal, otherwise false.
     *
     * @example
     * ```typescript
     * const isEqual = cellDep.eq(anotherCellDep);
     * ```
     */
    eq(val: CellDepLike): boolean;
}
/**
 * @public
 */
export type WitnessArgsLike = {
    lock?: HexLike | null;
    inputType?: HexLike | null;
    outputType?: HexLike | null;
};
/**
 * @public
 */
export declare class WitnessArgs {
    lock?: Hex | undefined;
    inputType?: Hex | undefined;
    outputType?: Hex | undefined;
    /**
     * Creates an instance of WitnessArgs.
     *
     * @param lock - The optional lock field of the witness.
     * @param inputType - The optional input type field of the witness.
     * @param outputType - The optional output type field of the witness.
     */
    constructor(lock?: Hex | undefined, inputType?: Hex | undefined, outputType?: Hex | undefined);
    /**
     * Creates a WitnessArgs instance from a WitnessArgsLike object.
     *
     * @param witnessArgs - A WitnessArgsLike object or an instance of WitnessArgs.
     * @returns A WitnessArgs instance.
     *
     * @example
     * ```typescript
     * const witnessArgs = WitnessArgs.from({
     *   lock: "0x...",
     *   inputType: "0x...",
     *   outputType: "0x..."
     * });
     * ```
     */
    static from(witnessArgs: WitnessArgsLike): WitnessArgs;
    /**
     * Converts the WitnessArgs instance to molecule data format.
     *
     * @returns An object representing the witness arguments in molecule data format.
     */
    _toMolData(): {
        lock: Bytes | undefined;
        inputType: Bytes | undefined;
        outputType: Bytes | undefined;
    };
    /**
     * Converts the WitnessArgs instance to bytes.
     *
     * @returns A Uint8Array containing the witness arguments bytes.
     *
     * @example
     * ```typescript
     * const witnessArgsBytes = witnessArgs.toBytes();
     * ```
     */
    toBytes(): Bytes;
    /**
     * Creates a WitnessArgs instance from a byte-like value or molecule WitnessArgs.
     *
     * @param bytes - The byte-like value or molecule WitnessArgs to convert.
     * @returns A WitnessArgs instance.
     *
     * @example
     * ```typescript
     * const witnessArgs = WitnessArgs.fromBytes(new Uint8Array([/* witness args bytes *\/]));
     * ```
     */
    static fromBytes(bytes: BytesLike | mol.WitnessArgs): WitnessArgs;
}
/**
 * @public
 */
export declare function udtBalanceFrom(dataLike: BytesLike): Num;
/**
 * @public
 */
export type TransactionLike = {
    version?: NumLike | null;
    cellDeps?: CellDepLike[] | null;
    headerDeps?: HexLike[] | null;
    inputs?: CellInputLike[] | null;
    outputs?: (Omit<CellOutputLike, "capacity"> & Partial<Pick<CellOutputLike, "capacity">>)[] | null;
    outputsData?: HexLike[] | null;
    witnesses?: HexLike[] | null;
};
/**
 * @public
 */
export declare class Transaction {
    version: Num;
    cellDeps: CellDep[];
    headerDeps: Hex[];
    inputs: CellInput[];
    outputs: CellOutput[];
    outputsData: Hex[];
    witnesses: Hex[];
    /**
     * Creates an instance of Transaction.
     *
     * @param version - The version of the transaction.
     * @param cellDeps - The cell dependencies of the transaction.
     * @param headerDeps - The header dependencies of the transaction.
     * @param inputs - The inputs of the transaction.
     * @param outputs - The outputs of the transaction.
     * @param outputsData - The data associated with the outputs.
     * @param witnesses - The witnesses of the transaction.
     */
    constructor(version: Num, cellDeps: CellDep[], headerDeps: Hex[], inputs: CellInput[], outputs: CellOutput[], outputsData: Hex[], witnesses: Hex[]);
    /**
     * Creates a default Transaction instance with empty fields.
     *
     * @returns A default Transaction instance.
     *
     * @example
     * ```typescript
     * const defaultTx = Transaction.default();
     * ```
     */
    static default(): Transaction;
    /**
     * Copy every properties from another transaction.
     *
     * @example
     * ```typescript
     * this.copy(Transaction.default());
     * ```
     */
    copy(txLike: TransactionLike): void;
    /**
     * Clone a Transaction.
     *
     * @returns A cloned instance
     *
     * @example
     * ```typescript
     * const tx1 = tx0.clone();
     * ```
     */
    clone(): Transaction;
    /**
     * Creates a Transaction instance from a TransactionLike object.
     *
     * @param tx - A TransactionLike object or an instance of Transaction.
     * @returns A Transaction instance.
     *
     * @example
     * ```typescript
     * const transaction = Transaction.from({
     *   version: 0,
     *   cellDeps: [],
     *   headerDeps: [],
     *   inputs: [],
     *   outputs: [],
     *   outputsData: [],
     *   witnesses: []
     * });
     * ```
     */
    static from(tx: TransactionLike): Transaction;
    /**
     * Creates a Transaction instance from a Lumos skeleton.
     *
     * @param skeleton - The Lumos transaction skeleton.
     * @returns A Transaction instance.
     *
     * @throws Will throw an error if an input's outPoint is missing.
     *
     * @example
     * ```typescript
     * const transaction = Transaction.fromLumosSkeleton(skeleton);
     * ```
     */
    static fromLumosSkeleton(skeleton: LumosTransactionSkeletonType): Transaction;
    stringify(): string;
    /**
     * Converts the raw transaction data to bytes.
     *
     * @returns A Uint8Array containing the raw transaction bytes.
     *
     * @example
     * ```typescript
     * const rawTxBytes = transaction.rawToBytes();
     * ```
     */
    rawToBytes(): Bytes;
    /**
     * Converts the whole transaction data to bytes.
     *
     * @returns A Uint8Array containing the full transaction bytes.
     *
     * @example
     * ```typescript
     * const txBytes = transaction.toBytes();
     * ```
     */
    toBytes(): Bytes;
    /**
     * Calculates the hash of the transaction.
     *
     * @returns The hash of the transaction.
     *
     * @example
     * ```typescript
     * const txHash = transaction.hash();
     * ```
     */
    hash(): Hex;
    /**
     * Hashes a witness and updates the hasher.
     *
     * @param witness - The witness to hash.
     * @param hasher - The hasher instance to update.
     *
     * @example
     * ```typescript
     * Transaction.hashWitnessToHasher("0x...", hasher);
     * ```
     */
    static hashWitnessToHasher(witness: HexLike, hasher: Hasher): void;
    /**
     * Computes the signing hash information for a given script.
     *
     * @param scriptLike - The script associated with the transaction, represented as a ScriptLike object.
     * @param client - The client for complete extra infos in the transaction.
     * @returns A promise that resolves to an object containing the signing message and the witness position,
     *          or undefined if no matching input is found.
     *
     * @example
     * ```typescript
     * const signHashInfo = await tx.getSignHashInfo(scriptLike, client);
     * if (signHashInfo) {
     *   console.log(signHashInfo.message); // Outputs the signing message
     *   console.log(signHashInfo.position); // Outputs the witness position
     * }
     * ```
     */
    getSignHashInfo(scriptLike: ScriptLike, client: Client, hasher?: Hasher): Promise<{
        message: Hex;
        position: number;
    } | undefined>;
    /**
     * Find the first occurrence of a input with the specified lock id
     *
     * @param scriptIdLike - The script associated with the transaction, represented as a ScriptLike object without args.
     * @param client - The client for complete extra infos in the transaction.
     * @returns A promise that resolves to the found index
     *
     * @example
     * ```typescript
     * const index = await tx.findInputIndexByLockId(scriptIdLike, client);
     * ```
     */
    findInputIndexByLockId(scriptIdLike: Pick<ScriptLike, "codeHash" | "hashType">, client: Client): Promise<number | undefined>;
    /**
     * Find the first occurrence of a input with the specified lock
     *
     * @param scriptLike - The script associated with the transaction, represented as a ScriptLike object.
     * @param client - The client for complete extra infos in the transaction.
     * @returns A promise that resolves to the prepared transaction
     *
     * @example
     * ```typescript
     * const index = await tx.findInputIndexByLock(scriptLike, client);
     * ```
     */
    findInputIndexByLock(scriptLike: ScriptLike, client: Client): Promise<number | undefined>;
    /**
     * Find the last occurrence of a input with the specified lock
     *
     * @param scriptLike - The script associated with the transaction, represented as a ScriptLike object.
     * @param client - The client for complete extra infos in the transaction.
     * @returns A promise that resolves to the prepared transaction
     *
     * @example
     * ```typescript
     * const index = await tx.findLastInputIndexByLock(scriptLike, client);
     * ```
     */
    findLastInputIndexByLock(scriptLike: ScriptLike, client: Client): Promise<number | undefined>;
    /**
     * Add cell deps if they are not existed
     *
     * @param cellDepLikes - The cell deps to add
     *
     * @example
     * ```typescript
     * tx.addCellDeps(cellDep);
     * ```
     */
    addCellDeps(...cellDepLikes: (CellDepLike | CellDepLike[])[]): void;
    /**
     * Add cell deps at the start if they are not existed
     *
     * @param cellDepLikes - The cell deps to add
     *
     * @example
     * ```typescript
     * tx.addCellDepsAtBegin(cellDep);
     * ```
     */
    addCellDepsAtStart(...cellDepLikes: (CellDepLike | CellDepLike[])[]): void;
    /**
     * Add cell dep from infos if they are not existed
     *
     * @param client - A client for searching cell deps
     * @param cellDepInfoLikes - The cell dep infos to add
     *
     * @example
     * ```typescript
     * tx.addCellDepInfos(client, cellDepInfos);
     * ```
     */
    addCellDepInfos(client: Client, ...cellDepInfoLikes: (CellDepInfoLike | CellDepInfoLike[])[]): Promise<void>;
    /**
     * Add cell deps from known script
     *
     * @param client - The client for searching known script and cell deps
     * @param scripts - The known scripts to add
     *
     * @example
     * ```typescript
     * tx.addCellDepsOfKnownScripts(client, KnownScript.OmniLock);
     * ```
     */
    addCellDepsOfKnownScripts(client: Client, ...scripts: (KnownScript | KnownScript[])[]): Promise<void>;
    /**
     * Set output data at index.
     *
     * @param index - The index of the output data.
     * @param witness - The data to set.
     *
     * @example
     * ```typescript
     * await tx.setOutputDataAt(0, "0x00");
     * ```
     */
    setOutputDataAt(index: number, witness: HexLike): void;
    /**
     * Add output
     *
     * @param outputLike - The cell output to add
     * @param outputData - optional output data
     *
     * @example
     * ```typescript
     * await tx.addOutput(cellOutput, "0xabcd");
     * ```
     */
    addOutput(outputLike: Omit<CellOutputLike, "capacity"> & Partial<Pick<CellOutputLike, "capacity">>, outputData?: HexLike): void;
    /**
     * Get witness at index as WitnessArgs
     *
     * @param index - The index of the witness.
     * @returns The witness parsed as WitnessArgs.
     *
     * @example
     * ```typescript
     * const witnessArgs = await tx.getWitnessArgsAt(0);
     * ```
     */
    getWitnessArgsAt(index: number): WitnessArgs | undefined;
    /**
     * Set witness at index by WitnessArgs
     *
     * @param index - The index of the witness.
     * @param witness - The WitnessArgs to set.
     *
     * @example
     * ```typescript
     * await tx.setWitnessArgsAt(0, witnessArgs);
     * ```
     */
    setWitnessArgsAt(index: number, witness: WitnessArgs): void;
    /**
     * Prepare dummy witness for sighash all method
     *
     * @param scriptLike - The script associated with the transaction, represented as a ScriptLike object.
     * @param lockLen - The length of dummy lock bytes.
     * @param client - The client for complete extra infos in the transaction.
     * @returns A promise that resolves to the prepared transaction
     *
     * @example
     * ```typescript
     * await tx.prepareSighashAllWitness(scriptLike, 85, client);
     * ```
     */
    prepareSighashAllWitness(scriptLike: ScriptLike, lockLen: number, client: Client): Promise<void>;
    getInputsCapacity(client: Client): Promise<Num>;
    getOutputsCapacity(): Num;
    getInputsUdtBalance(client: Client, type: ScriptLike): Promise<Num>;
    getOutputsUdtBalance(type: ScriptLike): Num;
    completeInputs<T>(from: Signer, filter: ClientCollectableSearchKeyFilterLike, accumulator: (acc: T, v: Cell, i: number, array: Cell[]) => Promise<T | undefined> | T | undefined, init: T): Promise<{
        addedCount: number;
        accumulated?: T;
    }>;
    completeInputsByCapacity(from: Signer, capacityTweak?: NumLike, filter?: ClientCollectableSearchKeyFilterLike): Promise<number>;
    completeInputsAll(from: Signer, filter?: ClientCollectableSearchKeyFilterLike): Promise<number>;
    completeInputsByUdt(from: Signer, type: ScriptLike): Promise<number>;
    estimateFee(feeRate: NumLike): Num;
    completeFee(from: Signer, change: (tx: Transaction, capacity: Num) => Promise<NumLike> | NumLike, expectedFeeRate?: NumLike, filter?: ClientCollectableSearchKeyFilterLike): Promise<[number, boolean]>;
    completeFeeChangeToLock(from: Signer, change: ScriptLike, feeRate?: NumLike, filter?: ClientCollectableSearchKeyFilterLike): Promise<[number, boolean]>;
    completeFeeBy(from: Signer, feeRate?: NumLike, filter?: ClientCollectableSearchKeyFilterLike): Promise<[number, boolean]>;
    completeFeeChangeToOutput(from: Signer, index: NumLike, feeRate?: NumLike, filter?: ClientCollectableSearchKeyFilterLike): Promise<[number, boolean]>;
}
//# sourceMappingURL=transaction.d.ts.map
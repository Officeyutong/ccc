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
exports.Transaction = exports.WitnessArgs = exports.CellDep = exports.CellInput = exports.Since = exports.Cell = exports.CellOutput = exports.OutPoint = void 0;
exports.depTypeFrom = depTypeFrom;
exports.depTypeToBytes = depTypeToBytes;
exports.depTypeFromBytes = depTypeFromBytes;
exports.epochFrom = epochFrom;
exports.epochFromHex = epochFromHex;
exports.epochToHex = epochToHex;
exports.udtBalanceFrom = udtBalanceFrom;
const index_js_1 = require("../bytes/index.js");
const index_js_2 = require("../fixedPoint/index.js");
const index_js_3 = require("../hasher/index.js");
const index_js_4 = require("../hex/index.js");
const index_js_5 = require("../num/index.js");
const index_js_6 = require("../utils/index.js");
const mol = __importStar(require("./molecule.advanced/index.js"));
const script_js_1 = require("./script.js");
const transaction_advanced_js_1 = require("./transaction.advanced.js");
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
function depTypeFrom(val) {
    const depType = (() => {
        if (typeof val === "number") {
            return transaction_advanced_js_1.NUM_TO_DEP_TYPE[val];
        }
        if (typeof val === "bigint") {
            return transaction_advanced_js_1.NUM_TO_DEP_TYPE[Number(val)];
        }
        return val;
    })();
    if (depType === undefined) {
        throw new Error(`Invalid dep type ${val}`);
    }
    return depType;
}
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
function depTypeToBytes(depType) {
    return (0, index_js_1.bytesFrom)([transaction_advanced_js_1.DEP_TYPE_TO_NUM[depTypeFrom(depType)]]);
}
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
function depTypeFromBytes(bytes) {
    return transaction_advanced_js_1.NUM_TO_DEP_TYPE[(0, index_js_1.bytesFrom)(bytes)[0]];
}
/**
 * @public
 */
class OutPoint {
    /**
     * Creates an instance of OutPoint.
     *
     * @param txHash - The transaction hash.
     * @param index - The index of the output in the transaction.
     */
    constructor(txHash, index) {
        this.txHash = txHash;
        this.index = index;
    }
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
    clone() {
        return new OutPoint(this.txHash, this.index);
    }
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
    static from(outPoint) {
        if (outPoint instanceof OutPoint) {
            return outPoint;
        }
        return new OutPoint((0, index_js_4.hexFrom)(outPoint.txHash), (0, index_js_5.numFrom)(outPoint.index));
    }
    /**
     * Converts the OutPoint instance to molecule data format.
     *
     * @returns An object representing the outpoint in molecule data format.
     */
    _toMolData() {
        return {
            txHash: (0, index_js_1.bytesFrom)(this.txHash),
            index: (0, index_js_5.numToBytes)(this.index, 4),
        };
    }
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
    toBytes() {
        return (0, index_js_1.bytesFrom)(mol.SerializeOutPoint(this._toMolData()));
    }
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
    static fromBytes(bytes) {
        const view = bytes instanceof mol.OutPoint
            ? bytes
            : new mol.OutPoint((0, index_js_1.bytesFrom)(bytes));
        return new OutPoint((0, index_js_4.hexFrom)(view.getTxHash().raw()), (0, index_js_5.numFromBytes)(view.getIndex().raw()));
    }
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
    eq(val) {
        const outPoint = OutPoint.from(val);
        return this.txHash === outPoint.txHash && this.index === outPoint.index;
    }
}
exports.OutPoint = OutPoint;
/**
 * @public
 */
class CellOutput {
    /**
     * Creates an instance of CellOutput.
     *
     * @param capacity - The capacity of the cell.
     * @param lock - The lock script of the cell.
     * @param type - The optional type script of the cell.
     */
    constructor(capacity, lock, type) {
        this.capacity = capacity;
        this.lock = lock;
        this.type = type;
    }
    get occupiedSize() {
        return 8 + this.lock.occupiedSize + (this.type?.occupiedSize ?? 0);
    }
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
    clone() {
        return new CellOutput(this.capacity, this.lock.clone(), this.type?.clone());
    }
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
    static from(cellOutput) {
        if (cellOutput instanceof CellOutput) {
            return cellOutput;
        }
        return new CellOutput((0, index_js_5.numFrom)(cellOutput.capacity), script_js_1.Script.from(cellOutput.lock), (0, index_js_6.apply)(script_js_1.Script.from, cellOutput.type));
    }
    /**
     * Converts the CellOutput instance to molecule data format.
     *
     * @returns An object representing the cell output in molecule data format.
     */
    _toMolData() {
        return {
            capacity: (0, index_js_5.numToBytes)(this.capacity, 8),
            lock: this.lock._toMolData(),
            type: this.type?._toMolData(),
        };
    }
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
    toBytes() {
        return (0, index_js_1.bytesFrom)(mol.SerializeCellOutput(this._toMolData()));
    }
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
    static fromBytes(bytes) {
        const view = bytes instanceof mol.CellOutput
            ? bytes
            : new mol.CellOutput((0, index_js_1.bytesFrom)(bytes));
        return new CellOutput((0, index_js_5.numFromBytes)(view.getCapacity().raw()), script_js_1.Script.fromBytes(view.getLock()), (0, index_js_6.apply)(script_js_1.Script.fromBytes, mol.molOptional(view.getType())));
    }
}
exports.CellOutput = CellOutput;
/**
 * @public
 */
class Cell {
    /**
     * Creates an instance of Cell.
     *
     * @param outPoint - The output point of the cell.
     * @param cellOutput - The cell output of the cell.
     * @param outputData - The output data of the cell.
     */
    constructor(outPoint, cellOutput, outputData) {
        this.outPoint = outPoint;
        this.cellOutput = cellOutput;
        this.outputData = outputData;
    }
    /**
     * Creates a Cell instance from a CellLike object.
     *
     * @param cell - A CellLike object or an instance of Cell.
     * @returns A Cell instance.
     */
    static from(cell) {
        if (cell instanceof Cell) {
            return cell;
        }
        return new Cell(OutPoint.from(cell.outPoint), CellOutput.from(cell.cellOutput), (0, index_js_4.hexFrom)(cell.outputData));
    }
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
    clone() {
        return new Cell(this.outPoint.clone(), this.cellOutput.clone(), this.outputData);
    }
}
exports.Cell = Cell;
/**
 * @public
 */
function epochFrom(epochLike) {
    return [(0, index_js_5.numFrom)(epochLike[0]), (0, index_js_5.numFrom)(epochLike[1]), (0, index_js_5.numFrom)(epochLike[2])];
}
/**
 * @public
 */
function epochFromHex(hex) {
    const bytes = (0, index_js_1.bytesFrom)((0, index_js_4.hexFrom)(hex));
    return [
        (0, index_js_5.numFrom)(bytes.slice(4, 7)),
        (0, index_js_5.numFrom)(bytes.slice(2, 4)),
        (0, index_js_5.numFrom)(bytes.slice(0, 2)),
    ];
}
/**
 * @public
 */
function epochToHex(epochLike) {
    const epoch = epochFrom(epochLike);
    return (0, index_js_4.hexFrom)((0, index_js_1.bytesConcat)((0, index_js_5.numBeToBytes)(epoch[2], 2), (0, index_js_5.numBeToBytes)(epoch[1], 2), (0, index_js_5.numBeToBytes)(epoch[0], 3)));
}
/**
 * @public
 */
class Since {
    /**
     * Creates an instance of Since.
     *
     * @param relative - Absolute or relative
     * @param metric - The metric of since
     * @param value - The value of since
     */
    constructor(relative, metric, value) {
        this.relative = relative;
        this.metric = metric;
        this.value = value;
    }
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
    clone() {
        return new Since(this.relative, this.metric, this.value);
    }
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
    static from(since) {
        if (since instanceof Since) {
            return since;
        }
        if (typeof since === "object" && "relative" in since) {
            return new Since(since.relative, since.metric, (0, index_js_5.numFrom)(since.value));
        }
        return Since.fromNum(since);
    }
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
    toNum() {
        return (this.value |
            (this.relative === "absolute" ? index_js_2.Zero : (0, index_js_5.numFrom)("0x8000000000000000")) |
            {
                blockNumber: (0, index_js_5.numFrom)("0x0000000000000000"),
                epoch: (0, index_js_5.numFrom)("0x2000000000000000"),
                timestamp: (0, index_js_5.numFrom)("0x4000000000000000"),
            }[this.metric]);
    }
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
    static fromNum(numLike) {
        const num = (0, index_js_5.numFrom)(numLike);
        const relative = num >> (0, index_js_5.numFrom)(63) === index_js_2.Zero ? "absolute" : "relative";
        const metric = ["blockNumber", "epoch", "timestamp"][Number((num >> (0, index_js_5.numFrom)(61)) & (0, index_js_5.numFrom)(3))];
        const value = num & (0, index_js_5.numFrom)("0x00ffffffffffffff");
        return new Since(relative, metric, value);
    }
}
exports.Since = Since;
/**
 * @public
 */
class CellInput {
    /**
     * Creates an instance of CellInput.
     *
     * @param previousOutput - The previous outpoint of the cell.
     * @param since - The since value of the cell input.
     * @param cellOutput - The optional cell output associated with the cell input.
     * @param outputData - The optional output data associated with the cell input.
     */
    constructor(previousOutput, since, cellOutput, outputData) {
        this.previousOutput = previousOutput;
        this.since = since;
        this.cellOutput = cellOutput;
        this.outputData = outputData;
    }
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
    clone() {
        return new CellInput(this.previousOutput.clone(), this.since, this.cellOutput?.clone(), this.outputData);
    }
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
    static from(cellInput) {
        if (cellInput instanceof CellInput) {
            return cellInput;
        }
        return new CellInput(OutPoint.from(cellInput.previousOutput), Since.from(cellInput.since ?? 0).toNum(), (0, index_js_6.apply)(CellOutput.from, cellInput.cellOutput), (0, index_js_6.apply)(index_js_4.hexFrom, cellInput.outputData));
    }
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
    async completeExtraInfos(client) {
        if (this.cellOutput && this.outputData) {
            return;
        }
        const cell = await client.getCell(this.previousOutput);
        if (!cell) {
            return;
        }
        this.cellOutput = cell.cellOutput;
        this.outputData = cell.outputData;
    }
    /**
     * Converts the CellInput instance to molecule data format.
     *
     * @returns An object representing the cell input in molecule data format.
     */
    _toMolData() {
        return {
            previousOutput: this.previousOutput._toMolData(),
            since: (0, index_js_5.numToBytes)(this.since, 8),
        };
    }
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
    toBytes() {
        return (0, index_js_1.bytesFrom)(mol.SerializeCellInput(this._toMolData()));
    }
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
    static fromBytes(bytes) {
        const view = bytes instanceof mol.CellInput
            ? bytes
            : new mol.CellInput((0, index_js_1.bytesFrom)(bytes));
        return new CellInput(OutPoint.fromBytes(view.getPreviousOutput()), (0, index_js_5.numFromBytes)(view.getSince().raw()));
    }
}
exports.CellInput = CellInput;
/**
 * @public
 */
class CellDep {
    /**
     * Creates an instance of CellDep.
     *
     * @param outPoint - The outpoint of the cell dependency.
     * @param depType - The dependency type.
     */
    constructor(outPoint, depType) {
        this.outPoint = outPoint;
        this.depType = depType;
    }
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
    clone() {
        return new CellDep(this.outPoint.clone(), this.depType);
    }
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
    static from(cellDep) {
        if (cellDep instanceof CellDep) {
            return cellDep;
        }
        return new CellDep(OutPoint.from(cellDep.outPoint), depTypeFrom(cellDep.depType));
    }
    /**
     * Converts the CellDep instance to molecule data format.
     *
     * @returns An object representing the cell dependency in molecule data format.
     */
    _toMolData() {
        return {
            outPoint: this.outPoint._toMolData(),
            depType: depTypeToBytes(this.depType),
        };
    }
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
    toBytes() {
        return (0, index_js_1.bytesFrom)(mol.SerializeCellDep(this._toMolData()));
    }
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
    fromBytes(bytes) {
        const view = bytes instanceof mol.CellDep ? bytes : new mol.CellDep((0, index_js_1.bytesFrom)(bytes));
        return new CellDep(OutPoint.fromBytes(view.getOutPoint()), depTypeFromBytes([view.getDepType()]));
    }
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
    eq(val) {
        const cellDep = CellDep.from(val);
        return (this.outPoint.eq(cellDep.outPoint) && this.depType === cellDep.depType);
    }
}
exports.CellDep = CellDep;
/**
 * @public
 */
class WitnessArgs {
    /**
     * Creates an instance of WitnessArgs.
     *
     * @param lock - The optional lock field of the witness.
     * @param inputType - The optional input type field of the witness.
     * @param outputType - The optional output type field of the witness.
     */
    constructor(lock, inputType, outputType) {
        this.lock = lock;
        this.inputType = inputType;
        this.outputType = outputType;
    }
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
    static from(witnessArgs) {
        if (witnessArgs instanceof WitnessArgs) {
            return witnessArgs;
        }
        return new WitnessArgs((0, index_js_6.apply)(index_js_4.hexFrom, witnessArgs.lock), (0, index_js_6.apply)(index_js_4.hexFrom, witnessArgs.inputType), (0, index_js_6.apply)(index_js_4.hexFrom, witnessArgs.outputType));
    }
    /**
     * Converts the WitnessArgs instance to molecule data format.
     *
     * @returns An object representing the witness arguments in molecule data format.
     */
    _toMolData() {
        return {
            lock: (0, index_js_6.apply)(index_js_1.bytesFrom, this.lock),
            inputType: (0, index_js_6.apply)(index_js_1.bytesFrom, this.inputType),
            outputType: (0, index_js_6.apply)(index_js_1.bytesFrom, this.outputType),
        };
    }
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
    toBytes() {
        return (0, index_js_1.bytesFrom)(mol.SerializeWitnessArgs(this._toMolData()));
    }
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
    static fromBytes(bytes) {
        const view = bytes instanceof mol.WitnessArgs
            ? bytes
            : new mol.WitnessArgs((0, index_js_1.bytesFrom)(bytes));
        return new WitnessArgs((0, index_js_6.apply)(index_js_4.hexFrom, mol.molOptional(view.getLock())?.raw()), (0, index_js_6.apply)(index_js_4.hexFrom, mol.molOptional(view.getInputType())?.raw()), (0, index_js_6.apply)(index_js_4.hexFrom, mol.molOptional(view.getOutputType())?.raw()));
    }
}
exports.WitnessArgs = WitnessArgs;
/**
 * @public
 */
function udtBalanceFrom(dataLike) {
    const data = (0, index_js_1.bytesFrom)(dataLike).slice(0, 16);
    if (data.length !== 16) {
        throw new Error("Invalid UDT cell data");
    }
    return (0, index_js_5.numFromBytes)(data);
}
/**
 * @public
 */
class Transaction {
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
    constructor(version, cellDeps, headerDeps, inputs, outputs, outputsData, witnesses) {
        this.version = version;
        this.cellDeps = cellDeps;
        this.headerDeps = headerDeps;
        this.inputs = inputs;
        this.outputs = outputs;
        this.outputsData = outputsData;
        this.witnesses = witnesses;
    }
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
    static default() {
        return new Transaction(0n, [], [], [], [], [], []);
    }
    /**
     * Copy every properties from another transaction.
     *
     * @example
     * ```typescript
     * this.copy(Transaction.default());
     * ```
     */
    copy(txLike) {
        const tx = Transaction.from(txLike);
        this.version = tx.version;
        this.cellDeps = tx.cellDeps;
        this.headerDeps = tx.headerDeps;
        this.inputs = tx.inputs;
        this.outputs = tx.outputs;
        this.outputsData = tx.outputsData;
        this.witnesses = tx.witnesses;
    }
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
    clone() {
        return new Transaction(0n, this.cellDeps.map((c) => c.clone()), [...this.headerDeps], this.inputs.map((i) => i.clone()), this.outputs.map((o) => o.clone()), [...this.outputsData], [...this.witnesses]);
    }
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
    static from(tx) {
        if (tx instanceof Transaction) {
            return tx;
        }
        const outputs = tx.outputs?.map((output, i) => {
            const o = CellOutput.from({
                ...output,
                capacity: output.capacity ?? 0,
            });
            if (o.capacity === index_js_2.Zero) {
                o.capacity = (0, index_js_2.fixedPointFrom)(o.occupiedSize +
                    ((0, index_js_6.apply)(index_js_1.bytesFrom, tx.outputsData?.[i])?.length ?? 0));
            }
            return o;
        }) ?? [];
        const outputsData = outputs.map((_, i) => (0, index_js_4.hexFrom)(tx.outputsData?.[i] ?? "0x"));
        if (tx.outputsData != null && outputsData.length < tx.outputsData.length) {
            outputsData.push(...tx.outputsData.slice(outputsData.length).map((d) => (0, index_js_4.hexFrom)(d)));
        }
        return new Transaction((0, index_js_5.numFrom)(tx.version ?? 0), tx.cellDeps?.map((cellDep) => CellDep.from(cellDep)) ?? [], tx.headerDeps?.map(index_js_4.hexFrom) ?? [], tx.inputs?.map((input) => CellInput.from(input)) ?? [], outputs, outputsData, tx.witnesses?.map(index_js_4.hexFrom) ?? []);
    }
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
    static fromLumosSkeleton(skeleton) {
        return Transaction.from({
            version: 0n,
            cellDeps: skeleton.cellDeps.toArray(),
            headerDeps: skeleton.headerDeps.toArray(),
            inputs: skeleton.inputs.toArray().map((input, i) => {
                if (!input.outPoint) {
                    throw new Error("outPoint is required in input");
                }
                return CellInput.from({
                    previousOutput: input.outPoint,
                    since: skeleton.inputSinces.get(i, "0x0"),
                    cellOutput: input.cellOutput,
                    outputData: input.data,
                });
            }),
            outputs: skeleton.outputs.toArray().map((output) => output.cellOutput),
            outputsData: skeleton.outputs.toArray().map((output) => output.data),
            witnesses: skeleton.witnesses.toArray(),
        });
    }
    stringify() {
        return JSON.stringify(this, (_, value) => {
            if (typeof value === "bigint") {
                return (0, index_js_5.numToHex)(value);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return value;
        });
    }
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
    rawToBytes() {
        return (0, index_js_1.bytesFrom)(mol.SerializeRawTransaction({
            version: (0, index_js_5.numToBytes)(this.version, 4),
            cellDeps: this.cellDeps.map((d) => d._toMolData()),
            headerDeps: this.headerDeps.map((header) => (0, index_js_1.bytesFrom)(header)),
            inputs: this.inputs.map((i) => i._toMolData()),
            outputs: this.outputs.map((o) => o._toMolData()),
            outputsData: this.outputsData.map((header) => (0, index_js_1.bytesFrom)(header)),
        }));
    }
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
    toBytes() {
        return (0, index_js_1.bytesFrom)(mol.SerializeTransaction({
            raw: {
                version: (0, index_js_5.numToBytes)(this.version, 4),
                cellDeps: this.cellDeps.map((d) => d._toMolData()),
                headerDeps: this.headerDeps.map((header) => (0, index_js_1.bytesFrom)(header)),
                inputs: this.inputs.map((i) => i._toMolData()),
                outputs: this.outputs.map((o) => o._toMolData()),
                outputsData: this.outputsData.map((header) => (0, index_js_1.bytesFrom)(header)),
            },
            witnesses: this.witnesses.map((witness) => (0, index_js_1.bytesFrom)(witness)),
        }));
    }
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
    hash() {
        return (0, index_js_3.hashCkb)(this.rawToBytes());
    }
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
    static hashWitnessToHasher(witness, hasher) {
        const raw = (0, index_js_1.bytesFrom)((0, index_js_4.hexFrom)(witness));
        hasher.update((0, index_js_5.numToBytes)(raw.length, 8));
        hasher.update(raw);
    }
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
    async getSignHashInfo(scriptLike, client, hasher = new index_js_3.HasherCkb()) {
        const script = script_js_1.Script.from(scriptLike);
        let position = -1;
        hasher.update(this.hash());
        for (let i = 0; i < this.witnesses.length; i += 1) {
            const input = this.inputs[i];
            if (input) {
                await input.completeExtraInfos(client);
                if (!input.cellOutput) {
                    throw new Error("Unable to complete input");
                }
                if (!script.eq(input.cellOutput.lock)) {
                    continue;
                }
                if (position === -1) {
                    position = i;
                }
            }
            if (position === -1) {
                return undefined;
            }
            Transaction.hashWitnessToHasher(this.witnesses[i], hasher);
        }
        if (position === -1) {
            return undefined;
        }
        return {
            message: hasher.digest(),
            position,
        };
    }
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
    async findInputIndexByLockId(scriptIdLike, client) {
        const script = script_js_1.Script.from({ ...scriptIdLike, args: "0x" });
        for (let i = 0; i < this.inputs.length; i += 1) {
            const input = this.inputs[i];
            await input.completeExtraInfos(client);
            if (!input.cellOutput) {
                throw new Error("Unable to complete input");
            }
            if (script.codeHash === input.cellOutput.lock.codeHash &&
                script.hashType === input.cellOutput.lock.hashType) {
                return i;
            }
        }
    }
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
    async findInputIndexByLock(scriptLike, client) {
        const script = script_js_1.Script.from(scriptLike);
        for (let i = 0; i < this.inputs.length; i += 1) {
            const input = this.inputs[i];
            await input.completeExtraInfos(client);
            if (!input.cellOutput) {
                throw new Error("Unable to complete input");
            }
            if (script.eq(input.cellOutput.lock)) {
                return i;
            }
        }
    }
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
    async findLastInputIndexByLock(scriptLike, client) {
        const script = script_js_1.Script.from(scriptLike);
        for (let i = this.inputs.length - 1; i >= 0; i -= 1) {
            const input = this.inputs[i];
            await input.completeExtraInfos(client);
            if (!input.cellOutput) {
                throw new Error("Unable to complete input");
            }
            if (script.eq(input.cellOutput.lock)) {
                return i;
            }
        }
    }
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
    addCellDeps(...cellDepLikes) {
        cellDepLikes.flat().forEach((cellDepLike) => {
            const cellDep = CellDep.from(cellDepLike);
            if (this.cellDeps.some((c) => c.eq(cellDep))) {
                return;
            }
            this.cellDeps.push(cellDep);
        });
    }
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
    addCellDepsAtStart(...cellDepLikes) {
        cellDepLikes.flat().forEach((cellDepLike) => {
            const cellDep = CellDep.from(cellDepLike);
            if (this.cellDeps.some((c) => c.eq(cellDep))) {
                return;
            }
            this.cellDeps.unshift(cellDep);
        });
    }
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
    async addCellDepInfos(client, ...cellDepInfoLikes) {
        this.addCellDeps(await client.getCellDeps(...cellDepInfoLikes));
    }
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
    async addCellDepsOfKnownScripts(client, ...scripts) {
        await Promise.all(scripts
            .flat()
            .map(async (script) => this.addCellDepInfos(client, (await client.getKnownScript(script)).cellDeps)));
    }
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
    setOutputDataAt(index, witness) {
        if (this.outputsData.length < index) {
            this.outputsData.push(...Array.from(new Array(index - this.outputsData.length), () => "0x"));
        }
        this.outputsData[index] = (0, index_js_4.hexFrom)(witness);
    }
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
    addOutput(outputLike, outputData = "0x") {
        const output = CellOutput.from({
            ...outputLike,
            capacity: outputLike.capacity ?? 0,
        });
        if (output.capacity === index_js_2.Zero) {
            output.capacity = (0, index_js_2.fixedPointFrom)(output.occupiedSize + (0, index_js_1.bytesFrom)(outputData).length);
        }
        const i = this.outputs.push(output) - 1;
        this.setOutputDataAt(i, outputData);
    }
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
    getWitnessArgsAt(index) {
        const rawWitness = this.witnesses[index];
        return (rawWitness ?? "0x") !== "0x"
            ? WitnessArgs.fromBytes(rawWitness)
            : undefined;
    }
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
    setWitnessArgsAt(index, witness) {
        if (this.witnesses.length < index) {
            this.witnesses.push(...Array.from(new Array(index - this.witnesses.length), () => "0x"));
        }
        this.witnesses[index] = (0, index_js_4.hexFrom)(witness.toBytes());
    }
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
    async prepareSighashAllWitness(scriptLike, lockLen, client) {
        const position = await this.findInputIndexByLock(scriptLike, client);
        if (position === undefined) {
            return;
        }
        const witness = this.getWitnessArgsAt(position) ?? WitnessArgs.from({});
        witness.lock = (0, index_js_4.hexFrom)(Array.from(new Array(lockLen), () => 0));
        this.setWitnessArgsAt(position, witness);
    }
    async getInputsCapacity(client) {
        return (0, index_js_6.reduceAsync)(this.inputs, async (acc, input) => {
            await input.completeExtraInfos(client);
            if (!input.cellOutput) {
                throw new Error("Unable to complete input");
            }
            return acc + input.cellOutput.capacity;
        }, (0, index_js_5.numFrom)(0));
    }
    getOutputsCapacity() {
        return this.outputs.reduce((acc, { capacity }) => acc + capacity, (0, index_js_5.numFrom)(0));
    }
    async getInputsUdtBalance(client, type) {
        return (0, index_js_6.reduceAsync)(this.inputs, async (acc, input) => {
            await input.completeExtraInfos(client);
            if (!input.cellOutput || !input.outputData) {
                throw new Error("Unable to complete input");
            }
            if (!input.cellOutput.type?.eq(type)) {
                return;
            }
            return acc + udtBalanceFrom(input.outputData);
        }, (0, index_js_5.numFrom)(0));
    }
    getOutputsUdtBalance(type) {
        return this.outputs.reduce((acc, output, i) => {
            if (!output.type?.eq(type)) {
                return acc;
            }
            return acc + udtBalanceFrom(this.outputsData[i]);
        }, (0, index_js_5.numFrom)(0));
    }
    async completeInputs(from, filter, accumulator, init) {
        const collectedCells = [];
        let acc = init;
        let fulfilled = false;
        for await (const cell of from.findCells(filter, true)) {
            if (this.inputs.some(({ previousOutput }) => previousOutput.eq(cell.outPoint))) {
                continue;
            }
            const i = collectedCells.push(cell);
            const next = await Promise.resolve(accumulator(acc, cell, i - 1, collectedCells));
            if (next === undefined) {
                fulfilled = true;
                break;
            }
            acc = next;
        }
        this.inputs.push(...collectedCells.map(({ outPoint, outputData, cellOutput }) => CellInput.from({
            previousOutput: outPoint,
            outputData,
            cellOutput,
        })));
        if (fulfilled) {
            return {
                addedCount: collectedCells.length,
            };
        }
        return {
            addedCount: collectedCells.length,
            accumulated: acc,
        };
    }
    async completeInputsByCapacity(from, capacityTweak, filter) {
        const exceptedCapacity = this.getOutputsCapacity() + (0, index_js_5.numFrom)(capacityTweak ?? 0);
        const inputsCapacity = await this.getInputsCapacity(from.client);
        if (inputsCapacity >= exceptedCapacity) {
            return 0;
        }
        const { addedCount, accumulated } = await this.completeInputs(from, filter ?? {
            scriptLenRange: [0, 1],
            outputDataLenRange: [0, 1],
        }, (acc, { cellOutput: { capacity } }) => {
            const sum = acc + capacity;
            return sum >= exceptedCapacity ? undefined : sum;
        }, inputsCapacity);
        if (accumulated === undefined) {
            return addedCount;
        }
        throw new Error(`Insufficient CKB, need ${(0, index_js_2.fixedPointToString)(exceptedCapacity - accumulated)} extra CKB`);
    }
    async completeInputsAll(from, filter) {
        const { addedCount } = await this.completeInputs(from, filter ?? {
            scriptLenRange: [0, 1],
            outputDataLenRange: [0, 1],
        }, (acc, { cellOutput: { capacity } }) => acc + capacity, index_js_2.Zero);
        return addedCount;
    }
    async completeInputsByUdt(from, type) {
        const exceptedBalance = this.getOutputsUdtBalance(type);
        const inputsBalance = await this.getInputsUdtBalance(from.client, type);
        if (inputsBalance >= exceptedBalance) {
            return 0;
        }
        const { addedCount, accumulated } = await this.completeInputs(from, {
            script: type,
            outputDataLenRange: [16, (0, index_js_5.numFrom)("0xffffffff")],
        }, (acc, { outputData }) => {
            const balance = udtBalanceFrom(outputData);
            const sum = acc + balance;
            return sum >= exceptedBalance ? undefined : sum;
        }, inputsBalance);
        if (accumulated === undefined) {
            return addedCount;
        }
        throw new Error(`Insufficient coin, need ${exceptedBalance - accumulated} extra coin`);
    }
    estimateFee(feeRate) {
        const txSize = this.toBytes().length + 4;
        return ((0, index_js_5.numFrom)(txSize) * (0, index_js_5.numFrom)(feeRate) + (0, index_js_5.numFrom)(1000)) / (0, index_js_5.numFrom)(1000);
    }
    async completeFee(from, change, expectedFeeRate, filter) {
        const feeRate = expectedFeeRate ?? (await from.client.getFeeRate());
        // Complete all inputs extra infos for cache
        await this.getInputsCapacity(from.client);
        let leastFee = index_js_2.Zero;
        let leastExtraCapacity = index_js_2.Zero;
        while (true) {
            const tx = this.clone();
            const collected = await (async () => {
                try {
                    return await tx.completeInputsByCapacity(from, leastFee + leastExtraCapacity, filter);
                }
                catch (err) {
                    if (leastExtraCapacity !== index_js_2.Zero) {
                        throw new Error("Not enough capacity for the change cell");
                    }
                    throw err;
                }
            })();
            await from.prepareTransaction(tx);
            if (leastFee === index_js_2.Zero) {
                // The initial fee is calculated based on prepared transaction
                leastFee = tx.estimateFee(feeRate);
            }
            const extraCapacity = (await tx.getInputsCapacity(from.client)) - tx.getOutputsCapacity();
            // The extra capacity paid the fee without a change
            if (extraCapacity === leastFee) {
                this.copy(tx);
                return [collected, false];
            }
            const needed = (0, index_js_5.numFrom)(await Promise.resolve(change(tx, extraCapacity - leastFee)));
            // No enough extra capacity to create new cells for change
            if (needed > index_js_2.Zero) {
                leastExtraCapacity = needed;
                continue;
            }
            if ((await tx.getInputsCapacity(from.client)) - tx.getOutputsCapacity() !==
                leastFee) {
                throw new Error("The change function doesn't use all available capacity");
            }
            // New change cells created, update the fee
            await from.prepareTransaction(tx);
            const changedFee = tx.estimateFee(feeRate);
            if (leastFee > changedFee) {
                throw new Error("The change function removed existed transaction data");
            }
            // The fee has been paid
            if (leastFee === changedFee) {
                this.copy(tx);
                return [collected, true];
            }
            // The fee after changing is more than the original fee
            leastFee = changedFee;
        }
    }
    completeFeeChangeToLock(from, change, feeRate, filter) {
        const script = script_js_1.Script.from(change);
        return this.completeFee(from, (tx, capacity) => {
            const changeCell = CellOutput.from({ capacity: 0, lock: script });
            const occupiedCapacity = (0, index_js_2.fixedPointFrom)(changeCell.occupiedSize);
            if (capacity < occupiedCapacity) {
                return occupiedCapacity;
            }
            changeCell.capacity = capacity;
            tx.addOutput(changeCell);
            return 0;
        }, feeRate, filter);
    }
    async completeFeeBy(from, feeRate, filter) {
        const { script } = await from.getRecommendedAddressObj();
        return this.completeFeeChangeToLock(from, script, feeRate, filter);
    }
    completeFeeChangeToOutput(from, index, feeRate, filter) {
        const change = Number((0, index_js_5.numFrom)(index));
        if (!this.outputs[change]) {
            throw new Error("Non-existed output to change");
        }
        return this.completeFee(from, (tx, capacity) => {
            tx.outputs[change].capacity += capacity;
            return 0;
        }, feeRate, filter);
    }
}
exports.Transaction = Transaction;

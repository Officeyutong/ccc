export function SerializeUint32(value: any): ArrayBuffer;
export function SerializeUint64(value: any): ArrayBuffer;
export function SerializeUint128(value: any): ArrayBuffer;
export function SerializeByte32(value: any): ArrayBuffer;
export function SerializeUint256(value: any): ArrayBuffer;
export function SerializeBytes(value: any): ArrayBuffer;
export function SerializeBytesOpt(value: any): ArrayBuffer;
export function SerializeBytesOptVec(value: any): ArrayBuffer;
export function SerializeBytesVec(value: any): ArrayBuffer;
export function SerializeByte32Vec(value: any): ArrayBuffer;
export function SerializeScriptOpt(value: any): ArrayBuffer;
export function SerializeProposalShortId(value: any): ArrayBuffer;
export function SerializeUncleBlockVec(value: any): ArrayBuffer;
export function SerializeTransactionVec(value: any): ArrayBuffer;
export function SerializeProposalShortIdVec(value: any): ArrayBuffer;
export function SerializeCellDepVec(value: any): ArrayBuffer;
export function SerializeCellInputVec(value: any): ArrayBuffer;
export function SerializeCellOutputVec(value: any): ArrayBuffer;
export function SerializeScript(value: any): ArrayBuffer;
export function SerializeOutPoint(value: any): ArrayBuffer;
export function SerializeCellInput(value: any): ArrayBuffer;
export function SerializeCellOutput(value: any): ArrayBuffer;
export function SerializeCellDep(value: any): ArrayBuffer;
export function SerializeRawTransaction(value: any): ArrayBuffer;
export function SerializeTransaction(value: any): ArrayBuffer;
export function SerializeRawHeader(value: any): ArrayBuffer;
export function SerializeHeader(value: any): ArrayBuffer;
export function SerializeUncleBlock(value: any): ArrayBuffer;
export function SerializeBlock(value: any): ArrayBuffer;
export function SerializeBlockV1(value: any): ArrayBuffer;
export function SerializeCellbaseWitness(value: any): ArrayBuffer;
export function SerializeWitnessArgs(value: any): ArrayBuffer;
export class Uint32 {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
    toBigEndianUint32(): number;
    toLittleEndianUint32(): number;
}
export class Uint64 {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
}
export class Uint128 {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
}
export class Byte32 {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
}
export class Uint256 {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
}
export class Bytes {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    raw(): ArrayBuffer;
    indexAt(i: any): number;
    length(): number;
}
export class BytesOpt {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    value(): Bytes;
    hasValue(): boolean;
}
export class BytesOptVec {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    length(): number;
    indexAt(i: any): BytesOpt;
}
export class BytesVec {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    length(): number;
    indexAt(i: any): Bytes;
}
export class Byte32Vec {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    indexAt(i: any): Byte32;
    length(): number;
}
export class ScriptOpt {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    value(): Script;
    hasValue(): boolean;
}
export class ProposalShortId {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    indexAt(i: any): number;
    raw(): ArrayBuffer;
}
export class UncleBlockVec {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    length(): number;
    indexAt(i: any): UncleBlock;
}
export class TransactionVec {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    length(): number;
    indexAt(i: any): Transaction;
}
export class ProposalShortIdVec {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    indexAt(i: any): ProposalShortId;
    length(): number;
}
export class CellDepVec {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    indexAt(i: any): CellDep;
    length(): number;
}
export class CellInputVec {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    indexAt(i: any): CellInput;
    length(): number;
}
export class CellOutputVec {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    length(): number;
    indexAt(i: any): CellOutput;
}
export class Script {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    getCodeHash(): Byte32;
    getHashType(): number;
    getArgs(): Bytes;
}
export class OutPoint {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    getTxHash(): Byte32;
    getIndex(): Uint32;
    validate(compatible?: boolean): void;
}
export class CellInput {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    getSince(): Uint64;
    getPreviousOutput(): OutPoint;
    validate(compatible?: boolean): void;
}
export class CellOutput {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    getCapacity(): Uint64;
    getLock(): Script;
    getType(): ScriptOpt;
}
export class CellDep {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    getOutPoint(): OutPoint;
    getDepType(): number;
    validate(compatible?: boolean): void;
}
export class RawTransaction {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    getVersion(): Uint32;
    getCellDeps(): CellDepVec;
    getHeaderDeps(): Byte32Vec;
    getInputs(): CellInputVec;
    getOutputs(): CellOutputVec;
    getOutputsData(): BytesVec;
}
export class Transaction {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    getRaw(): RawTransaction;
    getWitnesses(): BytesVec;
}
export class RawHeader {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    getVersion(): Uint32;
    getCompactTarget(): Uint32;
    getTimestamp(): Uint64;
    getNumber(): Uint64;
    getEpoch(): Uint64;
    getParentHash(): Byte32;
    getTransactionsRoot(): Byte32;
    getProposalsHash(): Byte32;
    getExtraHash(): Byte32;
    getDao(): Byte32;
    validate(compatible?: boolean): void;
}
export class Header {
    static size(): number;
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    getRaw(): RawHeader;
    getNonce(): Uint128;
    validate(compatible?: boolean): void;
}
export class UncleBlock {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    getHeader(): Header;
    getProposals(): ProposalShortIdVec;
}
export class Block {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    getHeader(): Header;
    getUncles(): UncleBlockVec;
    getTransactions(): TransactionVec;
    getProposals(): ProposalShortIdVec;
}
export class BlockV1 {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    getHeader(): Header;
    getUncles(): UncleBlockVec;
    getTransactions(): TransactionVec;
    getProposals(): ProposalShortIdVec;
    getExtension(): Bytes;
}
export class CellbaseWitness {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    getLock(): Script;
    getMessage(): Bytes;
}
export class WitnessArgs {
    constructor(reader: any, { validate }?: {
        validate?: boolean | undefined;
    });
    view: DataView<ArrayBuffer>;
    validate(compatible?: boolean): void;
    getLock(): BytesOpt;
    getInputType(): BytesOpt;
    getOutputType(): BytesOpt;
}
//# sourceMappingURL=generated.d.ts.map
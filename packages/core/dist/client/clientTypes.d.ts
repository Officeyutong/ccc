import { Cell, CellDep, CellDepLike, Epoch, HashType, HashTypeLike, OutPoint, OutPointLike, Script, ScriptLike, Transaction } from "../ckb/index.js";
import { Hex, HexLike } from "../hex/index.js";
import { Num, NumLike } from "../num/index.js";
import { ClientCollectableSearchKeyFilterLike, ClientCollectableSearchKeyLike } from "./clientTypes.advanced.js";
/**
 * @public
 */
export declare enum KnownScript {
    NervosDao = "NervosDao",
    Secp256k1Blake160 = "Secp256k1Blake160",
    Secp256k1Multisig = "Secp256k1Multisig",
    AnyoneCanPay = "AnyoneCanPay",
    TypeId = "TypeId",
    XUdt = "XUdt",
    JoyId = "JoyId",
    COTA = "COTA",
    PWLock = "PWLock",
    OmniLock = "OmniLock",
    NostrLock = "NostrLock",
    UniqueType = "UniqueType",
    AlwaysSuccess = "AlwaysSuccess",
    InputTypeProxyLock = "InputTypeProxyLock",
    OutputTypeProxyLock = "OutputTypeProxyLock",
    LockProxyLock = "LockProxyLock",
    SingleUseLock = "SingleUseLock",
    TypeBurnLock = "TypeBurnLock",
    EasyToDiscoverType = "EasyToDiscoverType",
    TimeLock = "TimeLock"
}
/**
 * @public
 */
export type CellDepInfoLike = {
    cellDep: CellDepLike;
    type?: ScriptLike | null;
};
/**
 * @public
 */
export declare class CellDepInfo {
    cellDep: CellDep;
    type?: Script | undefined;
    constructor(cellDep: CellDep, type?: Script | undefined);
    static from(cellDepInfoLike: CellDepInfoLike): CellDepInfo;
}
/**
 * @public
 */
export type ScriptInfoLike = {
    codeHash: HexLike;
    hashType: HashTypeLike;
    cellDeps: CellDepInfoLike[];
};
/**
 * @public
 */
export declare class ScriptInfo {
    codeHash: Hex;
    hashType: HashType;
    cellDeps: CellDepInfo[];
    constructor(codeHash: Hex, hashType: HashType, cellDeps: CellDepInfo[]);
    static from(scriptInfoLike: ScriptInfoLike): ScriptInfo;
}
/**
 * @public
 */
export type OutputsValidator = "passthrough" | "well_known_scripts_only";
/**
 * @public
 */
export type TransactionStatus = "sent" | "pending" | "proposed" | "committed" | "unknown" | "rejected";
/**
 * @public
 */
export type ClientTransactionResponse = {
    transaction: Transaction;
    status: TransactionStatus;
    cycles?: Num;
    blockHash?: Hex;
    blockNumber?: Num;
    txIndex?: Num;
    reason?: string;
};
/**
 * @public
 */
export type ClientIndexerSearchKeyFilterLike = ClientCollectableSearchKeyFilterLike & {
    blockRange?: [NumLike, NumLike] | null;
};
/**
 * @public
 */
export declare class ClientIndexerSearchKeyFilter {
    script: Script | undefined;
    scriptLenRange: [Num, Num] | undefined;
    outputData: Hex | undefined;
    outputDataSearchMode: "prefix" | "exact" | "partial" | undefined;
    outputDataLenRange: [Num, Num] | undefined;
    outputCapacityRange: [Num, Num] | undefined;
    blockRange: [Num, Num] | undefined;
    constructor(script: Script | undefined, scriptLenRange: [Num, Num] | undefined, outputData: Hex | undefined, outputDataSearchMode: "prefix" | "exact" | "partial" | undefined, outputDataLenRange: [Num, Num] | undefined, outputCapacityRange: [Num, Num] | undefined, blockRange: [Num, Num] | undefined);
    static from(filterLike: ClientIndexerSearchKeyFilterLike): ClientIndexerSearchKeyFilter;
}
/**
 * @public
 */
export type ClientIndexerSearchKeyLike = ClientCollectableSearchKeyLike & {
    filter?: ClientIndexerSearchKeyFilterLike | null;
};
/**
 * @public
 */
export declare class ClientIndexerSearchKey {
    script: Script;
    scriptType: "lock" | "type";
    scriptSearchMode: "prefix" | "exact" | "partial";
    filter: ClientIndexerSearchKeyFilter | undefined;
    withData: boolean | undefined;
    constructor(script: Script, scriptType: "lock" | "type", scriptSearchMode: "prefix" | "exact" | "partial", filter: ClientIndexerSearchKeyFilter | undefined, withData: boolean | undefined);
    static from(keyLike: ClientIndexerSearchKeyLike): ClientIndexerSearchKey;
}
/**
 * @public
 */
export type ClientFindCellsResponse = {
    lastCursor: string;
    cells: Cell[];
};
/**
 * @public
 */
export type ClientIndexerSearchKeyTransactionLike = Omit<ClientCollectableSearchKeyLike, "withData"> & {
    filter?: ClientIndexerSearchKeyFilterLike | null;
    groupByTransaction?: boolean | null;
};
/**
 * @public
 */
export declare class ClientIndexerSearchKeyTransaction {
    script: Script;
    scriptType: "lock" | "type";
    scriptSearchMode: "prefix" | "exact" | "partial";
    filter: ClientIndexerSearchKeyFilter | undefined;
    groupByTransaction: boolean | undefined;
    constructor(script: Script, scriptType: "lock" | "type", scriptSearchMode: "prefix" | "exact" | "partial", filter: ClientIndexerSearchKeyFilter | undefined, groupByTransaction: boolean | undefined);
    static from(keyLike: ClientIndexerSearchKeyTransactionLike): ClientIndexerSearchKeyTransaction;
}
/**
 * @public
 */
export type ClientFindTransactionsResponse = {
    lastCursor: string;
    transactions: {
        txHash: Hex;
        blockNumber: Num;
        txIndex: Num;
        isInput: boolean;
        cellIndex: Num;
    }[];
};
/**
 * @public
 */
export type ClientFindTransactionsGroupedResponse = {
    lastCursor: string;
    transactions: {
        txHash: Hex;
        blockNumber: Num;
        txIndex: Num;
        cells: {
            isInput: boolean;
            cellIndex: Num;
        }[];
    }[];
};
/**
 * @public
 */
export type ClientBlockHeader = {
    compactTarget: Num;
    dao: {
        /**
         * C_i: the total issuance up to and including block i.
         */
        c: Num;
        /**
         * AR_i: the current accumulated rate at block i.
         * AR_j / AR_i reflects the CKByte amount if one deposit 1 CKB to Nervos DAO at block i, and withdraw at block j.
         */
        ar: Num;
        /**
         * S_i: the total unissued secondary issuance up to and including block i,
         * including unclaimed Nervos DAO compensation and treasury funds.
         */
        s: Num;
        /**
         * U_i: the total occupied capacities currently in the blockchain up to and including block i.
         * Occupied capacity is the sum of capacities used to store all cells.
         */
        u: Num;
    };
    epoch: Epoch;
    extraHash: Hex;
    hash: Hex;
    nonce: Num;
    number: Num;
    parentHash: Hex;
    proposalsHash: Hex;
    timestamp: Num;
    transactionsRoot: Hex;
    version: Num;
};
/**
 * @public
 */
export type ClientBlockUncle = {
    header: ClientBlockHeader;
    proposals: Hex[];
};
/**
 * @public
 */
export type ClientBlock = {
    header: ClientBlockHeader;
    proposals: Hex[];
    transactions: Transaction[];
    uncles: ClientBlockUncle[];
};
export interface ErrorClientBaseLike {
    message?: string;
    code?: number;
    data: string;
}
export declare class ErrorClientBase extends Error {
    readonly code?: number;
    readonly data: string;
    constructor(origin: ErrorClientBaseLike);
}
export declare class ErrorClientResolveUnknown extends ErrorClientBase {
    readonly outPoint: OutPoint;
    constructor(origin: ErrorClientBaseLike, outPointLike: OutPointLike);
}
export declare class ErrorClientVerification extends ErrorClientBase {
    readonly source: "lock" | "inputType" | "outputType";
    readonly errorCode: number;
    readonly scriptHashType: "data" | "type";
    readonly sourceIndex: Num;
    readonly scriptCodeHash: Hex;
    constructor(origin: ErrorClientBaseLike, source: "lock" | "inputType" | "outputType", sourceIndex: NumLike, errorCode: number, scriptHashType: "data" | "type", scriptCodeHash: HexLike);
}
export declare class ErrorClientDuplicatedTransaction extends ErrorClientBase {
    readonly txHash: Hex;
    constructor(origin: ErrorClientBaseLike, txHash: HexLike);
}
export declare class ErrorClientRBFRejected extends ErrorClientBase {
    readonly currentFee: Num;
    readonly leastFee: Num;
    constructor(origin: ErrorClientBaseLike, currentFee: NumLike, leastFee: NumLike);
}
export declare class ErrorClientWaitTransactionTimeout extends Error {
    constructor();
}
//# sourceMappingURL=clientTypes.d.ts.map
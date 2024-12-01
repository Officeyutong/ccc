import { CellDep, CellDepLike, CellInput, CellInputLike, CellOutput, CellOutputLike, DepType, DepTypeLike, HashType, HashTypeLike, OutPoint, OutPointLike, Script, ScriptLike, Transaction, TransactionLike } from "../../ckb/index.js";
import { Hex, HexLike } from "../../hex/index.js";
import { NumLike } from "../../num/index.js";
import { ClientBlock, ClientBlockHeader, ClientBlockUncle, ClientFindCellsResponse, ClientFindTransactionsGroupedResponse, ClientFindTransactionsResponse, ClientIndexerSearchKeyFilter, ClientIndexerSearchKeyLike, ClientIndexerSearchKeyTransactionLike, ClientTransactionResponse, TransactionStatus } from "../clientTypes.js";
import { JsonRpcBlock, JsonRpcBlockHeader, JsonRpcBlockUncle, JsonRpcCellDep, JsonRpcCellInput, JsonRpcCellOutput, JsonRpcDepType, JsonRpcHashType, JsonRpcIndexerFindTransactionsGroupedResponse, JsonRpcIndexerFindTransactionsResponse, JsonRpcIndexerSearchKey, JsonRpcIndexerSearchKeyFilter, JsonRpcIndexerSearchKeyTransaction, JsonRpcOutPoint, JsonRpcScript, JsonRpcTransaction } from "./types.js";
export declare class JsonRpcTransformers {
    static hashTypeFrom(hashType: HashTypeLike): JsonRpcHashType;
    static hashTypeTo(hashType: JsonRpcHashType): HashType;
    static depTypeFrom(depType: DepTypeLike): JsonRpcDepType;
    static depTypeTo(depType: JsonRpcDepType): DepType;
    static scriptFrom(scriptLike: ScriptLike): JsonRpcScript;
    static scriptTo(script: JsonRpcScript): Script;
    static outPointFrom(outPointLike: OutPointLike): JsonRpcOutPoint;
    static outPointTo(outPoint: JsonRpcOutPoint): OutPoint;
    static cellInputFrom(cellInputLike: CellInputLike): JsonRpcCellInput;
    static cellInputTo(cellInput: JsonRpcCellInput): CellInput;
    static cellOutputFrom(cellOutput: CellOutputLike): JsonRpcCellOutput;
    static cellOutputTo(cellOutput: JsonRpcCellOutput): CellOutput;
    static cellDepFrom(cellDep: CellDepLike): JsonRpcCellDep;
    static cellDepTo(cellDep: JsonRpcCellDep): CellDep;
    static transactionFrom(txLike: TransactionLike): JsonRpcTransaction;
    static transactionTo(tx: JsonRpcTransaction): Transaction;
    static transactionResponseTo({ cycles, tx_status: { status, block_number, block_hash, tx_index, reason }, transaction, }: {
        cycles?: NumLike;
        tx_status: {
            status: TransactionStatus;
            block_hash?: HexLike;
            tx_index?: NumLike;
            block_number?: NumLike;
            reason?: string;
        };
        transaction: JsonRpcTransaction | null;
    }): ClientTransactionResponse | undefined;
    static blockHeaderTo(header: JsonRpcBlockHeader): ClientBlockHeader;
    static blockUncleTo(block: JsonRpcBlockUncle): ClientBlockUncle;
    static blockTo(block: JsonRpcBlock): ClientBlock;
    static rangeFrom([a, b]: [NumLike, NumLike]): [Hex, Hex];
    static indexerSearchKeyFilterFrom(filter: ClientIndexerSearchKeyFilter): JsonRpcIndexerSearchKeyFilter;
    static indexerSearchKeyFrom(keyLike: ClientIndexerSearchKeyLike): JsonRpcIndexerSearchKey;
    static findCellsResponseTo({ last_cursor, objects, }: {
        last_cursor: string;
        objects: {
            out_point: JsonRpcOutPoint;
            output: JsonRpcCellOutput;
            output_data?: Hex;
        }[];
    }): ClientFindCellsResponse;
    static indexerSearchKeyTransactionFrom(keyLike: ClientIndexerSearchKeyTransactionLike): JsonRpcIndexerSearchKeyTransaction;
    static findTransactionsResponseTo({ last_cursor, objects, }: JsonRpcIndexerFindTransactionsResponse | JsonRpcIndexerFindTransactionsGroupedResponse): ClientFindTransactionsResponse | ClientFindTransactionsGroupedResponse;
}
//# sourceMappingURL=transformers.d.ts.map
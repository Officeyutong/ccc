import { Cell, CellDep, OutPointLike, ScriptLike, TransactionLike } from "../ckb/index.js";
import { Hex, HexLike } from "../hex/index.js";
import { Num, NumLike } from "../num/index.js";
import { ClientCache } from "./cache/index.js";
import { ClientCollectableSearchKeyLike } from "./clientTypes.advanced.js";
import { CellDepInfoLike, ClientBlock, ClientBlockHeader, ClientFindCellsResponse, ClientFindTransactionsGroupedResponse, ClientFindTransactionsResponse, ClientIndexerSearchKeyLike, ClientIndexerSearchKeyTransactionLike, ClientTransactionResponse, KnownScript, OutputsValidator, ScriptInfo } from "./clientTypes.js";
/**
 * @public
 */
export declare abstract class Client {
    cache: ClientCache;
    constructor(config?: {
        cache?: ClientCache;
    });
    abstract get url(): string;
    abstract get addressPrefix(): string;
    abstract getKnownScript(script: KnownScript): Promise<ScriptInfo>;
    abstract getFeeRateStatistics(blockRange?: NumLike): Promise<{
        mean: Num;
        median: Num;
    }>;
    getFeeRate(blockRange?: NumLike): Promise<Num>;
    abstract getTip(): Promise<Num>;
    abstract getTipHeader(verbosity?: number | null): Promise<ClientBlockHeader>;
    abstract getBlockByNumber(blockNumber: NumLike, verbosity?: number | null, withCycles?: boolean | null): Promise<ClientBlock | undefined>;
    abstract getBlockByHash(blockHash: HexLike, verbosity?: number | null, withCycles?: boolean | null): Promise<ClientBlock | undefined>;
    abstract getHeaderByNumber(blockNumber: NumLike, verbosity?: number | null): Promise<ClientBlockHeader | undefined>;
    abstract getHeaderByHash(blockHash: HexLike, verbosity?: number | null): Promise<ClientBlockHeader | undefined>;
    abstract estimateCycles(transaction: TransactionLike): Promise<Num>;
    abstract sendTransactionDry(transaction: TransactionLike, validator?: OutputsValidator): Promise<Num>;
    abstract sendTransactionNoCache(transaction: TransactionLike, validator?: OutputsValidator): Promise<Hex>;
    abstract getTransactionNoCache(txHash: HexLike): Promise<ClientTransactionResponse | undefined>;
    getCell(outPointLike: OutPointLike): Promise<Cell | undefined>;
    abstract getCellLiveNoCache(outPointLike: OutPointLike, withData?: boolean | null, includeTxPool?: boolean | null): Promise<Cell | undefined>;
    getCellLive(outPointLike: OutPointLike, withData?: boolean | null, includeTxPool?: boolean | null): Promise<Cell | undefined>;
    abstract findCellsPagedNoCache(key: ClientIndexerSearchKeyLike, order?: "asc" | "desc", limit?: NumLike, after?: string): Promise<ClientFindCellsResponse>;
    findCellsPaged(key: ClientIndexerSearchKeyLike, order?: "asc" | "desc", limit?: NumLike, after?: string): Promise<ClientFindCellsResponse>;
    findCellsOnChain(key: ClientIndexerSearchKeyLike, order?: "asc" | "desc", limit?: number): AsyncGenerator<Cell>;
    /**
     * Find cells by search key designed for collectable cells.
     *
     * @param keyLike - The search key.
     * @returns A async generator for yielding cells.
     */
    findCells(keyLike: ClientCollectableSearchKeyLike, order?: "asc" | "desc", limit?: number): AsyncGenerator<Cell>;
    findCellsByLock(lock: ScriptLike, type?: ScriptLike | null, withData?: boolean, order?: "asc" | "desc", limit?: number): AsyncGenerator<Cell>;
    findCellsByType(type: ScriptLike, withData?: boolean, order?: "asc" | "desc", limit?: number): AsyncGenerator<Cell>;
    findSingletonCellByType(type: ScriptLike, withData?: boolean): Promise<Cell | undefined>;
    getCellDeps(...cellDepsInfoLike: (CellDepInfoLike | CellDepInfoLike[])[]): Promise<CellDep[]>;
    abstract findTransactionsPaged(key: Omit<ClientIndexerSearchKeyTransactionLike, "groupByTransaction"> & {
        groupByTransaction: true;
    }, order?: "asc" | "desc", limit?: NumLike, after?: string): Promise<ClientFindTransactionsGroupedResponse>;
    abstract findTransactionsPaged(key: Omit<ClientIndexerSearchKeyTransactionLike, "groupByTransaction"> & {
        groupByTransaction?: false | null;
    }, order?: "asc" | "desc", limit?: NumLike, after?: string): Promise<ClientFindTransactionsResponse>;
    abstract findTransactionsPaged(key: ClientIndexerSearchKeyTransactionLike, order?: "asc" | "desc", limit?: NumLike, after?: string): Promise<ClientFindTransactionsResponse | ClientFindTransactionsGroupedResponse>;
    findTransactions(key: Omit<ClientIndexerSearchKeyTransactionLike, "groupByTransaction"> & {
        groupByTransaction: true;
    }, order?: "asc" | "desc", limit?: number): AsyncGenerator<ClientFindTransactionsGroupedResponse["transactions"][0]>;
    findTransactions(key: Omit<ClientIndexerSearchKeyTransactionLike, "groupByTransaction"> & {
        groupByTransaction?: false | null;
    }, order?: "asc" | "desc", limit?: number): AsyncGenerator<ClientFindTransactionsResponse["transactions"][0]>;
    findTransactions(key: ClientIndexerSearchKeyTransactionLike, order?: "asc" | "desc", limit?: number): AsyncGenerator<ClientFindTransactionsResponse["transactions"][0] | ClientFindTransactionsGroupedResponse["transactions"][0]>;
    findTransactionsByLock(lock: ScriptLike, type: ScriptLike | undefined | null, groupByTransaction: true, order?: "asc" | "desc", limit?: number): AsyncGenerator<ClientFindTransactionsGroupedResponse["transactions"][0]>;
    findTransactionsByLock(lock: ScriptLike, type?: ScriptLike | null, groupByTransaction?: false | null, order?: "asc" | "desc", limit?: number): AsyncGenerator<ClientFindTransactionsResponse["transactions"][0]>;
    findTransactionsByLock(lock: ScriptLike, type?: ScriptLike | null, groupByTransaction?: boolean | null, order?: "asc" | "desc", limit?: number): AsyncGenerator<ClientFindTransactionsResponse["transactions"][0] | ClientFindTransactionsGroupedResponse["transactions"][0]>;
    findTransactionsByType(type: ScriptLike, groupByTransaction: true, order?: "asc" | "desc", limit?: number): AsyncGenerator<ClientFindTransactionsGroupedResponse["transactions"][0]>;
    findTransactionsByType(type: ScriptLike, groupByTransaction?: false | null, order?: "asc" | "desc", limit?: number): AsyncGenerator<ClientFindTransactionsResponse["transactions"][0]>;
    findTransactionsByType(type: ScriptLike, groupByTransaction?: boolean | null, order?: "asc" | "desc", limit?: number): AsyncGenerator<ClientFindTransactionsResponse["transactions"][0] | ClientFindTransactionsGroupedResponse["transactions"][0]>;
    abstract getCellsCapacity(key: ClientIndexerSearchKeyLike): Promise<Num>;
    getBalanceSingle(lock: ScriptLike): Promise<Num>;
    getBalance(locks: ScriptLike[]): Promise<Num>;
    sendTransaction(transaction: TransactionLike, validator?: OutputsValidator): Promise<Hex>;
    getTransaction(txHashLike: HexLike): Promise<ClientTransactionResponse | undefined>;
    waitTransaction(txHash: HexLike, confirmations?: number, timeout?: number, interval?: number): Promise<ClientTransactionResponse | undefined>;
}
//# sourceMappingURL=client.d.ts.map
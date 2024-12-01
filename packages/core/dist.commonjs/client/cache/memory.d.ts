import { Cell, CellLike, OutPointLike, Transaction, TransactionLike } from "../../ckb/index.js";
import { HexLike } from "../../hex/index.js";
import { ClientCollectableSearchKeyLike } from "../clientTypes.advanced.js";
import { ClientCache } from "./cache.js";
export declare class ClientCacheMemory extends ClientCache {
    /**
     * OutPoint => [isLive, Cell | OutPoint]
     */
    private readonly cells;
    /**
     * TX Hash => Transaction
     */
    private readonly knownTransactions;
    markUsable(...cellLikes: (CellLike | CellLike[])[]): Promise<void>;
    markUnusable(...outPointLikes: (OutPointLike | OutPointLike[])[]): Promise<void>;
    clear(): Promise<void>;
    findCells(keyLike: ClientCollectableSearchKeyLike): AsyncGenerator<Cell>;
    getCell(outPointLike: OutPointLike): Promise<Cell | undefined>;
    isUnusable(outPointLike: OutPointLike): Promise<boolean>;
    recordTransactions(...transactions: (TransactionLike | TransactionLike[])[]): Promise<void>;
    getTransaction(txHashLike: HexLike): Promise<Transaction | undefined>;
    recordCells(...cells: (CellLike | CellLike[])[]): Promise<void>;
}
//# sourceMappingURL=memory.d.ts.map
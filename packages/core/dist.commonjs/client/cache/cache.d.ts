import { Cell, CellLike, OutPointLike, Transaction, TransactionLike } from "../../ckb/index.js";
import { HexLike } from "../../hex/index.js";
import { ClientCollectableSearchKeyLike } from "../clientTypes.advanced.js";
export declare abstract class ClientCache {
    abstract markUsable(...cellLikes: (CellLike | CellLike[])[]): Promise<void>;
    abstract markUnusable(...outPointLike: (OutPointLike | OutPointLike[])[]): Promise<void>;
    markTransactions(...transactionLike: (TransactionLike | TransactionLike[])[]): Promise<void>;
    abstract clear(): Promise<void>;
    abstract findCells(filter: ClientCollectableSearchKeyLike): AsyncGenerator<Cell>;
    /**
     * Get a known cell by out point
     * @param _outPoint
     */
    abstract getCell(_outPoint: OutPointLike): Promise<Cell | undefined>;
    abstract isUnusable(outPointLike: OutPointLike): Promise<boolean>;
    /**
     * Record known transactions
     * Implement this method to enable transactions query caching
     * @param _transactions
     */
    recordTransactions(..._transactions: (TransactionLike | TransactionLike[])[]): Promise<void>;
    /**
     * Get a known transaction by hash
     * Implement this method to enable transactions query caching
     * @param _txHash
     */
    getTransaction(_txHash: HexLike): Promise<Transaction | undefined>;
    /**
     * Record known cells
     * Implement this method to enable cells query caching
     * @param _cells
     */
    recordCells(..._cells: (CellLike | CellLike[])[]): Promise<void>;
}
//# sourceMappingURL=cache.d.ts.map
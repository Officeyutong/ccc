import { Cell, OutPoint, Transaction, } from "../../ckb/index.js";
import { hexFrom } from "../../hex/index.js";
import { ClientCache } from "./cache.js";
import { filterCell } from "./memory.advanced.js";
export class ClientCacheMemory extends ClientCache {
    constructor() {
        super(...arguments);
        /**
         * OutPoint => [isLive, Cell | OutPoint]
         */
        this.cells = new Map();
        /**
         * TX Hash => Transaction
         */
        this.knownTransactions = new Map();
    }
    async markUsable(...cellLikes) {
        cellLikes.flat().forEach((cellLike) => {
            const cell = Cell.from(cellLike).clone();
            const outPointStr = hexFrom(cell.outPoint.toBytes());
            this.cells.set(outPointStr, [true, cell]);
        });
    }
    async markUnusable(...outPointLikes) {
        outPointLikes.flat().forEach((outPointLike) => {
            const outPoint = OutPoint.from(outPointLike);
            const outPointStr = hexFrom(outPoint.toBytes());
            const existed = this.cells.get(outPointStr);
            if (existed) {
                existed[0] = false;
                return;
            }
            this.cells.set(outPointStr, [false, { outPoint }]);
        });
    }
    async clear() {
        for (const val of this.cells.values()) {
            val[0] = undefined;
        }
    }
    async *findCells(keyLike) {
        for (const [isLive, cell] of this.cells.values()) {
            if (!isLive) {
                continue;
            }
            if (!filterCell(keyLike, cell)) {
                continue;
            }
            yield cell.clone();
        }
    }
    async getCell(outPointLike) {
        const outPoint = OutPoint.from(outPointLike);
        const cell = this.cells.get(hexFrom(outPoint.toBytes()))?.[1];
        if (cell && cell.cellOutput && cell.outputData) {
            return Cell.from(cell.clone());
        }
    }
    async isUnusable(outPointLike) {
        const outPoint = OutPoint.from(outPointLike);
        return !(this.cells.get(hexFrom(outPoint.toBytes()))?.[0] ?? true);
    }
    async recordTransactions(...transactions) {
        transactions.flat().map((txLike) => {
            const tx = Transaction.from(txLike);
            this.knownTransactions.set(tx.hash(), tx);
        });
    }
    async getTransaction(txHashLike) {
        const txHash = hexFrom(txHashLike);
        return this.knownTransactions.get(txHash)?.clone();
    }
    async recordCells(...cells) {
        cells.flat().map((cellLike) => {
            const cell = Cell.from(cellLike);
            const outPointStr = hexFrom(cell.outPoint.toBytes());
            if (this.cells.get(outPointStr)) {
                return;
            }
            this.cells.set(outPointStr, [undefined, cell]);
        });
    }
}

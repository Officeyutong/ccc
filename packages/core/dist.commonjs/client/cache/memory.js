"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCacheMemory = void 0;
const index_js_1 = require("../../ckb/index.js");
const index_js_2 = require("../../hex/index.js");
const cache_js_1 = require("./cache.js");
const memory_advanced_js_1 = require("./memory.advanced.js");
class ClientCacheMemory extends cache_js_1.ClientCache {
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
            const cell = index_js_1.Cell.from(cellLike).clone();
            const outPointStr = (0, index_js_2.hexFrom)(cell.outPoint.toBytes());
            this.cells.set(outPointStr, [true, cell]);
        });
    }
    async markUnusable(...outPointLikes) {
        outPointLikes.flat().forEach((outPointLike) => {
            const outPoint = index_js_1.OutPoint.from(outPointLike);
            const outPointStr = (0, index_js_2.hexFrom)(outPoint.toBytes());
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
            if (!(0, memory_advanced_js_1.filterCell)(keyLike, cell)) {
                continue;
            }
            yield cell.clone();
        }
    }
    async getCell(outPointLike) {
        const outPoint = index_js_1.OutPoint.from(outPointLike);
        const cell = this.cells.get((0, index_js_2.hexFrom)(outPoint.toBytes()))?.[1];
        if (cell && cell.cellOutput && cell.outputData) {
            return index_js_1.Cell.from(cell.clone());
        }
    }
    async isUnusable(outPointLike) {
        const outPoint = index_js_1.OutPoint.from(outPointLike);
        return !(this.cells.get((0, index_js_2.hexFrom)(outPoint.toBytes()))?.[0] ?? true);
    }
    async recordTransactions(...transactions) {
        transactions.flat().map((txLike) => {
            const tx = index_js_1.Transaction.from(txLike);
            this.knownTransactions.set(tx.hash(), tx);
        });
    }
    async getTransaction(txHashLike) {
        const txHash = (0, index_js_2.hexFrom)(txHashLike);
        return this.knownTransactions.get(txHash)?.clone();
    }
    async recordCells(...cells) {
        cells.flat().map((cellLike) => {
            const cell = index_js_1.Cell.from(cellLike);
            const outPointStr = (0, index_js_2.hexFrom)(cell.outPoint.toBytes());
            if (this.cells.get(outPointStr)) {
                return;
            }
            this.cells.set(outPointStr, [undefined, cell]);
        });
    }
}
exports.ClientCacheMemory = ClientCacheMemory;

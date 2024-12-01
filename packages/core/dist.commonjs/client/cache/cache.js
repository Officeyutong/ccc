"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCache = void 0;
const index_js_1 = require("../../ckb/index.js");
class ClientCache {
    async markTransactions(...transactionLike) {
        await Promise.all([
            this.recordTransactions(...transactionLike),
            ...transactionLike.flat().map((transactionLike) => {
                const tx = index_js_1.Transaction.from(transactionLike);
                const txHash = tx.hash();
                return Promise.all([
                    ...tx.inputs.map((i) => this.markUnusable(i.previousOutput)),
                    ...tx.outputs.map((o, i) => this.markUsable({
                        cellOutput: o,
                        outputData: tx.outputsData[i],
                        outPoint: {
                            txHash,
                            index: i,
                        },
                    })),
                ]);
            }),
        ]);
    }
    /**
     * Record known transactions
     * Implement this method to enable transactions query caching
     * @param _transactions
     */
    async recordTransactions(..._transactions) { }
    /**
     * Get a known transaction by hash
     * Implement this method to enable transactions query caching
     * @param _txHash
     */
    async getTransaction(_txHash) {
        return;
    }
    /**
     * Record known cells
     * Implement this method to enable cells query caching
     * @param _cells
     */
    async recordCells(..._cells) { }
}
exports.ClientCache = ClientCache;

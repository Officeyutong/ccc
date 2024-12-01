"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const index_js_1 = require("../ckb/index.js");
const index_js_2 = require("../fixedPoint/index.js");
const index_js_3 = require("../hex/index.js");
const index_js_4 = require("../num/index.js");
const index_js_5 = require("../utils/index.js");
const memory_js_1 = require("./cache/memory.js");
const clientTypes_js_1 = require("./clientTypes.js");
/**
 * @public
 */
class Client {
    constructor(config) {
        this.cache = config?.cache ?? new memory_js_1.ClientCacheMemory();
    }
    async getFeeRate(blockRange) {
        return (0, index_js_4.numMax)((await this.getFeeRateStatistics(blockRange)).median, 1000);
    }
    async getCell(outPointLike) {
        const outPoint = index_js_1.OutPoint.from(outPointLike);
        const cached = await this.cache.getCell(outPoint);
        if (cached) {
            return cached;
        }
        const transaction = await this.getTransactionNoCache(outPoint.txHash);
        if (!transaction) {
            return;
        }
        const index = Number((0, index_js_4.numFrom)(outPoint.index));
        if (index >= transaction.transaction.outputs.length) {
            return;
        }
        const cell = index_js_1.Cell.from({
            outPoint,
            cellOutput: transaction.transaction.outputs[index],
            outputData: transaction.transaction.outputsData[index] ?? "0x",
        });
        await this.cache.recordCells(cell);
        return cell;
    }
    async getCellLive(outPointLike, withData, includeTxPool) {
        const cell = await this.getCellLiveNoCache(outPointLike, withData, includeTxPool);
        if (withData && cell) {
            await this.cache.recordCells(cell);
        }
        return cell;
    }
    async findCellsPaged(key, order, limit, after) {
        const res = await this.findCellsPagedNoCache(key, order, limit, after);
        await this.cache.recordCells(res.cells);
        return res;
    }
    async *findCellsOnChain(key, order, limit = 10) {
        let last = undefined;
        while (true) {
            const { cells, lastCursor } = await this.findCellsPaged(key, order, limit, last);
            for (const cell of cells) {
                yield cell;
            }
            if (cells.length === 0 || cells.length < limit) {
                return;
            }
            last = lastCursor;
        }
    }
    /**
     * Find cells by search key designed for collectable cells.
     *
     * @param keyLike - The search key.
     * @returns A async generator for yielding cells.
     */
    async *findCells(keyLike, order, limit = 10) {
        const key = clientTypes_js_1.ClientIndexerSearchKey.from(keyLike);
        const foundedOutPoints = [];
        for await (const cell of this.cache.findCells(key)) {
            foundedOutPoints.push(cell.outPoint);
            yield cell;
        }
        for await (const cell of this.findCellsOnChain(key, order, limit)) {
            if ((await this.cache.isUnusable(cell.outPoint)) ||
                foundedOutPoints.some((founded) => founded.eq(cell.outPoint))) {
                continue;
            }
            yield cell;
        }
    }
    findCellsByLock(lock, type, withData = true, order, limit = 10) {
        return this.findCells({
            script: lock,
            scriptType: "lock",
            scriptSearchMode: "exact",
            filter: {
                script: type,
            },
            withData,
        }, order, limit);
    }
    findCellsByType(type, withData = true, order, limit = 10) {
        return this.findCells({
            script: type,
            scriptType: "type",
            scriptSearchMode: "exact",
            withData,
        }, order, limit);
    }
    async findSingletonCellByType(type, withData = false) {
        for await (const cell of this.findCellsByType(type, withData, undefined, 1)) {
            return cell;
        }
    }
    async getCellDeps(...cellDepsInfoLike) {
        return Promise.all(cellDepsInfoLike.flat().map(async (infoLike) => {
            const { cellDep, type } = clientTypes_js_1.CellDepInfo.from(infoLike);
            if (type === undefined) {
                return cellDep;
            }
            const found = await this.findSingletonCellByType(type);
            if (!found) {
                return cellDep;
            }
            return index_js_1.CellDep.from({
                outPoint: found.outPoint,
                depType: cellDep.depType,
            });
        }));
    }
    async *findTransactions(key, order, limit = 10) {
        let last = undefined;
        while (true) {
            const { transactions, lastCursor, } = await this.findTransactionsPaged(key, order, limit, last);
            for (const tx of transactions) {
                yield tx;
            }
            if (transactions.length === 0 || transactions.length < limit) {
                return;
            }
            last = lastCursor;
        }
    }
    findTransactionsByLock(lock, type, groupByTransaction, order, limit = 10) {
        return this.findTransactions({
            script: lock,
            scriptType: "lock",
            scriptSearchMode: "exact",
            filter: {
                script: type,
            },
            groupByTransaction,
        }, order, limit);
    }
    findTransactionsByType(type, groupByTransaction, order, limit = 10) {
        return this.findTransactions({
            script: type,
            scriptType: "type",
            scriptSearchMode: "exact",
            groupByTransaction,
        }, order, limit);
    }
    async getBalanceSingle(lock) {
        return this.getCellsCapacity({
            script: lock,
            scriptType: "lock",
            scriptSearchMode: "exact",
            filter: {
                scriptLenRange: [0, 1],
                outputDataLenRange: [0, 1],
            },
        });
    }
    async getBalance(locks) {
        return (0, index_js_5.reduceAsync)(locks, async (acc, lock) => acc + (await this.getBalanceSingle(lock)), index_js_2.Zero);
    }
    async sendTransaction(transaction, validator) {
        const tx = index_js_1.Transaction.from(transaction);
        const txHash = await this.sendTransactionNoCache(tx, validator);
        await this.cache.recordTransactions(tx);
        await this.cache.markTransactions(tx);
        return txHash;
    }
    async getTransaction(txHashLike) {
        const txHash = (0, index_js_3.hexFrom)(txHashLike);
        const res = await this.getTransactionNoCache(txHash);
        if (res?.transaction) {
            return res;
        }
        const tx = await this.cache.getTransaction(txHash);
        if (!tx) {
            return;
        }
        if (!res) {
            return {
                transaction: tx,
                status: "sent",
            };
        }
        return {
            ...res,
            transaction: tx,
        };
    }
    async waitTransaction(txHash, confirmations = 0, timeout = 30000, interval = 2000) {
        const startTime = Date.now();
        let tx;
        const getTx = async () => {
            const res = await this.getTransaction(txHash);
            if (!res ||
                res.blockNumber == null ||
                ["sent", "pending", "proposed"].includes(res.status)) {
                return undefined;
            }
            tx = res;
            return res;
        };
        while (true) {
            if (!tx) {
                if (await getTx()) {
                    continue;
                }
            }
            else if (confirmations === 0) {
                return tx;
            }
            else if ((await this.getTipHeader()).number - tx.blockNumber >=
                confirmations) {
                return tx;
            }
            if (Date.now() - startTime + interval >= timeout) {
                throw new clientTypes_js_1.ErrorClientWaitTransactionTimeout();
            }
            await (0, index_js_5.sleep)(interval);
        }
    }
}
exports.Client = Client;

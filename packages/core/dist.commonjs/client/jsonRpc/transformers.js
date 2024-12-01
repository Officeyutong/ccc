"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcTransformers = void 0;
const index_js_1 = require("../../bytes/index.js");
const index_js_2 = require("../../ckb/index.js");
const index_js_3 = require("../../hex/index.js");
const index_js_4 = require("../../num/index.js");
const index_js_5 = require("../../utils/index.js");
const clientTypes_js_1 = require("../clientTypes.js");
class JsonRpcTransformers {
    static hashTypeFrom(hashType) {
        return (0, index_js_2.hashTypeFrom)(hashType);
    }
    static hashTypeTo(hashType) {
        return hashType;
    }
    static depTypeFrom(depType) {
        switch ((0, index_js_2.depTypeFrom)(depType)) {
            case "code":
                return "code";
            case "depGroup":
                return "dep_group";
        }
    }
    static depTypeTo(depType) {
        switch (depType) {
            case "code":
                return "code";
            case "dep_group":
                return "depGroup";
        }
    }
    static scriptFrom(scriptLike) {
        const script = index_js_2.Script.from(scriptLike);
        return {
            code_hash: script.codeHash,
            hash_type: JsonRpcTransformers.hashTypeFrom(script.hashType),
            args: script.args,
        };
    }
    static scriptTo(script) {
        return index_js_2.Script.from({
            codeHash: script.code_hash,
            hashType: JsonRpcTransformers.hashTypeTo(script.hash_type),
            args: script.args,
        });
    }
    static outPointFrom(outPointLike) {
        const outPoint = index_js_2.OutPoint.from(outPointLike);
        return {
            index: (0, index_js_4.numToHex)(outPoint.index),
            tx_hash: outPoint.txHash,
        };
    }
    static outPointTo(outPoint) {
        return index_js_2.OutPoint.from({
            index: outPoint.index,
            txHash: outPoint.tx_hash,
        });
    }
    static cellInputFrom(cellInputLike) {
        const cellInput = index_js_2.CellInput.from(cellInputLike);
        return {
            previous_output: JsonRpcTransformers.outPointFrom(cellInput.previousOutput),
            since: (0, index_js_4.numToHex)(cellInput.since),
        };
    }
    static cellInputTo(cellInput) {
        return index_js_2.CellInput.from({
            previousOutput: JsonRpcTransformers.outPointTo(cellInput.previous_output),
            since: cellInput.since,
        });
    }
    static cellOutputFrom(cellOutput) {
        return {
            capacity: (0, index_js_4.numToHex)(cellOutput.capacity),
            lock: JsonRpcTransformers.scriptFrom(cellOutput.lock),
            type: (0, index_js_5.apply)(JsonRpcTransformers.scriptFrom, cellOutput.type),
        };
    }
    static cellOutputTo(cellOutput) {
        return index_js_2.CellOutput.from({
            capacity: cellOutput.capacity,
            lock: JsonRpcTransformers.scriptTo(cellOutput.lock),
            type: (0, index_js_5.apply)(JsonRpcTransformers.scriptTo, cellOutput.type),
        });
    }
    static cellDepFrom(cellDep) {
        return {
            out_point: JsonRpcTransformers.outPointFrom(cellDep.outPoint),
            dep_type: JsonRpcTransformers.depTypeFrom(cellDep.depType),
        };
    }
    static cellDepTo(cellDep) {
        return index_js_2.CellDep.from({
            outPoint: JsonRpcTransformers.outPointTo(cellDep.out_point),
            depType: JsonRpcTransformers.depTypeTo(cellDep.dep_type),
        });
    }
    static transactionFrom(txLike) {
        const tx = index_js_2.Transaction.from(txLike);
        return {
            version: (0, index_js_4.numToHex)(tx.version),
            cell_deps: tx.cellDeps.map((c) => JsonRpcTransformers.cellDepFrom(c)),
            header_deps: tx.headerDeps,
            inputs: tx.inputs.map((i) => JsonRpcTransformers.cellInputFrom(i)),
            outputs: tx.outputs.map((o) => JsonRpcTransformers.cellOutputFrom(o)),
            outputs_data: tx.outputsData,
            witnesses: tx.witnesses,
        };
    }
    static transactionTo(tx) {
        return index_js_2.Transaction.from({
            version: tx.version,
            cellDeps: tx.cell_deps.map((c) => JsonRpcTransformers.cellDepTo(c)),
            headerDeps: tx.header_deps,
            inputs: tx.inputs.map((i) => JsonRpcTransformers.cellInputTo(i)),
            outputs: tx.outputs.map((o) => JsonRpcTransformers.cellOutputTo(o)),
            outputsData: tx.outputs_data,
            witnesses: tx.witnesses,
        });
    }
    static transactionResponseTo({ cycles, tx_status: { status, block_number, block_hash, tx_index, reason }, transaction, }) {
        if (transaction == null) {
            return;
        }
        return {
            transaction: JsonRpcTransformers.transactionTo(transaction),
            status,
            cycles: (0, index_js_5.apply)(index_js_4.numFrom, cycles),
            blockHash: (0, index_js_5.apply)(index_js_3.hexFrom, block_hash),
            blockNumber: (0, index_js_5.apply)(index_js_4.numFrom, block_number),
            txIndex: (0, index_js_5.apply)(index_js_4.numFrom, tx_index),
            reason,
        };
    }
    static blockHeaderTo(header) {
        const dao = (0, index_js_1.bytesFrom)(header.dao);
        return {
            compactTarget: (0, index_js_4.numFrom)(header.compact_target),
            dao: {
                c: (0, index_js_4.numLeFromBytes)(dao.slice(0, 8)),
                ar: (0, index_js_4.numLeFromBytes)(dao.slice(8, 16)),
                s: (0, index_js_4.numLeFromBytes)(dao.slice(16, 24)),
                u: (0, index_js_4.numLeFromBytes)(dao.slice(24, 32)),
            },
            epoch: (0, index_js_2.epochFromHex)(header.epoch),
            extraHash: header.extra_hash,
            hash: header.hash,
            nonce: (0, index_js_4.numFrom)(header.nonce),
            number: (0, index_js_4.numFrom)(header.number),
            parentHash: header.parent_hash,
            proposalsHash: header.proposals_hash,
            timestamp: (0, index_js_4.numFrom)(header.timestamp),
            transactionsRoot: header.transactions_root,
            version: (0, index_js_4.numFrom)(header.version),
        };
    }
    static blockUncleTo(block) {
        return {
            header: JsonRpcTransformers.blockHeaderTo(block.header),
            proposals: block.proposals,
        };
    }
    static blockTo(block) {
        return {
            header: JsonRpcTransformers.blockHeaderTo(block.header),
            proposals: block.proposals,
            transactions: block.transactions.map((t) => JsonRpcTransformers.transactionTo(t)),
            uncles: block.uncles.map((u) => JsonRpcTransformers.blockUncleTo(u)),
        };
    }
    static rangeFrom([a, b]) {
        return [(0, index_js_4.numToHex)(a), (0, index_js_4.numToHex)(b)];
    }
    static indexerSearchKeyFilterFrom(filter) {
        return {
            script: (0, index_js_5.apply)(JsonRpcTransformers.scriptFrom, filter.script),
            script_len_range: (0, index_js_5.apply)(JsonRpcTransformers.rangeFrom, filter.scriptLenRange),
            output_data: filter.outputData,
            output_data_filter_mode: filter.outputDataSearchMode,
            output_data_len_range: (0, index_js_5.apply)(JsonRpcTransformers.rangeFrom, filter.outputDataLenRange),
            output_capacity_range: (0, index_js_5.apply)(JsonRpcTransformers.rangeFrom, filter.outputCapacityRange),
            block_range: (0, index_js_5.apply)(JsonRpcTransformers.rangeFrom, filter.blockRange),
        };
    }
    static indexerSearchKeyFrom(keyLike) {
        const key = clientTypes_js_1.ClientIndexerSearchKey.from(keyLike);
        return {
            script: JsonRpcTransformers.scriptFrom(key.script),
            script_type: key.scriptType,
            script_search_mode: key.scriptSearchMode,
            filter: (0, index_js_5.apply)(JsonRpcTransformers.indexerSearchKeyFilterFrom, key.filter),
            with_data: key.withData,
        };
    }
    static findCellsResponseTo({ last_cursor, objects, }) {
        return {
            lastCursor: last_cursor,
            cells: objects.map((cell) => index_js_2.Cell.from({
                outPoint: JsonRpcTransformers.outPointTo(cell.out_point),
                cellOutput: JsonRpcTransformers.cellOutputTo(cell.output),
                outputData: cell.output_data ?? "0x",
            })),
        };
    }
    static indexerSearchKeyTransactionFrom(keyLike) {
        const key = clientTypes_js_1.ClientIndexerSearchKeyTransaction.from(keyLike);
        return {
            script: JsonRpcTransformers.scriptFrom(key.script),
            script_type: key.scriptType,
            script_search_mode: key.scriptSearchMode,
            filter: (0, index_js_5.apply)(JsonRpcTransformers.indexerSearchKeyFilterFrom, key.filter),
            group_by_transaction: key.groupByTransaction,
        };
    }
    static findTransactionsResponseTo({ last_cursor, objects, }) {
        if (objects.length === 0) {
            return {
                lastCursor: last_cursor,
                transactions: [],
            };
        }
        if ("io_index" in objects[0]) {
            return {
                lastCursor: last_cursor,
                transactions: objects.map((tx) => ({
                    txHash: tx.tx_hash,
                    blockNumber: (0, index_js_4.numFrom)(tx.block_number),
                    txIndex: (0, index_js_4.numFrom)(tx.tx_index),
                    cellIndex: (0, index_js_4.numFrom)(tx.io_index),
                    isInput: tx.io_type === "input",
                })),
            };
        }
        return {
            lastCursor: last_cursor,
            transactions: objects.map((tx) => ({
                txHash: tx.tx_hash,
                blockNumber: (0, index_js_4.numFrom)(tx.block_number),
                txIndex: (0, index_js_4.numFrom)(tx.tx_index),
                cells: tx.cells.map(([type, i]) => ({
                    isInput: type === "input",
                    cellIndex: (0, index_js_4.numFrom)(i),
                })),
            })),
        };
    }
}
exports.JsonRpcTransformers = JsonRpcTransformers;

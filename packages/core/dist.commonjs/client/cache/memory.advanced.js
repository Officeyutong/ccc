"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterData = filterData;
exports.filterScript = filterScript;
exports.filterNumByRange = filterNumByRange;
exports.filterScriptByLenRange = filterScriptByLenRange;
exports.filterCell = filterCell;
const index_js_1 = require("../../bytes/index.js");
const index_js_2 = require("../../ckb/index.js");
const index_js_3 = require("../../hex/index.js");
const index_js_4 = require("../../num/index.js");
const clientTypes_advanced_js_1 = require("../clientTypes.advanced.js");
const clientTypes_js_1 = require("../clientTypes.js");
function filterData(dataLike, filterLike, filterMode) {
    if (!filterLike) {
        return true;
    }
    const data = (0, index_js_3.hexFrom)(dataLike);
    const filter = (0, index_js_3.hexFrom)(filterLike);
    if ((filterMode === "exact" && data !== filter) ||
        (filterMode === "prefix" && !data.startsWith(filter)) ||
        (filterMode === "partial" && data.search(filter) === -1)) {
        return false;
    }
    return true;
}
function filterScript(valueLike, filterLike, filterMode) {
    if (!filterLike) {
        return true;
    }
    if (!valueLike) {
        return false;
    }
    const value = index_js_2.Script.from(valueLike);
    const filter = index_js_2.Script.from(filterLike);
    if (value.codeHash !== filter.codeHash ||
        value.hashType !== filter.hashType) {
        return false;
    }
    return filterData(value.args, filter?.args, filterMode);
}
function filterNumByRange(lengthLike, range) {
    if (!range) {
        return true;
    }
    const length = (0, index_js_4.numFrom)(lengthLike);
    const [lower, upper] = (0, clientTypes_advanced_js_1.clientSearchKeyRangeFrom)(range);
    return lower <= length && length < upper;
}
function filterScriptByLenRange(valueLike, scriptLenRange) {
    if (!scriptLenRange) {
        return true;
    }
    const len = (() => {
        if (!valueLike) {
            return 0;
        }
        return (0, index_js_1.bytesFrom)(index_js_2.Script.from(valueLike).args).length + 33;
    })();
    return filterNumByRange(len, scriptLenRange);
}
function filterCell(searchKeyLike, cellLike) {
    const key = clientTypes_js_1.ClientIndexerSearchKey.from(searchKeyLike);
    const cell = index_js_2.Cell.from(cellLike);
    if (key.scriptType === "lock") {
        if (!filterScript(cell.cellOutput.lock, key.script, key.scriptSearchMode) ||
            !filterScript(cell.cellOutput.type, key.filter?.script, "prefix") ||
            !filterScriptByLenRange(cell.cellOutput.type, key.filter?.scriptLenRange)) {
            return false;
        }
    }
    if (key.scriptType === "type") {
        if (!filterScript(cell.cellOutput.type, key.script, key.scriptSearchMode) ||
            !filterScript(cell.cellOutput.lock, key.filter?.script, "prefix") ||
            !filterScriptByLenRange(cell.cellOutput.lock, key.filter?.scriptLenRange)) {
            return false;
        }
    }
    if (!filterData(cell.outputData, key.filter?.outputData, key.filter?.outputDataSearchMode ?? "prefix") ||
        !filterNumByRange((0, index_js_1.bytesFrom)(cell.outputData).length, key.filter?.outputDataLenRange)) {
        return false;
    }
    if (!filterNumByRange(cell.cellOutput.capacity, key.filter?.outputCapacityRange)) {
        return false;
    }
    return true;
}

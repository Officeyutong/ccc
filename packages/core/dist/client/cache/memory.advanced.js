import { bytesFrom } from "../../bytes/index.js";
import { Cell, Script } from "../../ckb/index.js";
import { hexFrom } from "../../hex/index.js";
import { numFrom } from "../../num/index.js";
import { clientSearchKeyRangeFrom, } from "../clientTypes.advanced.js";
import { ClientIndexerSearchKey } from "../clientTypes.js";
export function filterData(dataLike, filterLike, filterMode) {
    if (!filterLike) {
        return true;
    }
    const data = hexFrom(dataLike);
    const filter = hexFrom(filterLike);
    if ((filterMode === "exact" && data !== filter) ||
        (filterMode === "prefix" && !data.startsWith(filter)) ||
        (filterMode === "partial" && data.search(filter) === -1)) {
        return false;
    }
    return true;
}
export function filterScript(valueLike, filterLike, filterMode) {
    if (!filterLike) {
        return true;
    }
    if (!valueLike) {
        return false;
    }
    const value = Script.from(valueLike);
    const filter = Script.from(filterLike);
    if (value.codeHash !== filter.codeHash ||
        value.hashType !== filter.hashType) {
        return false;
    }
    return filterData(value.args, filter?.args, filterMode);
}
export function filterNumByRange(lengthLike, range) {
    if (!range) {
        return true;
    }
    const length = numFrom(lengthLike);
    const [lower, upper] = clientSearchKeyRangeFrom(range);
    return lower <= length && length < upper;
}
export function filterScriptByLenRange(valueLike, scriptLenRange) {
    if (!scriptLenRange) {
        return true;
    }
    const len = (() => {
        if (!valueLike) {
            return 0;
        }
        return bytesFrom(Script.from(valueLike).args).length + 33;
    })();
    return filterNumByRange(len, scriptLenRange);
}
export function filterCell(searchKeyLike, cellLike) {
    const key = ClientIndexerSearchKey.from(searchKeyLike);
    const cell = Cell.from(cellLike);
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
        !filterNumByRange(bytesFrom(cell.outputData).length, key.filter?.outputDataLenRange)) {
        return false;
    }
    if (!filterNumByRange(cell.cellOutput.capacity, key.filter?.outputCapacityRange)) {
        return false;
    }
    return true;
}

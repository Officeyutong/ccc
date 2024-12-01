"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorClientWaitTransactionTimeout = exports.ErrorClientRBFRejected = exports.ErrorClientDuplicatedTransaction = exports.ErrorClientVerification = exports.ErrorClientResolveUnknown = exports.ErrorClientBase = exports.ClientIndexerSearchKeyTransaction = exports.ClientIndexerSearchKey = exports.ClientIndexerSearchKeyFilter = exports.ScriptInfo = exports.CellDepInfo = exports.KnownScript = void 0;
const index_js_1 = require("../ckb/index.js");
const index_js_2 = require("../hex/index.js");
const index_js_3 = require("../num/index.js");
const index_js_4 = require("../utils/index.js");
const clientTypes_advanced_js_1 = require("./clientTypes.advanced.js");
/**
 * @public
 */
var KnownScript;
(function (KnownScript) {
    KnownScript["NervosDao"] = "NervosDao";
    KnownScript["Secp256k1Blake160"] = "Secp256k1Blake160";
    KnownScript["Secp256k1Multisig"] = "Secp256k1Multisig";
    KnownScript["AnyoneCanPay"] = "AnyoneCanPay";
    KnownScript["TypeId"] = "TypeId";
    KnownScript["XUdt"] = "XUdt";
    KnownScript["JoyId"] = "JoyId";
    KnownScript["COTA"] = "COTA";
    KnownScript["PWLock"] = "PWLock";
    KnownScript["OmniLock"] = "OmniLock";
    KnownScript["NostrLock"] = "NostrLock";
    KnownScript["UniqueType"] = "UniqueType";
    // ckb-proxy-locks https://github.com/ckb-devrel/ckb-proxy-locks
    KnownScript["AlwaysSuccess"] = "AlwaysSuccess";
    KnownScript["InputTypeProxyLock"] = "InputTypeProxyLock";
    KnownScript["OutputTypeProxyLock"] = "OutputTypeProxyLock";
    KnownScript["LockProxyLock"] = "LockProxyLock";
    KnownScript["SingleUseLock"] = "SingleUseLock";
    KnownScript["TypeBurnLock"] = "TypeBurnLock";
    KnownScript["EasyToDiscoverType"] = "EasyToDiscoverType";
    KnownScript["TimeLock"] = "TimeLock";
})(KnownScript || (exports.KnownScript = KnownScript = {}));
/**
 * @public
 */
class CellDepInfo {
    constructor(cellDep, type) {
        this.cellDep = cellDep;
        this.type = type;
    }
    static from(cellDepInfoLike) {
        return new CellDepInfo(index_js_1.CellDep.from(cellDepInfoLike.cellDep), (0, index_js_4.apply)(index_js_1.Script.from, cellDepInfoLike.type));
    }
}
exports.CellDepInfo = CellDepInfo;
/**
 * @public
 */
class ScriptInfo {
    constructor(codeHash, hashType, cellDeps) {
        this.codeHash = codeHash;
        this.hashType = hashType;
        this.cellDeps = cellDeps;
    }
    static from(scriptInfoLike) {
        return new ScriptInfo((0, index_js_2.hexFrom)(scriptInfoLike.codeHash), (0, index_js_1.hashTypeFrom)(scriptInfoLike.hashType), scriptInfoLike.cellDeps.map((c) => CellDepInfo.from(c)));
    }
}
exports.ScriptInfo = ScriptInfo;
/**
 * @public
 */
class ClientIndexerSearchKeyFilter {
    constructor(script, scriptLenRange, outputData, outputDataSearchMode, outputDataLenRange, outputCapacityRange, blockRange) {
        this.script = script;
        this.scriptLenRange = scriptLenRange;
        this.outputData = outputData;
        this.outputDataSearchMode = outputDataSearchMode;
        this.outputDataLenRange = outputDataLenRange;
        this.outputCapacityRange = outputCapacityRange;
        this.blockRange = blockRange;
    }
    static from(filterLike) {
        return new ClientIndexerSearchKeyFilter((0, index_js_4.apply)(index_js_1.Script.from, filterLike.script), (0, index_js_4.apply)(clientTypes_advanced_js_1.clientSearchKeyRangeFrom, filterLike.scriptLenRange), (0, index_js_4.apply)(index_js_2.hexFrom, filterLike.outputData), filterLike.outputDataSearchMode ?? undefined, (0, index_js_4.apply)(clientTypes_advanced_js_1.clientSearchKeyRangeFrom, filterLike.outputDataLenRange), (0, index_js_4.apply)(clientTypes_advanced_js_1.clientSearchKeyRangeFrom, filterLike.outputCapacityRange), (0, index_js_4.apply)(clientTypes_advanced_js_1.clientSearchKeyRangeFrom, filterLike.blockRange));
    }
}
exports.ClientIndexerSearchKeyFilter = ClientIndexerSearchKeyFilter;
/**
 * @public
 */
class ClientIndexerSearchKey {
    constructor(script, scriptType, scriptSearchMode, filter, withData) {
        this.script = script;
        this.scriptType = scriptType;
        this.scriptSearchMode = scriptSearchMode;
        this.filter = filter;
        this.withData = withData;
    }
    static from(keyLike) {
        return new ClientIndexerSearchKey(index_js_1.Script.from(keyLike.script), keyLike.scriptType, keyLike.scriptSearchMode, (0, index_js_4.apply)(ClientIndexerSearchKeyFilter.from, keyLike.filter), keyLike.withData ?? undefined);
    }
}
exports.ClientIndexerSearchKey = ClientIndexerSearchKey;
/**
 * @public
 */
class ClientIndexerSearchKeyTransaction {
    constructor(script, scriptType, scriptSearchMode, filter, groupByTransaction) {
        this.script = script;
        this.scriptType = scriptType;
        this.scriptSearchMode = scriptSearchMode;
        this.filter = filter;
        this.groupByTransaction = groupByTransaction;
    }
    static from(keyLike) {
        return new ClientIndexerSearchKeyTransaction(index_js_1.Script.from(keyLike.script), keyLike.scriptType, keyLike.scriptSearchMode, (0, index_js_4.apply)(ClientIndexerSearchKeyFilter.from, keyLike.filter), keyLike.groupByTransaction ?? undefined);
    }
}
exports.ClientIndexerSearchKeyTransaction = ClientIndexerSearchKeyTransaction;
class ErrorClientBase extends Error {
    constructor(origin) {
        super(`Client request error ${origin.message}`);
        this.code = origin.code;
        this.data = origin.data;
    }
}
exports.ErrorClientBase = ErrorClientBase;
class ErrorClientResolveUnknown extends ErrorClientBase {
    constructor(origin, outPointLike) {
        super(origin);
        this.outPoint = index_js_1.OutPoint.from(outPointLike);
    }
}
exports.ErrorClientResolveUnknown = ErrorClientResolveUnknown;
class ErrorClientVerification extends ErrorClientBase {
    constructor(origin, source, sourceIndex, errorCode, scriptHashType, scriptCodeHash) {
        super(origin);
        this.source = source;
        this.errorCode = errorCode;
        this.scriptHashType = scriptHashType;
        this.sourceIndex = (0, index_js_3.numFrom)(sourceIndex);
        this.scriptCodeHash = (0, index_js_2.hexFrom)(scriptCodeHash);
    }
}
exports.ErrorClientVerification = ErrorClientVerification;
class ErrorClientDuplicatedTransaction extends ErrorClientBase {
    constructor(origin, txHash) {
        super(origin);
        this.txHash = (0, index_js_2.hexFrom)(txHash);
    }
}
exports.ErrorClientDuplicatedTransaction = ErrorClientDuplicatedTransaction;
class ErrorClientRBFRejected extends ErrorClientBase {
    constructor(origin, currentFee, leastFee) {
        super(origin);
        this.currentFee = (0, index_js_3.numFrom)(currentFee);
        this.leastFee = (0, index_js_3.numFrom)(leastFee);
    }
}
exports.ErrorClientRBFRejected = ErrorClientRBFRejected;
class ErrorClientWaitTransactionTimeout extends Error {
    constructor() {
        super("Wait transaction timeout");
    }
}
exports.ErrorClientWaitTransactionTimeout = ErrorClientWaitTransactionTimeout;

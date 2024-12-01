import { CellDep, OutPoint, Script, hashTypeFrom, } from "../ckb/index.js";
import { hexFrom } from "../hex/index.js";
import { numFrom } from "../num/index.js";
import { apply } from "../utils/index.js";
import { clientSearchKeyRangeFrom, } from "./clientTypes.advanced.js";
/**
 * @public
 */
export var KnownScript;
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
})(KnownScript || (KnownScript = {}));
/**
 * @public
 */
export class CellDepInfo {
    constructor(cellDep, type) {
        this.cellDep = cellDep;
        this.type = type;
    }
    static from(cellDepInfoLike) {
        return new CellDepInfo(CellDep.from(cellDepInfoLike.cellDep), apply(Script.from, cellDepInfoLike.type));
    }
}
/**
 * @public
 */
export class ScriptInfo {
    constructor(codeHash, hashType, cellDeps) {
        this.codeHash = codeHash;
        this.hashType = hashType;
        this.cellDeps = cellDeps;
    }
    static from(scriptInfoLike) {
        return new ScriptInfo(hexFrom(scriptInfoLike.codeHash), hashTypeFrom(scriptInfoLike.hashType), scriptInfoLike.cellDeps.map((c) => CellDepInfo.from(c)));
    }
}
/**
 * @public
 */
export class ClientIndexerSearchKeyFilter {
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
        return new ClientIndexerSearchKeyFilter(apply(Script.from, filterLike.script), apply(clientSearchKeyRangeFrom, filterLike.scriptLenRange), apply(hexFrom, filterLike.outputData), filterLike.outputDataSearchMode ?? undefined, apply(clientSearchKeyRangeFrom, filterLike.outputDataLenRange), apply(clientSearchKeyRangeFrom, filterLike.outputCapacityRange), apply(clientSearchKeyRangeFrom, filterLike.blockRange));
    }
}
/**
 * @public
 */
export class ClientIndexerSearchKey {
    constructor(script, scriptType, scriptSearchMode, filter, withData) {
        this.script = script;
        this.scriptType = scriptType;
        this.scriptSearchMode = scriptSearchMode;
        this.filter = filter;
        this.withData = withData;
    }
    static from(keyLike) {
        return new ClientIndexerSearchKey(Script.from(keyLike.script), keyLike.scriptType, keyLike.scriptSearchMode, apply(ClientIndexerSearchKeyFilter.from, keyLike.filter), keyLike.withData ?? undefined);
    }
}
/**
 * @public
 */
export class ClientIndexerSearchKeyTransaction {
    constructor(script, scriptType, scriptSearchMode, filter, groupByTransaction) {
        this.script = script;
        this.scriptType = scriptType;
        this.scriptSearchMode = scriptSearchMode;
        this.filter = filter;
        this.groupByTransaction = groupByTransaction;
    }
    static from(keyLike) {
        return new ClientIndexerSearchKeyTransaction(Script.from(keyLike.script), keyLike.scriptType, keyLike.scriptSearchMode, apply(ClientIndexerSearchKeyFilter.from, keyLike.filter), keyLike.groupByTransaction ?? undefined);
    }
}
export class ErrorClientBase extends Error {
    constructor(origin) {
        super(`Client request error ${origin.message}`);
        this.code = origin.code;
        this.data = origin.data;
    }
}
export class ErrorClientResolveUnknown extends ErrorClientBase {
    constructor(origin, outPointLike) {
        super(origin);
        this.outPoint = OutPoint.from(outPointLike);
    }
}
export class ErrorClientVerification extends ErrorClientBase {
    constructor(origin, source, sourceIndex, errorCode, scriptHashType, scriptCodeHash) {
        super(origin);
        this.source = source;
        this.errorCode = errorCode;
        this.scriptHashType = scriptHashType;
        this.sourceIndex = numFrom(sourceIndex);
        this.scriptCodeHash = hexFrom(scriptCodeHash);
    }
}
export class ErrorClientDuplicatedTransaction extends ErrorClientBase {
    constructor(origin, txHash) {
        super(origin);
        this.txHash = hexFrom(txHash);
    }
}
export class ErrorClientRBFRejected extends ErrorClientBase {
    constructor(origin, currentFee, leastFee) {
        super(origin);
        this.currentFee = numFrom(currentFee);
        this.leastFee = numFrom(leastFee);
    }
}
export class ErrorClientWaitTransactionTimeout extends Error {
    constructor() {
        super("Wait transaction timeout");
    }
}

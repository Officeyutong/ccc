import { CellLike, ScriptLike } from "../../ckb/index.js";
import { HexLike } from "../../hex/index.js";
import { NumLike } from "../../num/index.js";
import { ClientCollectableSearchKeyLike } from "../clientTypes.advanced.js";
export declare function filterData(dataLike: HexLike, filterLike: HexLike | undefined, filterMode: "exact" | "prefix" | "partial"): boolean;
export declare function filterScript(valueLike: ScriptLike | undefined, filterLike: ScriptLike | undefined, filterMode: "prefix" | "exact" | "partial"): boolean;
export declare function filterNumByRange(lengthLike: NumLike, range: [NumLike, NumLike] | undefined): boolean;
export declare function filterScriptByLenRange(valueLike?: ScriptLike, scriptLenRange?: [NumLike, NumLike]): boolean;
export declare function filterCell(searchKeyLike: ClientCollectableSearchKeyLike, cellLike: CellLike): boolean;
//# sourceMappingURL=memory.advanced.d.ts.map
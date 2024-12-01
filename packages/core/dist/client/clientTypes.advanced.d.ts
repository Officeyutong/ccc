import { ScriptLike } from "../ckb/index.js";
import { HexLike } from "../hex/index.js";
import { Num, NumLike } from "../num/index.js";
export declare function clientSearchKeyRangeFrom([a, b]: [NumLike, NumLike]): [
    Num,
    Num
];
export type ClientCollectableSearchKeyFilterLike = {
    script?: ScriptLike | null;
    scriptLenRange?: [NumLike, NumLike] | null;
    outputData?: HexLike | null;
    outputDataSearchMode?: "prefix" | "exact" | "partial" | null;
    outputDataLenRange?: [NumLike, NumLike] | null;
    outputCapacityRange?: [NumLike, NumLike] | null;
};
export type ClientCollectableSearchKeyLike = {
    script: ScriptLike;
    scriptType: "lock" | "type";
    scriptSearchMode: "prefix" | "exact" | "partial";
    filter?: ClientCollectableSearchKeyFilterLike | null;
    withData?: boolean | null;
};
//# sourceMappingURL=clientTypes.advanced.d.ts.map
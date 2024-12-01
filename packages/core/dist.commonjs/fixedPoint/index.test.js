"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
describe("fixedPointToString", () => {
    const cases = [
        [0n, "0"],
        [1n, "0.00000001"],
        [100000000n, "1"],
        [1000000000n, "10"],
        [1010100000n, "10.101"],
        [11n, "1.1", 1],
        [0n, "0", 1],
        [1n, "1", 0],
        [0n, "0", 0],
    ];
    cases.forEach(([i, o, decimals]) => test(`${i} with ${decimals ?? "default"} decimals = "${o}"`, () => {
        expect((0, index_js_1.fixedPointToString)(i, decimals)).toBe(o);
    }));
});
describe("fixedPointFrom string", () => {
    const cases = [
        ["0", 0n],
        ["0.00000001", 1n],
        ["1", 100000000n],
        ["10", 1000000000n],
        ["10.101", 1010100000n],
        ["1.1", 11n, 1],
        ["0", 0n, 1],
        ["1", 1n, 0],
        ["0", 0n, 0],
    ];
    cases.forEach(([i, o, decimals]) => test(`"${i}" = ${o} with ${decimals ?? "default"} decimals `, () => {
        expect((0, index_js_1.fixedPointFrom)(i, decimals)).toBe(o);
    }));
});
describe("fixedPointFrom number", () => {
    const cases = [
        [0.00000001, 1n],
        [10.101, 1010100000n],
        [1.1, 11n, 1],
    ];
    cases.forEach(([i, o, decimals]) => test(`${i} = ${o} with ${decimals ?? "default"} decimals `, () => {
        expect((0, index_js_1.fixedPointFrom)(i, decimals)).toBe(o);
    }));
});

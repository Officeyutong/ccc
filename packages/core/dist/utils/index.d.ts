import { NumLike } from "../num/index.js";
/**
 * A type safe way to apply a transformer on a value if it's not empty.
 * @public
 *
 * @param transformer - The transformer.
 * @param value - The value to be transformed.
 * @returns If the value is empty, it becomes undefined. Otherwise it will be transformed.
 */
export declare function apply<T, R>(transformer: (val: T) => R, value: undefined): undefined;
/**
 * A type safe way to apply a transformer on a value if it's not empty.
 * @public
 *
 * @param transformer - The transformer.
 * @param value - The value to be transformed.
 * @returns If the value is empty, it becomes undefined. Otherwise it will be transformed.
 */
export declare function apply<T, R>(transformer: (val: T) => R, value: null): undefined;
/**
 * A type safe way to apply a transformer on a value if it's not empty.
 * @public
 *
 * @param transformer - The transformer.
 * @param value - The value to be transformed.
 * @returns If the value is empty, it becomes undefined. Otherwise it will be transformed.
 */
export declare function apply<T, R>(transformer: (val: T) => R, value: T): R;
/**
 * A type safe way to apply a transformer on a value if it's not empty.
 * @public
 *
 * @param transformer - The transformer.
 * @param value - The value to be transformed.
 * @returns If the value is empty, it becomes undefined. Otherwise it will be transformed.
 */
export declare function apply<T, R>(transformer: (val: T) => R, value: T | undefined): R | undefined;
/**
 * A type safe way to apply a transformer on a value if it's not empty.
 * @public
 *
 * @param transformer - The transformer.
 * @param value - The value to be transformed.
 * @returns If the value is empty, it becomes undefined. Otherwise it will be transformed.
 */
export declare function apply<T, R>(transformer: (val: T) => R, value: T | null): R | undefined;
/**
 * A type safe way to apply a transformer on a value if it's not empty.
 * @public
 *
 * @param transformer - The transformer.
 * @param value - The value to be transformed.
 * @returns If the value is empty, it becomes undefined. Otherwise it will be transformed.
 */
export declare function apply<T, R>(transformer: (val: T) => R, value: undefined | null): undefined;
/**
/**
 * A type safe way to apply a transformer on a value if it's not empty.
 * @public
 *
 * @param transformer - The transformer.
 * @param value - The value to be transformed.
 * @returns If the value is empty, it becomes undefined. Otherwise it will be transformed.
 */
export declare function apply<T, R>(transformer: (val: T) => R, value: T | undefined | null): R | undefined;
/**
 * Similar to Array.reduce, but the accumulator can returns Promise.
 * @public
 *
 * @param values - The array to be reduced.
 * @param accumulator - A callback to be called for each value. If it returns null, the previous result will be kept.
 * @returns The accumulated result.
 */
export declare function reduceAsync<T>(values: T[], accumulator: (a: T, b: T) => Promise<T | undefined | null | void> | T | undefined | null | void): Promise<T>;
/**
 * Similar to Array.reduce, but the accumulator can returns Promise.
 * @public
 *
 * @param values - The array to be reduced.
 * @param accumulator - A callback to be called for each value. If it returns null, the previous result will be kept.
 * @param init - The initial value.
 * @returns The accumulated result.
 */
export declare function reduceAsync<T, V>(values: V[], accumulator: (a: T, b: V, i: number, values: V[]) => Promise<T | undefined | null | void> | T | undefined | null | void, init: T | Promise<T>): Promise<T>;
export declare function sleep(ms: NumLike): Promise<unknown>;
/**
 * @public
 */
export declare function isWebview(userAgent: string): boolean;
//# sourceMappingURL=index.d.ts.map
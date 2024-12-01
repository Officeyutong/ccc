import { numFrom } from "../num/index.js";
/**
 * A type safe way to apply a transformer on a value if it's not empty.
 * @public
 *
 * @param transformer - The transformer.
 * @param value - The value to be transformed.
 * @returns If the value is empty, it becomes undefined. Otherwise it will be transformed.
 */
export function apply(transformer, value) {
    if (value == null) {
        return undefined;
    }
    return transformer(value);
}
/**
 * Similar to Array.reduce, but the accumulator can returns Promise.
 * @public
 *
 * @param values - The array to be reduced.
 * @param accumulator - A callback to be called for each value. If it returns null, the previous result will be kept.
 * @param init - The initial value.
 * @returns The accumulated result.
 */
export async function reduceAsync(values, accumulator, init) {
    if (init === undefined) {
        if (values.length === 0) {
            throw new TypeError("Reduce of empty array with no initial value");
        }
        init = values[0];
        values = values.slice(1);
    }
    return values.reduce((current, b, i, array) => current.then((v) => Promise.resolve(accumulator(v, b, i, array)).then((r) => r ?? v)), Promise.resolve(init));
}
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, Number(numFrom(ms))));
}
/**
 * @public
 */
export function isWebview(userAgent) {
    return /webview|wv|ip((?!.*Safari)|(?=.*like Safari))/i.test(userAgent);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADDRESS_BECH32_LIMIT = exports.AddressFormat = void 0;
exports.addressPayloadFromString = addressPayloadFromString;
exports.addressFromPayload = addressFromPayload;
const bech32_1 = require("bech32");
const index_js_1 = require("../ckb/index.js");
const index_js_2 = require("../client/index.js");
const index_js_3 = require("../hex/index.js");
/**
 * Parses an address string into an address information object.
 *
 * @param address - The address string to parse.
 * @returns An object containing the address prefix, address format, and payload array.
 *
 * @throws Will throw an error if the address format is unknown.
 *
 * @example
 * ```typescript
 * const addressInfo = addressPayloadFromString("ckt1112139193129");
 * console.log(addressInfo.prefix); // Outputs the address prefix
 * console.log(addressInfo.format); // Outputs the address format
 * console.log(addressInfo.payload); // Outputs the payload array
 * ```
 */
function addressPayloadFromString(address) {
    // Try parse full format address
    try {
        const { words, prefix } = bech32_1.bech32m.decode(address, exports.ADDRESS_BECH32_LIMIT);
        const [formatType, ...payload] = bech32_1.bech32m.fromWords(words);
        if (formatType === AddressFormat.Full) {
            return { prefix, format: AddressFormat.Full, payload };
        }
    }
    catch (_) { }
    // Try parse legacy 2019 format address
    try {
        const { prefix, words } = bech32_1.bech32.decode(address, exports.ADDRESS_BECH32_LIMIT);
        const [formatType, ...payload] = bech32_1.bech32.fromWords(words);
        if ([
            AddressFormat.FullData,
            AddressFormat.FullType,
            AddressFormat.Short,
        ].includes(formatType)) {
            return { prefix, format: formatType, payload };
        }
    }
    catch (_) { }
    throw Error(`Unknown address format ${address}`);
}
/**
 * Converts an address payload into an address-like object.
 *
 * @param prefix - The address prefix.
 * @param format - The format of the address, as defined by the AddressFormat enum.
 * @param payload - The payload array containing the address data.
 * @param client - The client instance used to fetch known scripts.
 * @returns A promise that resolves to an AddressLike object.
 *
 * @throws Will throw an error if the payload length is insufficient or if the script type is unknown.
 *
 * @example
 * ```typescript
 * const address = await addressFromPayload("ckt", AddressFormat.Full, [/* payload data *\/], client);
 * console.log(address.script); // Outputs the script object
 * console.log(address.prefix); // Outputs the address prefix
 * ```
 */
async function addressFromPayload(prefix, format, payload, client) {
    if (format === AddressFormat.Full) {
        if (payload.length < 32 + 1) {
            throw new Error(`Invalid full address without enough payload ${(0, index_js_3.hexFrom)(payload)}`);
        }
        return {
            script: {
                codeHash: payload.slice(0, 32),
                hashType: (0, index_js_1.hashTypeFromBytes)(payload.slice(32, 33)),
                args: payload.slice(33),
            },
            prefix,
        };
    }
    if (format === AddressFormat.FullData) {
        if (payload.length < 32) {
            throw new Error(`Invalid full data address without enough payload ${(0, index_js_3.hexFrom)(payload)}`);
        }
        return {
            script: {
                codeHash: payload.slice(0, 32),
                hashType: "data",
                args: payload.slice(32),
            },
            prefix,
        };
    }
    if (format === AddressFormat.FullType) {
        if (payload.length < 32) {
            throw new Error(`Invalid full type address without enough payload ${(0, index_js_3.hexFrom)(payload)}`);
        }
        return {
            script: {
                codeHash: payload.slice(0, 32),
                hashType: "type",
                args: payload.slice(32),
            },
            prefix,
        };
    }
    // format === AddressFormat.Short
    if (payload.length !== 21) {
        throw new Error(`Invalid short address without enough payload ${(0, index_js_3.hexFrom)(payload)}`);
    }
    const script = [
        index_js_2.KnownScript.Secp256k1Blake160,
        index_js_2.KnownScript.Secp256k1Multisig,
        index_js_2.KnownScript.AnyoneCanPay,
    ][payload[0]];
    if (script === undefined) {
        throw new Error(`Invalid short address with unknown script ${(0, index_js_3.hexFrom)(payload)}`);
    }
    return {
        script: await index_js_1.Script.fromKnownScript(client, script, payload.slice(1)),
        prefix,
    };
}
var AddressFormat;
(function (AddressFormat) {
    /**
     * full version identifies the hashType
     */
    AddressFormat[AddressFormat["Full"] = 0] = "Full";
    /**
     * @deprecated
     * short version for locks with Known codeHash, deprecated
     */
    AddressFormat[AddressFormat["Short"] = 1] = "Short";
    /**
     * @deprecated
     * full version with hashType = "Data", deprecated
     */
    AddressFormat[AddressFormat["FullData"] = 2] = "FullData";
    /**
     * @deprecated
     * full version with hashType = "Type", deprecated
     */
    AddressFormat[AddressFormat["FullType"] = 4] = "FullType";
})(AddressFormat || (exports.AddressFormat = AddressFormat = {}));
exports.ADDRESS_BECH32_LIMIT = 1023;

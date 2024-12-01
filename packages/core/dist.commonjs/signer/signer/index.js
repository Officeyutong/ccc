"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignerInfo = exports.Signer = exports.Signature = exports.SignerType = exports.SignerSignType = void 0;
const index_js_1 = require("../btc/index.js");
const verifyCkbSecp256k1_js_1 = require("../ckb/verifyCkbSecp256k1.js");
const verifyJoyId_js_1 = require("../ckb/verifyJoyId.js");
const verify_js_1 = require("../evm/verify.js");
const verify_js_2 = require("../nostr/verify.js");
/**
 * @public
 */
var SignerSignType;
(function (SignerSignType) {
    SignerSignType["Unknown"] = "Unknown";
    SignerSignType["BtcEcdsa"] = "BtcEcdsa";
    SignerSignType["EvmPersonal"] = "EvmPersonal";
    SignerSignType["JoyId"] = "JoyId";
    SignerSignType["NostrEvent"] = "NostrEvent";
    SignerSignType["CkbSecp256k1"] = "CkbSecp256k1";
})(SignerSignType || (exports.SignerSignType = SignerSignType = {}));
/**
 * An enumeration of signer display types in wallet.
 * @public
 */
var SignerType;
(function (SignerType) {
    SignerType["EVM"] = "EVM";
    SignerType["BTC"] = "BTC";
    SignerType["CKB"] = "CKB";
    SignerType["Nostr"] = "Nostr";
})(SignerType || (exports.SignerType = SignerType = {}));
/**
 * @public
 */
class Signature {
    constructor(signature, identity, signType) {
        this.signature = signature;
        this.identity = identity;
        this.signType = signType;
    }
}
exports.Signature = Signature;
/**
 * An abstract class representing a generic signer.
 * This class provides methods to connect, get addresses, and sign transactions.
 * @public
 */
class Signer {
    constructor(client_) {
        this.client_ = client_;
    }
    get client() {
        return this.client_;
    }
    // Returns the preference if we need to switch network
    // undefined otherwise
    matchNetworkPreference(preferences, currentNetwork) {
        if (currentNetwork !== undefined &&
            preferences.some(({ signerType, addressPrefix, network }) => {
                signerType === this.type &&
                    addressPrefix === this.client.addressPrefix &&
                    network === currentNetwork;
            })) {
            return;
        }
        return preferences.find(({ signerType, addressPrefix }) => signerType === this.type && addressPrefix === this.client.addressPrefix);
    }
    static async verifyMessage(message, signature) {
        switch (signature.signType) {
            case SignerSignType.EvmPersonal:
                return (0, verify_js_1.verifyMessageEvmPersonal)(message, signature.signature, signature.identity);
            case SignerSignType.BtcEcdsa:
                return (0, index_js_1.verifyMessageBtcEcdsa)(message, signature.signature, signature.identity);
            case SignerSignType.JoyId:
                return (0, verifyJoyId_js_1.verifyMessageJoyId)(message, signature.signature, signature.identity);
            case SignerSignType.NostrEvent:
                return (0, verify_js_2.verifyMessageNostrEvent)(message, signature.signature, signature.identity);
            case SignerSignType.CkbSecp256k1:
                return (0, verifyCkbSecp256k1_js_1.verifyMessageCkbSecp256k1)(message, signature.signature, signature.identity);
            case SignerSignType.Unknown:
                throw new Error("Unknown signer sign type");
        }
    }
    /**
     * Register a listener to be called when this signer is replaced.
     *
     * @returns A function for unregister
     */
    onReplaced(_) {
        return () => { };
    }
    /**
     * Disconnects to the signer.
     *
     * @returns A promise that resolves when the signer is disconnected.
     */
    async disconnect() { }
    /**
     * Gets the identity for verifying signature, usually it's address
     *
     * @returns A promise that resolves to a string representing the identity
     */
    async getIdentity() {
        return this.getInternalAddress();
    }
    /**
     * Gets the recommended Address object for the signer.
     *
     * @param _preference - Optional preference parameter.
     * @returns A promise that resolves to the recommended Address object.
     */
    async getRecommendedAddressObj(_preference) {
        return (await this.getAddressObjs())[0];
    }
    /**
     * Gets the recommended address for the signer as a string.
     *
     * @param preference - Optional preference parameter.
     * @returns A promise that resolves to the recommended address as a string.
     */
    async getRecommendedAddress(preference) {
        return (await this.getRecommendedAddressObj(preference)).toString();
    }
    /**
     * Gets an array of addresses associated with the signer as strings.
     *
     * @returns A promise that resolves to an array of addresses as strings.
     */
    async getAddresses() {
        return this.getAddressObjs().then((addresses) => addresses.map((address) => address.toString()));
    }
    /**
     * Find cells of this signer
     *
     * @returns A async generator that yields all matches cells
     */
    async *findCells(filter, withData, order, limit) {
        const scripts = await this.getAddressObjs();
        for (const { script } of scripts) {
            for await (const cell of this.client.findCells({
                script,
                scriptType: "lock",
                filter,
                scriptSearchMode: "exact",
                withData,
            }, order, limit)) {
                yield cell;
            }
        }
    }
    /**
     * Find transactions of this signer
     *
     * @returns A async generator that yields all matches transactions
     */
    async *findTransactions(filter, groupByTransaction, order, limit) {
        const scripts = await this.getAddressObjs();
        for (const { script } of scripts) {
            for await (const transaction of this.client.findTransactions({
                script,
                scriptType: "lock",
                filter,
                scriptSearchMode: "exact",
                groupByTransaction,
            }, order, limit)) {
                yield transaction;
            }
        }
    }
    /**
     * Gets balance of all addresses
     *
     * @returns A promise that resolves to the balance
     */
    async getBalance() {
        return this.client.getBalance((await this.getAddressObjs()).map(({ script }) => script));
    }
    /**
     * Signs a message.
     *
     * @param message - The message to sign, as a string or BytesLike object.
     * @returns A promise that resolves to the signature info.
     * @throws Will throw an error if not implemented.
     */
    async signMessage(message) {
        return {
            signature: await this.signMessageRaw(message),
            identity: await this.getIdentity(),
            signType: this.signType,
        };
    }
    /**
     * Signs a message and returns signature only. This method is not implemented and should be overridden by subclasses.
     *
     * @param _ - The message to sign, as a string or BytesLike object.
     * @returns A promise that resolves to the signature as a string.
     * @throws Will throw an error if not implemented.
     */
    signMessageRaw(_) {
        throw Error("Signer.signMessageRaw not implemented");
    }
    /**
     * Verify a signature.
     *
     * @param message - The original message.
     * @param signature - The signature to verify.
     * @returns A promise that resolves to the verification result.
     * @throws Will throw an error if not implemented.
     */
    async verifyMessage(message, signature) {
        if (typeof signature === "string") {
            return Signer.verifyMessage(message, {
                signType: this.signType,
                signature,
                identity: await this.getIdentity(),
            });
        }
        if (signature.identity !== (await this.getIdentity()) ||
            ![SignerSignType.Unknown, this.signType].includes(signature.signType)) {
            return false;
        }
        return Signer.verifyMessage(message, signature);
    }
    /**
     * Sends a transaction after signing it.
     *
     * @param tx - The transaction to send, represented as a TransactionLike object.
     * @returns A promise that resolves to the transaction hash as a Hex string.
     */
    async sendTransaction(tx) {
        return this.client.sendTransaction(await this.signTransaction(tx));
    }
    /**
     * Signs a transaction.
     *
     * @param tx - The transaction to sign, represented as a TransactionLike object.
     * @returns A promise that resolves to the signed Transaction object.
     */
    async signTransaction(tx) {
        const preparedTx = await this.prepareTransaction(tx);
        return this.signOnlyTransaction(preparedTx);
    }
    /**
     * prepare a transaction before signing. This method is not implemented and should be overridden by subclasses.
     *
     * @param _ - The transaction to prepare, represented as a TransactionLike object.
     * @returns A promise that resolves to the prepared Transaction object.
     * @throws Will throw an error if not implemented.
     */
    prepareTransaction(_) {
        throw Error("Signer.prepareTransaction not implemented");
    }
    /**
     * Signs a transaction without preparing information for it. This method is not implemented and should be overridden by subclasses.
     *
     * @param _ - The transaction to sign, represented as a TransactionLike object.
     * @returns A promise that resolves to the signed Transaction object.
     * @throws Will throw an error if not implemented.
     */
    signOnlyTransaction(_) {
        throw Error("Signer.signOnlyTransaction not implemented");
    }
}
exports.Signer = Signer;
/**
 * A class representing information about a signer, including its type and the signer instance.
 * @public
 */
class SignerInfo {
    constructor(name, signer) {
        this.name = name;
        this.signer = signer;
    }
}
exports.SignerInfo = SignerInfo;

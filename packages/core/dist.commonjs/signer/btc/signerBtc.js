"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignerBtc = void 0;
const ripemd160_1 = require("@noble/hashes/ripemd160");
const sha256_1 = require("@noble/hashes/sha256");
const index_js_1 = require("../../address/index.js");
const index_js_2 = require("../../bytes/index.js");
const index_js_3 = require("../../ckb/index.js");
const index_js_4 = require("../../client/index.js");
const index_js_5 = require("../../hex/index.js");
const index_js_6 = require("../../num/index.js");
const index_js_7 = require("../signer/index.js");
/**
 * An abstract class extending the Signer class for Bitcoin-like signing operations.
 * This class provides methods to get Bitcoin account, public key, and internal address,
 * as well as signing transactions.
 * @public
 */
class SignerBtc extends index_js_7.Signer {
    get type() {
        return index_js_7.SignerType.BTC;
    }
    get signType() {
        return index_js_7.SignerSignType.BtcEcdsa;
    }
    /**
     * Gets the internal address, which is the Bitcoin account in this case.
     *
     * @returns A promise that resolves to a string representing the internal address.
     */
    async getInternalAddress() {
        return this.getBtcAccount();
    }
    /**
     * Gets the identity, which is the Bitcoin public key in this case.
     *
     * @returns A promise that resolves to a string representing the identity
     */
    async getIdentity() {
        return (0, index_js_5.hexFrom)(await this.getBtcPublicKey()).slice(2);
    }
    /**
     * Gets an array of Address objects representing the known script addresses for the signer.
     *
     * @returns A promise that resolves to an array of Address objects.
     */
    async getAddressObjs() {
        const publicKey = await this.getBtcPublicKey();
        const hash = (0, ripemd160_1.ripemd160)((0, sha256_1.sha256)((0, index_js_2.bytesFrom)(publicKey)));
        return [
            await index_js_1.Address.fromKnownScript(this.client, index_js_4.KnownScript.OmniLock, (0, index_js_5.hexFrom)([0x04, ...hash, 0x00])),
        ];
    }
    /**
     * prepare a transaction before signing. This method is not implemented and should be overridden by subclasses.
     *
     * @param txLike - The transaction to prepare, represented as a TransactionLike object.
     * @returns A promise that resolves to the prepared Transaction object.
     */
    async prepareTransaction(txLike) {
        const tx = index_js_3.Transaction.from(txLike);
        const { script } = await this.getRecommendedAddressObj();
        await tx.addCellDepsOfKnownScripts(this.client, index_js_4.KnownScript.OmniLock);
        await tx.prepareSighashAllWitness(script, 85, this.client);
        return tx;
    }
    /**
     * Signs a transaction without modifying it.
     *
     * @param txLike - The transaction to sign, represented as a TransactionLike object.
     * @returns A promise that resolves to a signed Transaction object.
     */
    async signOnlyTransaction(txLike) {
        const tx = index_js_3.Transaction.from(txLike);
        const { script } = await this.getRecommendedAddressObj();
        const info = await tx.getSignHashInfo(script, this.client);
        if (!info) {
            return tx;
        }
        const signature = (0, index_js_2.bytesFrom)(await this.signMessageRaw(`CKB (Bitcoin Layer) transaction: ${info.message}`), "base64");
        signature[0] = 31 + ((signature[0] - 27) % 4);
        const witness = index_js_3.WitnessArgs.fromBytes(tx.witnesses[info.position]);
        witness.lock = (0, index_js_5.hexFrom)((0, index_js_2.bytesConcat)((0, index_js_6.numToBytes)(5 * 4 + signature.length, 4), (0, index_js_6.numToBytes)(4 * 4, 4), (0, index_js_6.numToBytes)(5 * 4 + signature.length, 4), (0, index_js_6.numToBytes)(5 * 4 + signature.length, 4), (0, index_js_6.numToBytes)(signature.length, 4), signature));
        tx.setWitnessArgsAt(info.position, witness);
        return tx;
    }
}
exports.SignerBtc = SignerBtc;

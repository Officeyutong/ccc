"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignerNostr = void 0;
const bech32_1 = require("bech32");
const index_js_1 = require("../../address/index.js");
const index_js_2 = require("../../bytes/index.js");
const index_js_3 = require("../../ckb/index.js");
const index_js_4 = require("../../client/index.js");
const index_js_5 = require("../../hasher/index.js");
const index_js_6 = require("../../hex/index.js");
const index_js_7 = require("../signer/index.js");
const verify_js_1 = require("./verify.js");
/**
 * @public
 */
class SignerNostr extends index_js_7.Signer {
    get type() {
        return index_js_7.SignerType.Nostr;
    }
    get signType() {
        return index_js_7.SignerSignType.NostrEvent;
    }
    /**
     * Sign a message.
     *
     * @returns A promise that resolves to the signature.
     */
    async signMessageRaw(message) {
        return (0, index_js_6.hexFrom)((await this.signNostrEvent((0, verify_js_1.buildNostrEventFromMessage)(message))).sig);
    }
    /**
     * Gets the internal address, which is the EVM account in this case.
     *
     * @returns A promise that resolves to a string representing the internal address.
     */
    async getInternalAddress() {
        return bech32_1.bech32.encode("npub", bech32_1.bech32.toWords((0, index_js_2.bytesFrom)(await this.getNostrPublicKey())));
    }
    /**
     * Gets an array of Address objects representing the known script addresses for the signer.
     *
     * @returns A promise that resolves to an array of Address objects.
     */
    async getAddressObjs() {
        const publicKey = await this.getNostrPublicKey();
        return [
            await index_js_1.Address.fromKnownScript(this.client, index_js_4.KnownScript.NostrLock, (0, index_js_6.hexFrom)((0, index_js_2.bytesConcat)([0x00], (0, index_js_5.hashCkb)(publicKey).slice(0, 42)))),
        ];
    }
    /**
     * prepare a transaction before signing.
     *
     * @param txLike - The transaction to prepare, represented as a TransactionLike object.
     * @returns A promise that resolves to the prepared Transaction object.
     */
    async prepareTransaction(txLike) {
        const tx = index_js_3.Transaction.from(txLike);
        const { script } = await this.getRecommendedAddressObj();
        await tx.addCellDepsOfKnownScripts(this.client, index_js_4.KnownScript.NostrLock);
        await tx.prepareSighashAllWitness(script, 572, this.client);
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
        const signedEvent = (0, index_js_2.bytesFrom)(JSON.stringify(await this.signNostrEvent({
            pubkey: (await this.getNostrPublicKey()).slice(2),
            tags: [[SignerNostr.CKB_SIG_HASH_ALL_TAG, info.message.slice(2)]],
            created_at: Math.floor(Date.now() / 1000),
            kind: SignerNostr.CKB_UNLOCK_EVENT_KIND,
            content: SignerNostr.CKB_UNLOCK_EVENT_CONTENT,
        })), "utf8");
        const witness = index_js_3.WitnessArgs.fromBytes(tx.witnesses[info.position]);
        witness.lock = (0, index_js_6.hexFrom)(signedEvent);
        tx.setWitnessArgsAt(info.position, witness);
        return tx;
    }
}
exports.SignerNostr = SignerNostr;
SignerNostr.CKB_SIG_HASH_ALL_TAG = "ckb_sighash_all";
SignerNostr.CKB_UNLOCK_EVENT_KIND = 23334;
SignerNostr.CKB_UNLOCK_EVENT_CONTENT = "Signing a CKB transaction\n\nIMPORTANT: Please verify the integrity and authenticity of connected Nostr client before signing this message\n";

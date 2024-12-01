import { bech32 } from "bech32";
import { Address } from "../../address/index.js";
import { bytesConcat, bytesFrom } from "../../bytes/index.js";
import { Transaction, WitnessArgs } from "../../ckb/index.js";
import { KnownScript } from "../../client/index.js";
import { hashCkb } from "../../hasher/index.js";
import { hexFrom } from "../../hex/index.js";
import { Signer, SignerSignType, SignerType } from "../signer/index.js";
import { buildNostrEventFromMessage } from "./verify.js";
/**
 * @public
 */
export class SignerNostr extends Signer {
    get type() {
        return SignerType.Nostr;
    }
    get signType() {
        return SignerSignType.NostrEvent;
    }
    /**
     * Sign a message.
     *
     * @returns A promise that resolves to the signature.
     */
    async signMessageRaw(message) {
        return hexFrom((await this.signNostrEvent(buildNostrEventFromMessage(message))).sig);
    }
    /**
     * Gets the internal address, which is the EVM account in this case.
     *
     * @returns A promise that resolves to a string representing the internal address.
     */
    async getInternalAddress() {
        return bech32.encode("npub", bech32.toWords(bytesFrom(await this.getNostrPublicKey())));
    }
    /**
     * Gets an array of Address objects representing the known script addresses for the signer.
     *
     * @returns A promise that resolves to an array of Address objects.
     */
    async getAddressObjs() {
        const publicKey = await this.getNostrPublicKey();
        return [
            await Address.fromKnownScript(this.client, KnownScript.NostrLock, hexFrom(bytesConcat([0x00], hashCkb(publicKey).slice(0, 42)))),
        ];
    }
    /**
     * prepare a transaction before signing.
     *
     * @param txLike - The transaction to prepare, represented as a TransactionLike object.
     * @returns A promise that resolves to the prepared Transaction object.
     */
    async prepareTransaction(txLike) {
        const tx = Transaction.from(txLike);
        const { script } = await this.getRecommendedAddressObj();
        await tx.addCellDepsOfKnownScripts(this.client, KnownScript.NostrLock);
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
        const tx = Transaction.from(txLike);
        const { script } = await this.getRecommendedAddressObj();
        const info = await tx.getSignHashInfo(script, this.client);
        if (!info) {
            return tx;
        }
        const signedEvent = bytesFrom(JSON.stringify(await this.signNostrEvent({
            pubkey: (await this.getNostrPublicKey()).slice(2),
            tags: [[SignerNostr.CKB_SIG_HASH_ALL_TAG, info.message.slice(2)]],
            created_at: Math.floor(Date.now() / 1000),
            kind: SignerNostr.CKB_UNLOCK_EVENT_KIND,
            content: SignerNostr.CKB_UNLOCK_EVENT_CONTENT,
        })), "utf8");
        const witness = WitnessArgs.fromBytes(tx.witnesses[info.position]);
        witness.lock = hexFrom(signedEvent);
        tx.setWitnessArgsAt(info.position, witness);
        return tx;
    }
}
SignerNostr.CKB_SIG_HASH_ALL_TAG = "ckb_sighash_all";
SignerNostr.CKB_UNLOCK_EVENT_KIND = 23334;
SignerNostr.CKB_UNLOCK_EVENT_CONTENT = "Signing a CKB transaction\n\nIMPORTANT: Please verify the integrity and authenticity of connected Nostr client before signing this message\n";

import { Address } from "../../address/index.js";
import { BytesLike } from "../../bytes/index.js";
import { Transaction, TransactionLike } from "../../ckb/index.js";
import { Hex } from "../../hex/index.js";
import { Signer, SignerSignType, SignerType } from "../signer/index.js";
/**
 * @public
 */
export interface NostrEvent {
    id?: string;
    pubkey?: string;
    sig?: string;
    created_at: number;
    kind: number;
    tags: string[][];
    content: string;
}
/**
 * @public
 */
export declare abstract class SignerNostr extends Signer {
    static CKB_SIG_HASH_ALL_TAG: string;
    static CKB_UNLOCK_EVENT_KIND: number;
    static CKB_UNLOCK_EVENT_CONTENT: string;
    get type(): SignerType;
    get signType(): SignerSignType;
    /**
     * Gets the Nostr public key associated with the signer.
     *
     * @returns A promise that resolves to a string representing the Nostr public key.
     */
    abstract getNostrPublicKey(): Promise<Hex>;
    /**
     * Sign a nostr event.
     *
     * @returns A promise that resolves to the signed event.
     */
    abstract signNostrEvent(event: NostrEvent): Promise<Required<NostrEvent>>;
    /**
     * Sign a message.
     *
     * @returns A promise that resolves to the signature.
     */
    signMessageRaw(message: string | BytesLike): Promise<Hex>;
    /**
     * Gets the internal address, which is the EVM account in this case.
     *
     * @returns A promise that resolves to a string representing the internal address.
     */
    getInternalAddress(): Promise<string>;
    /**
     * Gets an array of Address objects representing the known script addresses for the signer.
     *
     * @returns A promise that resolves to an array of Address objects.
     */
    getAddressObjs(): Promise<Address[]>;
    /**
     * prepare a transaction before signing.
     *
     * @param txLike - The transaction to prepare, represented as a TransactionLike object.
     * @returns A promise that resolves to the prepared Transaction object.
     */
    prepareTransaction(txLike: TransactionLike): Promise<Transaction>;
    /**
     * Signs a transaction without modifying it.
     *
     * @param txLike - The transaction to sign, represented as a TransactionLike object.
     * @returns A promise that resolves to a signed Transaction object.
     */
    signOnlyTransaction(txLike: TransactionLike): Promise<Transaction>;
}
//# sourceMappingURL=signerNostr.d.ts.map
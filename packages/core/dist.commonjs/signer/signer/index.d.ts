import { Address } from "../../address/index.js";
import { ClientCollectableSearchKeyFilterLike } from "../../advancedBarrel.js";
import { BytesLike } from "../../bytes/index.js";
import { Cell, Transaction, TransactionLike } from "../../ckb/index.js";
import { Client, ClientFindTransactionsGroupedResponse, ClientFindTransactionsResponse } from "../../client/index.js";
import { Hex } from "../../hex/index.js";
import { Num } from "../../num/index.js";
/**
 * @public
 */
export declare enum SignerSignType {
    Unknown = "Unknown",
    BtcEcdsa = "BtcEcdsa",
    EvmPersonal = "EvmPersonal",
    JoyId = "JoyId",
    NostrEvent = "NostrEvent",
    CkbSecp256k1 = "CkbSecp256k1"
}
/**
 * An enumeration of signer display types in wallet.
 * @public
 */
export declare enum SignerType {
    EVM = "EVM",
    BTC = "BTC",
    CKB = "CKB",
    Nostr = "Nostr"
}
/**
 * @public
 */
export type NetworkPreference = {
    addressPrefix: string;
    signerType: SignerType;
    /**
     * Wallet signers should check if the wallet is using preferred networks.
     * If not, try to switch to the first preferred network.
     * If non preferred, let users choose what they want.
     * BTC: // They made a mess...
     *   btc
     *   btcTestnet
     *   btcTestnet4 // UTXO Global
     *   btcSignet // OKX & UTXO Global
     *   fractalBtc // UniSat
     */
    network: string;
};
/**
 * @public
 */
export declare class Signature {
    signature: string;
    identity: string;
    signType: SignerSignType;
    constructor(signature: string, identity: string, signType: SignerSignType);
}
/**
 * An abstract class representing a generic signer.
 * This class provides methods to connect, get addresses, and sign transactions.
 * @public
 */
export declare abstract class Signer {
    protected client_: Client;
    constructor(client_: Client);
    abstract get type(): SignerType;
    abstract get signType(): SignerSignType;
    get client(): Client;
    matchNetworkPreference(preferences: NetworkPreference[], currentNetwork: string | undefined): NetworkPreference | undefined;
    static verifyMessage(message: string | BytesLike, signature: Signature): Promise<boolean>;
    /**
     * Connects to the signer.
     *
     * @returns A promise that resolves when the connection is complete.
     */
    abstract connect(): Promise<void>;
    /**
     * Register a listener to be called when this signer is replaced.
     *
     * @returns A function for unregister
     */
    onReplaced(_: () => void): () => void;
    /**
     * Disconnects to the signer.
     *
     * @returns A promise that resolves when the signer is disconnected.
     */
    disconnect(): Promise<void>;
    /**
     * Check if the signer is connected.
     *
     * @returns A promise that resolves the connection status.
     */
    abstract isConnected(): Promise<boolean>;
    /**
     * Gets the internal address associated with the signer.
     *
     * @returns A promise that resolves to a string representing the internal address.
     */
    abstract getInternalAddress(): Promise<string>;
    /**
     * Gets the identity for verifying signature, usually it's address
     *
     * @returns A promise that resolves to a string representing the identity
     */
    getIdentity(): Promise<string>;
    /**
     * Gets an array of Address objects associated with the signer.
     *
     * @returns A promise that resolves to an array of Address objects.
     */
    abstract getAddressObjs(): Promise<Address[]>;
    /**
     * Gets the recommended Address object for the signer.
     *
     * @param _preference - Optional preference parameter.
     * @returns A promise that resolves to the recommended Address object.
     */
    getRecommendedAddressObj(_preference?: unknown): Promise<Address>;
    /**
     * Gets the recommended address for the signer as a string.
     *
     * @param preference - Optional preference parameter.
     * @returns A promise that resolves to the recommended address as a string.
     */
    getRecommendedAddress(preference?: unknown): Promise<string>;
    /**
     * Gets an array of addresses associated with the signer as strings.
     *
     * @returns A promise that resolves to an array of addresses as strings.
     */
    getAddresses(): Promise<string[]>;
    /**
     * Find cells of this signer
     *
     * @returns A async generator that yields all matches cells
     */
    findCells(filter: ClientCollectableSearchKeyFilterLike, withData?: boolean | null, order?: "asc" | "desc", limit?: number): AsyncGenerator<Cell>;
    /**
     * Find transactions of this signer
     *
     * @returns A async generator that yields all matches transactions
     */
    findTransactions(filter: ClientCollectableSearchKeyFilterLike, groupByTransaction?: false | null, order?: "asc" | "desc", limit?: number): AsyncGenerator<ClientFindTransactionsResponse["transactions"][0]>;
    /**
     * Find transactions of this signer
     *
     * @returns A async generator that yields all matches transactions
     */
    findTransactions(filter: ClientCollectableSearchKeyFilterLike, groupByTransaction: true, order?: "asc" | "desc", limit?: number): AsyncGenerator<ClientFindTransactionsGroupedResponse["transactions"][0]>;
    /**
     * Find transactions of this signer
     *
     * @returns A async generator that yields all matches transactions
     */
    findTransactions(filter: ClientCollectableSearchKeyFilterLike, groupByTransaction?: boolean | null, order?: "asc" | "desc", limit?: number): AsyncGenerator<ClientFindTransactionsResponse["transactions"][0] | ClientFindTransactionsGroupedResponse["transactions"][0]>;
    /**
     * Gets balance of all addresses
     *
     * @returns A promise that resolves to the balance
     */
    getBalance(): Promise<Num>;
    /**
     * Signs a message.
     *
     * @param message - The message to sign, as a string or BytesLike object.
     * @returns A promise that resolves to the signature info.
     * @throws Will throw an error if not implemented.
     */
    signMessage(message: string | BytesLike): Promise<Signature>;
    /**
     * Signs a message and returns signature only. This method is not implemented and should be overridden by subclasses.
     *
     * @param _ - The message to sign, as a string or BytesLike object.
     * @returns A promise that resolves to the signature as a string.
     * @throws Will throw an error if not implemented.
     */
    signMessageRaw(_: string | BytesLike): Promise<string>;
    /**
     * Verify a signature.
     *
     * @param message - The original message.
     * @param signature - The signature to verify.
     * @returns A promise that resolves to the verification result.
     * @throws Will throw an error if not implemented.
     */
    verifyMessage(message: string | BytesLike, signature: string | Signature): Promise<boolean>;
    /**
     * Sends a transaction after signing it.
     *
     * @param tx - The transaction to send, represented as a TransactionLike object.
     * @returns A promise that resolves to the transaction hash as a Hex string.
     */
    sendTransaction(tx: TransactionLike): Promise<Hex>;
    /**
     * Signs a transaction.
     *
     * @param tx - The transaction to sign, represented as a TransactionLike object.
     * @returns A promise that resolves to the signed Transaction object.
     */
    signTransaction(tx: TransactionLike): Promise<Transaction>;
    /**
     * prepare a transaction before signing. This method is not implemented and should be overridden by subclasses.
     *
     * @param _ - The transaction to prepare, represented as a TransactionLike object.
     * @returns A promise that resolves to the prepared Transaction object.
     * @throws Will throw an error if not implemented.
     */
    prepareTransaction(_: TransactionLike): Promise<Transaction>;
    /**
     * Signs a transaction without preparing information for it. This method is not implemented and should be overridden by subclasses.
     *
     * @param _ - The transaction to sign, represented as a TransactionLike object.
     * @returns A promise that resolves to the signed Transaction object.
     * @throws Will throw an error if not implemented.
     */
    signOnlyTransaction(_: TransactionLike): Promise<Transaction>;
}
/**
 * A class representing information about a signer, including its type and the signer instance.
 * @public
 */
export declare class SignerInfo {
    name: string;
    signer: Signer;
    constructor(name: string, signer: Signer);
}
/**
 * Represents a wallet with a name, icon, and an array of signer information.
 * @public
 */
export type Wallet = {
    name: string;
    icon: string;
};
//# sourceMappingURL=index.d.ts.map
import { hexFrom } from "../../hex/index.js";
import { SignerBtc } from "./signerBtc.js";
/**
 * A class extending SignerBtc that provides read-only access to a Bitcoin public key and account.
 * This class does not support signing operations.
 * @public
 */
export class SignerBtcPublicKeyReadonly extends SignerBtc {
    /**
     * Creates an instance of SignerBtcPublicKeyReadonly.
     *
     * @param client - The client instance used for communication.
     * @param account - The Bitcoin account associated with the signer.
     * @param publicKey - The public key associated with the signer.
     */
    constructor(client, account, publicKey) {
        super(client);
        this.account = account;
        this.publicKey = hexFrom(publicKey);
    }
    /**
     * Connects to the client. This implementation does nothing as the class is read-only.
     *
     * @returns A promise that resolves when the connection is complete.
     */
    async connect() { }
    /**
     * Check if the signer is connected.
     *
     * @returns A promise that resolves the connection status.
     */
    async isConnected() {
        return true;
    }
    /**
     * Gets the Bitcoin account associated with the signer.
     *
     * @returns A promise that resolves to a string representing the Bitcoin account.
     *
     * @example
     * ```typescript
     * const account = await signer.getBtcAccount(); // Outputs the Bitcoin account
     * ```
     */
    async getBtcAccount() {
        return this.account;
    }
    /**
     * Gets the Bitcoin public key associated with the signer.
     *
     * @returns A promise that resolves to a Hex string representing the Bitcoin public key.
     *
     * @example
     * ```typescript
     * const publicKey = await signer.getBtcPublicKey(); // Outputs the Bitcoin public key
     * ```
     */
    async getBtcPublicKey() {
        return this.publicKey;
    }
}

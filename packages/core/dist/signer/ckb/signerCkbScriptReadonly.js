import { Address } from "../../address/index.js";
import { Script } from "../../ckb/index.js";
import { Signer, SignerSignType, SignerType } from "../signer/index.js";
/**
 * A class extending Signer that provides read-only access to a CKB script.
 * This class does not support signing operations.
 * @public
 */
export class SignerCkbScriptReadonly extends Signer {
    get type() {
        return SignerType.CKB;
    }
    get signType() {
        return SignerSignType.Unknown;
    }
    /**
     * Creates an instance of SignerCkbScriptReadonly.
     *
     * @param client - The client instance used for communication.
     * @param script - The script associated with the signer.
     */
    constructor(client, script) {
        super(client);
        this.script = Script.from(script);
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
     * Gets the internal address for the script.
     *
     * @returns A promise that resolves to a string representing the internal address.
     *
     * @example
     * ```typescript
     * const internalAddress = await signer.getInternalAddress(); // Outputs the internal address
     * ```
     */
    async getInternalAddress() {
        return this.getRecommendedAddress();
    }
    /**
     * Gets an array of Address objects representing the script address.
     *
     * @returns A promise that resolves to an array of Address objects.
     *
     * @example
     * ```typescript
     * const addressObjs = await signer.getAddressObjs(); // Outputs the array of Address objects
     * ```
     */
    async getAddressObjs() {
        return [Address.fromScript(this.script, this.client)];
    }
}

import { Address } from "../../address/index.js";
import { ScriptLike } from "../../ckb/index.js";
import { Client } from "../../client/index.js";
import { Signer, SignerSignType, SignerType } from "../signer/index.js";
/**
 * A class extending Signer that provides read-only access to a CKB script.
 * This class does not support signing operations.
 * @public
 */
export declare class SignerCkbScriptReadonly extends Signer {
    get type(): SignerType;
    get signType(): SignerSignType;
    private readonly script;
    /**
     * Creates an instance of SignerCkbScriptReadonly.
     *
     * @param client - The client instance used for communication.
     * @param script - The script associated with the signer.
     */
    constructor(client: Client, script: ScriptLike);
    /**
     * Connects to the client. This implementation does nothing as the class is read-only.
     *
     * @returns A promise that resolves when the connection is complete.
     */
    connect(): Promise<void>;
    /**
     * Check if the signer is connected.
     *
     * @returns A promise that resolves the connection status.
     */
    isConnected(): Promise<boolean>;
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
    getInternalAddress(): Promise<string>;
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
    getAddressObjs(): Promise<Address[]>;
}
//# sourceMappingURL=signerCkbScriptReadonly.d.ts.map
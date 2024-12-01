import { Address } from "../../address/index.js";
import { bytesFrom } from "../../bytes/index.js";
import { Script, Transaction } from "../../ckb/index.js";
import { KnownScript } from "../../client/index.js";
import { hashCkb } from "../../hasher/index.js";
import { hexFrom } from "../../hex/index.js";
import { Signer, SignerSignType, SignerType } from "../signer/index.js";
/**
 * @public
 */
export class SignerCkbPublicKey extends Signer {
    get type() {
        return SignerType.CKB;
    }
    get signType() {
        return SignerSignType.CkbSecp256k1;
    }
    constructor(client, publicKey) {
        super(client);
        this.publicKey = hexFrom(publicKey);
        if (bytesFrom(this.publicKey).length !== 33) {
            throw new Error("Public key must be 33 bytes!");
        }
    }
    async connect() { }
    async isConnected() {
        return true;
    }
    async getInternalAddress() {
        return this.getRecommendedAddress();
    }
    async getIdentity() {
        return this.publicKey;
    }
    async getAddressObjSecp256k1() {
        return Address.fromKnownScript(this.client, KnownScript.Secp256k1Blake160, bytesFrom(hashCkb(this.publicKey)).slice(0, 20));
    }
    async getRecommendedAddressObj(_preference) {
        return this.getAddressObjSecp256k1();
    }
    async getAddressObjs() {
        const secp256k1 = await this.getAddressObjSecp256k1();
        const addresses = [];
        let count = 0;
        for await (const cell of this.client.findCells({
            script: await Script.fromKnownScript(this.client, KnownScript.AnyoneCanPay, secp256k1.script.args),
            scriptType: "lock",
            scriptSearchMode: "prefix",
            withData: false,
        })) {
            if (count >= 10) {
                break;
            }
            count += 1;
            if (addresses.some(({ script }) => script.eq(cell.cellOutput.lock))) {
                continue;
            }
            addresses.push(Address.from({
                prefix: this.client.addressPrefix,
                script: cell.cellOutput.lock,
            }));
        }
        return [secp256k1, ...addresses];
    }
    async getRelatedScripts(txLike) {
        const tx = Transaction.from(txLike);
        const secp256k1 = await this.getAddressObjSecp256k1();
        const acp = await Script.fromKnownScript(this.client, KnownScript.AnyoneCanPay, secp256k1.script.args);
        const scripts = [];
        for (const input of tx.inputs) {
            await input.completeExtraInfos(this.client);
            if (!input.cellOutput) {
                throw new Error("Unable to complete input");
            }
            const { lock } = input.cellOutput;
            if (scripts.some(({ script }) => script.eq(lock))) {
                continue;
            }
            if (lock.eq(secp256k1.script)) {
                scripts.push({
                    script: lock,
                    cellDeps: (await this.client.getKnownScript(KnownScript.Secp256k1Blake160)).cellDeps,
                });
            }
            else if (lock.codeHash === acp.codeHash &&
                lock.hashType === acp.hashType &&
                lock.args.startsWith(acp.args)) {
                scripts.push({
                    script: lock,
                    cellDeps: (await this.client.getKnownScript(KnownScript.AnyoneCanPay))
                        .cellDeps,
                });
            }
        }
        return scripts;
    }
    async prepareTransaction(txLike) {
        const tx = Transaction.from(txLike);
        await Promise.all((await this.getRelatedScripts(tx)).map(async ({ script, cellDeps }) => {
            await tx.prepareSighashAllWitness(script, 65, this.client);
            await tx.addCellDepInfos(this.client, cellDeps);
        }));
        return tx;
    }
}

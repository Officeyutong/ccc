"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignerCkbPublicKey = void 0;
const index_js_1 = require("../../address/index.js");
const index_js_2 = require("../../bytes/index.js");
const index_js_3 = require("../../ckb/index.js");
const index_js_4 = require("../../client/index.js");
const index_js_5 = require("../../hasher/index.js");
const index_js_6 = require("../../hex/index.js");
const index_js_7 = require("../signer/index.js");
/**
 * @public
 */
class SignerCkbPublicKey extends index_js_7.Signer {
    get type() {
        return index_js_7.SignerType.CKB;
    }
    get signType() {
        return index_js_7.SignerSignType.CkbSecp256k1;
    }
    constructor(client, publicKey) {
        super(client);
        this.publicKey = (0, index_js_6.hexFrom)(publicKey);
        if ((0, index_js_2.bytesFrom)(this.publicKey).length !== 33) {
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
        return index_js_1.Address.fromKnownScript(this.client, index_js_4.KnownScript.Secp256k1Blake160, (0, index_js_2.bytesFrom)((0, index_js_5.hashCkb)(this.publicKey)).slice(0, 20));
    }
    async getRecommendedAddressObj(_preference) {
        return this.getAddressObjSecp256k1();
    }
    async getAddressObjs() {
        const secp256k1 = await this.getAddressObjSecp256k1();
        const addresses = [];
        let count = 0;
        for await (const cell of this.client.findCells({
            script: await index_js_3.Script.fromKnownScript(this.client, index_js_4.KnownScript.AnyoneCanPay, secp256k1.script.args),
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
            addresses.push(index_js_1.Address.from({
                prefix: this.client.addressPrefix,
                script: cell.cellOutput.lock,
            }));
        }
        return [secp256k1, ...addresses];
    }
    async getRelatedScripts(txLike) {
        const tx = index_js_3.Transaction.from(txLike);
        const secp256k1 = await this.getAddressObjSecp256k1();
        const acp = await index_js_3.Script.fromKnownScript(this.client, index_js_4.KnownScript.AnyoneCanPay, secp256k1.script.args);
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
                    cellDeps: (await this.client.getKnownScript(index_js_4.KnownScript.Secp256k1Blake160)).cellDeps,
                });
            }
            else if (lock.codeHash === acp.codeHash &&
                lock.hashType === acp.hashType &&
                lock.args.startsWith(acp.args)) {
                scripts.push({
                    script: lock,
                    cellDeps: (await this.client.getKnownScript(index_js_4.KnownScript.AnyoneCanPay))
                        .cellDeps,
                });
            }
        }
        return scripts;
    }
    async prepareTransaction(txLike) {
        const tx = index_js_3.Transaction.from(txLike);
        await Promise.all((await this.getRelatedScripts(tx)).map(async ({ script, cellDeps }) => {
            await tx.prepareSighashAllWitness(script, 65, this.client);
            await tx.addCellDepInfos(this.client, cellDeps);
        }));
        return tx;
    }
}
exports.SignerCkbPublicKey = SignerCkbPublicKey;

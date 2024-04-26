import { Address } from "../address";
import { BytesLike } from "../bytes";
import { Transaction } from "../ckb";
import { Client } from "../client";
import { Hex } from "../hex";

export abstract class Signer {
  constructor(public readonly client: Client) {}

  abstract connect(): Promise<void>;

  abstract getInternalAddress(): Promise<string>;

  abstract getAddressObjs(): Promise<Address[]>;
  async getRecommendedAddressObj(_preference?: unknown): Promise<Address> {
    return (await this.getAddressObjs())[0];
  }

  async getRecommendedAddress(preference?: unknown): Promise<string> {
    return (await this.getRecommendedAddressObj(preference)).toString();
  }
  async getAddresses(): Promise<string[]> {
    return this.getAddressObjs().then((addresses) =>
      addresses.map((address) => address.toString()),
    );
  }

  abstract signMessage(message: string | BytesLike): Promise<Hex>;

  async sendTransaction(tx: Transaction): Promise<Hex> {
    return this.client.sendTransaction(await this.signTransaction(tx));
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    return this.signOnlyTransaction(tx);
  }

  abstract signOnlyTransaction(tx: Transaction): Promise<Transaction>;
}

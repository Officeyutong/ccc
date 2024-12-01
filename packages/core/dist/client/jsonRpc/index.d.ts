import { Cell, OutPointLike, TransactionLike } from "../../ckb/index.js";
import { Hex, HexLike } from "../../hex/index.js";
import { Num, NumLike } from "../../num/index.js";
import { ClientCache } from "../cache/index.js";
import { Client } from "../client.js";
import { ClientFindCellsResponse, ClientIndexerSearchKeyLike, ClientTransactionResponse, OutputsValidator } from "../clientTypes.js";
import { JsonRpcPayload } from "../transports/advanced.js";
/**
 * An abstract class implementing JSON-RPC client functionality for a specific URL and timeout.
 * Provides methods for sending transactions and building JSON-RPC payloads.
 */
export declare abstract class ClientJsonRpc extends Client {
    private readonly url_;
    private id;
    private readonly transport;
    /**
     * Creates an instance of ClientJsonRpc.
     *
     * @param url_ - The URL of the JSON-RPC server.
     * @param timeout - The timeout for requests in milliseconds
     */
    constructor(url_: string, config?: {
        timeout?: number;
        cache?: ClientCache;
    });
    /**
     * Returns the URL of the JSON-RPC server.
     *
     * @returns The URL of the JSON-RPC server.
     */
    get url(): string;
    /**
     * Get fee rate statistics
     *
     * @returns Fee rate statistics
     */
    getFeeRateStatistics: Client["getFeeRateStatistics"];
    /**
     * Get tip block number
     *
     * @returns Tip block number
     */
    getTip: () => Promise<Num>;
    /**
     * Get tip block header
     *
     * @param verbosity - result format which allows 0 and 1. (Optional, the default is 1.)
     * @returns BlockHeader
     */
    getTipHeader: Client["getTipHeader"];
    /**
     * Get block by block number
     *
     * @param blockNumber - The block number.
     * @param verbosity - result format which allows 0 and 2. (Optional, the default is 2.)
     * @param withCycles - whether the return cycles of block transactions. (Optional, default false.)
     * @returns Block
     */
    getBlockByNumber: Client["getBlockByNumber"];
    /**
     * Get block by block hash
     *
     * @param blockHash - The block hash.
     * @param verbosity - result format which allows 0 and 2. (Optional, the default is 2.)
     * @param withCycles - whether the return cycles of block transactions. (Optional, default false.)
     * @returns Block
     */
    getBlockByHash: Client["getBlockByHash"];
    /**
     * Get header by block number
     *
     * @param blockNumber - The block number.
     * @param verbosity - result format which allows 0 and 1. (Optional, the default is 1.)
     * @returns BlockHeader
     */
    getHeaderByNumber: Client["getHeaderByNumber"];
    /**
     * Get header by block hash
     *
     * @param blockHash - The block hash.
     * @param verbosity - result format which allows 0 and 1. (Optional, the default is 1.)
     * @returns BlockHeader
     */
    getHeaderByHash: Client["getHeaderByHash"];
    /**
     * Estimate cycles of a transaction.
     *
     * @param transaction - The transaction to estimate.
     * @returns Consumed cycles
     */
    estimateCycles: Client["estimateCycles"];
    /**
     * Test a transaction.
     *
     * @param transaction - The transaction to test.
     * @param validator - "passthrough": Disable validation. "well_known_scripts_only": Only accept well known scripts in the transaction.
     * @returns Consumed cycles
     */
    sendTransactionDry: Client["sendTransactionDry"];
    /**
     * Send a transaction to node.
     *
     * @param transaction - The transaction to send.
     * @param validator - "passthrough": Disable validation. "well_known_scripts_only": Only accept well known scripts in the transaction.
     * @returns Transaction hash.
     */
    sendTransactionNoCache: (transaction: TransactionLike, validator?: OutputsValidator | undefined) => Promise<Hex>;
    /**
     * Get a transaction from node.
     *
     * @param txHash - The hash of the transaction.
     * @returns The transaction with status.
     */
    getTransactionNoCache: (txHash: HexLike) => Promise<ClientTransactionResponse | undefined>;
    /**
     * Get a live cell from node.
     *
     * @param outPoint - The out point of the cell.
     * @param withData - Include data in the response.
     * @param includeTxPool - Include cells in the tx pool.
     * @returns The cell
     */
    getCellLiveNoCache(outPoint: OutPointLike, withData?: boolean | null, includeTxPool?: boolean | null): Promise<Cell | undefined>;
    /**
     * find cells from node.
     *
     * @param key - The search key of cells.
     * @param order - The order of cells.
     * @param limit - The max return size of cells.
     * @param after - Pagination parameter.
     * @returns The found cells.
     */
    findCellsPagedNoCache: (key: ClientIndexerSearchKeyLike, order?: "asc" | "desc", limit?: NumLike, after?: string) => Promise<ClientFindCellsResponse>;
    /**
     * find transactions from node.
     *
     * @param key - The search key of transactions.
     * @param order - The order of transactions.
     * @param limit - The max return size of transactions.
     * @param after - Pagination parameter.
     * @returns The found transactions.
     */
    findTransactionsPaged: Client["findTransactionsPaged"];
    /**
     * get cells capacity from node.
     *
     * @param key - The search key of cells.
     * @returns The sum of cells capacity.
     */
    getCellsCapacity: (key: ClientIndexerSearchKeyLike) => Promise<Num>;
    /**
     * Builds a sender function for a JSON-RPC method.
     *
     * @param rpcMethod - The JSON-RPC method.
     * @param inTransformers - An array of input transformers.
     * @param outTransformer - An output transformer function.
     * @returns A function that sends a JSON-RPC request with the given method and transformed parameters.
     */
    buildSender(rpcMethod: string, inTransformers: (((_: any) => unknown) | undefined)[], outTransformer?: (_: any) => unknown): (...req: unknown[]) => Promise<unknown>;
    /**
     * Sends a JSON-RPC request to the server.
     *
     * @param payload - The JSON-RPC payload to send.
     * @returns The result of the JSON-RPC request.
     *
     * @throws Will throw an error if the response ID does not match the request ID, or if the response contains an error.
     */
    send(payload: JsonRpcPayload): Promise<unknown>;
    /**
     * Builds a JSON-RPC payload for the given method and parameters.
     *
     * @param method - The JSON-RPC method name.
     * @param req - The parameters for the JSON-RPC method.
     * @returns The JSON-RPC payload.
     */
    buildPayload(method: string, req: unknown[]): JsonRpcPayload;
}
//# sourceMappingURL=index.d.ts.map
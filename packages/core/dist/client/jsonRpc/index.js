import { Cell, OutPoint, } from "../../ckb/index.js";
import { hexFrom } from "../../hex/index.js";
import { numFrom, numToHex } from "../../num/index.js";
import { apply } from "../../utils/index.js";
import { Client } from "../client.js";
import { ErrorClientBase, ErrorClientDuplicatedTransaction, ErrorClientRBFRejected, ErrorClientResolveUnknown, ErrorClientVerification, } from "../clientTypes.js";
import { transportFromUri, } from "../transports/advanced.js";
import { JsonRpcTransformers, } from "./advanced.js";
/**
 * Applies a transformation function to a value if the transformer is provided.
 *
 * @param value - The value to be transformed.
 * @param transformer - An optional transformation function.
 * @returns The transformed value if a transformer is provided, otherwise the original value.
 *
 * @example
 * ```typescript
 * const result = transform(5, (x) => x * 2); // Outputs 10
 * const resultWithoutTransformer = transform(5); // Outputs 5
 * ```
 */
function transform(value, transformer) {
    if (transformer) {
        return transformer(value);
    }
    return value;
}
const ERROR_PARSERS = [
    [
        "Resolve\\(Unknown\\(OutPoint\\((0x.*)\\)\\)\\)",
        (error, match) => new ErrorClientResolveUnknown(error, OutPoint.fromBytes(match[1])),
    ],
    [
        "Verification\\(Error { kind: Script, inner: TransactionScriptError { source: (Inputs|Outputs)\\[([0-9]*)\\].(Lock|Type), cause: ValidationFailure: see error code (-?[0-9])* on page https://nervosnetwork\\.github\\.io/ckb-script-error-codes/by-(type|data)-hash/(.*)\\.html",
        (error, match) => new ErrorClientVerification(error, match[3] === "Lock"
            ? "lock"
            : match[1] === "Inputs"
                ? "inputType"
                : "outputType", match[2], Number(match[4]), match[5] === "data" ? "data" : "type", match[6]),
    ],
    [
        "Duplicated\\(Byte32\\((0x.*)\\)\\)",
        (error, match) => new ErrorClientDuplicatedTransaction(error, match[1]),
    ],
    [
        'RBFRejected\\("Tx\'s current fee is ([0-9]*), expect it to >= ([0-9]*) to replace old txs"\\)',
        (error, match) => new ErrorClientRBFRejected(error, match[1], match[2]),
    ],
];
/**
 * An abstract class implementing JSON-RPC client functionality for a specific URL and timeout.
 * Provides methods for sending transactions and building JSON-RPC payloads.
 */
export class ClientJsonRpc extends Client {
    /**
     * Creates an instance of ClientJsonRpc.
     *
     * @param url_ - The URL of the JSON-RPC server.
     * @param timeout - The timeout for requests in milliseconds
     */
    constructor(url_, config) {
        super(config);
        this.url_ = url_;
        this.id = 0;
        /**
         * Get fee rate statistics
         *
         * @returns Fee rate statistics
         */
        this.getFeeRateStatistics = this.buildSender("get_fee_rate_statistics", [(n) => apply(numFrom, n)], ({ mean, median }) => ({
            mean: numFrom(mean),
            median: numFrom(median),
        }));
        /**
         * Get tip block number
         *
         * @returns Tip block number
         */
        this.getTip = this.buildSender("get_tip_block_number", [], numFrom);
        /**
         * Get tip block header
         *
         * @param verbosity - result format which allows 0 and 1. (Optional, the default is 1.)
         * @returns BlockHeader
         */
        this.getTipHeader = this.buildSender("get_tip_header", [], (b) => apply(JsonRpcTransformers.blockHeaderTo, b));
        /**
         * Get block by block number
         *
         * @param blockNumber - The block number.
         * @param verbosity - result format which allows 0 and 2. (Optional, the default is 2.)
         * @param withCycles - whether the return cycles of block transactions. (Optional, default false.)
         * @returns Block
         */
        this.getBlockByNumber = this.buildSender("get_block_by_number", [(v) => numToHex(numFrom(v))], (b) => apply(JsonRpcTransformers.blockTo, b));
        /**
         * Get block by block hash
         *
         * @param blockHash - The block hash.
         * @param verbosity - result format which allows 0 and 2. (Optional, the default is 2.)
         * @param withCycles - whether the return cycles of block transactions. (Optional, default false.)
         * @returns Block
         */
        this.getBlockByHash = this.buildSender("get_block", [hexFrom], (b) => apply(JsonRpcTransformers.blockTo, b));
        /**
         * Get header by block number
         *
         * @param blockNumber - The block number.
         * @param verbosity - result format which allows 0 and 1. (Optional, the default is 1.)
         * @returns BlockHeader
         */
        this.getHeaderByNumber = this.buildSender("get_header_by_number", [(v) => numToHex(numFrom(v))], (b) => apply(JsonRpcTransformers.blockHeaderTo, b));
        /**
         * Get header by block hash
         *
         * @param blockHash - The block hash.
         * @param verbosity - result format which allows 0 and 1. (Optional, the default is 1.)
         * @returns BlockHeader
         */
        this.getHeaderByHash = this.buildSender("get_header", [hexFrom], (b) => apply(JsonRpcTransformers.blockHeaderTo, b));
        /**
         * Estimate cycles of a transaction.
         *
         * @param transaction - The transaction to estimate.
         * @returns Consumed cycles
         */
        this.estimateCycles = this.buildSender("estimate_cycles", [JsonRpcTransformers.transactionFrom], ({ cycles }) => numFrom(cycles));
        /**
         * Test a transaction.
         *
         * @param transaction - The transaction to test.
         * @param validator - "passthrough": Disable validation. "well_known_scripts_only": Only accept well known scripts in the transaction.
         * @returns Consumed cycles
         */
        this.sendTransactionDry = this.buildSender("test_tx_pool_accept", [JsonRpcTransformers.transactionFrom], ({ cycles }) => numFrom(cycles));
        /**
         * Send a transaction to node.
         *
         * @param transaction - The transaction to send.
         * @param validator - "passthrough": Disable validation. "well_known_scripts_only": Only accept well known scripts in the transaction.
         * @returns Transaction hash.
         */
        this.sendTransactionNoCache = this.buildSender("send_transaction", [JsonRpcTransformers.transactionFrom], hexFrom);
        /**
         * Get a transaction from node.
         *
         * @param txHash - The hash of the transaction.
         * @returns The transaction with status.
         */
        this.getTransactionNoCache = this.buildSender("get_transaction", [hexFrom], JsonRpcTransformers.transactionResponseTo);
        /**
         * find cells from node.
         *
         * @param key - The search key of cells.
         * @param order - The order of cells.
         * @param limit - The max return size of cells.
         * @param after - Pagination parameter.
         * @returns The found cells.
         */
        this.findCellsPagedNoCache = this.buildSender("get_cells", [
            JsonRpcTransformers.indexerSearchKeyFrom,
            (order) => order ?? "asc",
            (limit) => numToHex(limit ?? 10),
        ], JsonRpcTransformers.findCellsResponseTo);
        /**
         * find transactions from node.
         *
         * @param key - The search key of transactions.
         * @param order - The order of transactions.
         * @param limit - The max return size of transactions.
         * @param after - Pagination parameter.
         * @returns The found transactions.
         */
        this.findTransactionsPaged = this.buildSender("get_transactions", [
            JsonRpcTransformers.indexerSearchKeyTransactionFrom,
            (order) => order ?? "asc",
            (limit) => numToHex(limit ?? 10),
        ], JsonRpcTransformers.findTransactionsResponseTo);
        /**
         * get cells capacity from node.
         *
         * @param key - The search key of cells.
         * @returns The sum of cells capacity.
         */
        this.getCellsCapacity = this.buildSender("get_cells_capacity", [JsonRpcTransformers.indexerSearchKeyFrom], ({ capacity }) => numFrom(capacity));
        this.transport = transportFromUri(url_, config);
    }
    /**
     * Returns the URL of the JSON-RPC server.
     *
     * @returns The URL of the JSON-RPC server.
     */
    get url() {
        return this.url_;
    }
    /**
     * Get a live cell from node.
     *
     * @param outPoint - The out point of the cell.
     * @param withData - Include data in the response.
     * @param includeTxPool - Include cells in the tx pool.
     * @returns The cell
     */
    getCellLiveNoCache(outPoint, withData, includeTxPool) {
        return this.buildSender("get_live_cell", [JsonRpcTransformers.outPointFrom], ({ cell, }) => apply(({ output, data, }) => Cell.from({
            cellOutput: JsonRpcTransformers.cellOutputTo(output),
            outputData: data?.content ?? "0x",
            outPoint,
        }), cell))(outPoint, withData ?? true, includeTxPool);
    }
    /**
     * Builds a sender function for a JSON-RPC method.
     *
     * @param rpcMethod - The JSON-RPC method.
     * @param inTransformers - An array of input transformers.
     * @param outTransformer - An output transformer function.
     * @returns A function that sends a JSON-RPC request with the given method and transformed parameters.
     */
    buildSender(rpcMethod, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inTransformers, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outTransformer) {
        return async (...req) => {
            const payload = this.buildPayload(rpcMethod, req
                .concat(Array.from(new Array(Math.max(inTransformers.length - req.length, 0))))
                .map((v, i) => transform(v, inTransformers[i])));
            try {
                return transform(await this.send(payload), outTransformer);
            }
            catch (errAny) {
                if (typeof errAny !== "object" ||
                    errAny === null ||
                    !("data" in errAny) ||
                    typeof errAny.data !== "string") {
                    throw errAny;
                }
                const err = errAny;
                for (const [regexp, builder] of ERROR_PARSERS) {
                    const match = err.data.match(regexp);
                    if (match) {
                        throw builder(err, match);
                    }
                }
                throw new ErrorClientBase(err);
            }
        };
    }
    /**
     * Sends a JSON-RPC request to the server.
     *
     * @param payload - The JSON-RPC payload to send.
     * @returns The result of the JSON-RPC request.
     *
     * @throws Will throw an error if the response ID does not match the request ID, or if the response contains an error.
     */
    async send(payload) {
        const res = (await this.transport.request(payload));
        if (res.id !== payload.id) {
            throw new Error(`Id mismatched, got ${res.id}, expected ${payload.id}`);
        }
        if (res.error) {
            throw res.error;
        }
        return res.result;
    }
    /**
     * Builds a JSON-RPC payload for the given method and parameters.
     *
     * @param method - The JSON-RPC method name.
     * @param req - The parameters for the JSON-RPC method.
     * @returns The JSON-RPC payload.
     */
    buildPayload(method, req) {
        return {
            id: this.id++,
            method,
            params: req,
            jsonrpc: "2.0",
        };
    }
}

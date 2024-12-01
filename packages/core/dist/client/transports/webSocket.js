import WebSocket from "isomorphic-ws";
export class TransportWebSocket {
    constructor(url, timeout = 30000) {
        this.url = url;
        this.timeout = timeout;
        this.ongoing = new Map();
    }
    request(data) {
        const socket = (() => {
            if (this.socket &&
                this.socket.readyState !== this.socket.CLOSING &&
                this.socket.readyState !== this.socket.CLOSED &&
                this.openSocket) {
                return this.openSocket;
            }
            const socket = new WebSocket(this.url);
            const onMessage = ({ data }) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const res = JSON.parse(data);
                if (typeof res !== "object" ||
                    res === null ||
                    typeof res.id !== "number") {
                    throw new Error(`Unknown response ${data}`);
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const id = res.id;
                const req = this.ongoing.get(id);
                if (!req) {
                    return;
                }
                const [resolve, _, timeout] = req;
                clearTimeout(timeout);
                this.ongoing.delete(id);
                resolve(res);
            };
            const onClose = () => {
                this.ongoing.forEach(([_, reject, timeout]) => {
                    clearTimeout(timeout);
                    reject(new Error("Connection closed"));
                });
                this.ongoing.clear();
            };
            socket.onclose = onClose;
            socket.onerror = onClose;
            socket.onmessage = onMessage;
            this.socket = socket;
            this.openSocket = new Promise((resolve) => {
                if (socket.readyState === socket.OPEN) {
                    resolve(socket);
                }
                else {
                    socket.onopen = () => {
                        resolve(socket);
                    };
                }
            });
            return this.openSocket;
        })();
        return new Promise((resolve, reject) => {
            const req = [
                resolve,
                reject,
                setTimeout(() => {
                    this.ongoing.delete(data.id);
                    void socket.then((socket) => socket.close());
                    reject(new Error("Request timeout"));
                }, this.timeout),
            ];
            this.ongoing.set(data.id, req);
            void socket.then((socket) => {
                if (socket.readyState === socket.CLOSED ||
                    socket.readyState === socket.CLOSING) {
                    clearTimeout(req[2]);
                    this.ongoing.delete(data.id);
                    reject(new Error("Connection closed"));
                }
                else {
                    socket.send(JSON.stringify(data));
                }
            });
        });
    }
}

export interface I_JsonSocketCallbacks {
	OnOpen: () => void;
	OnError: (errorEvent: Event) => void;
	OnClose: (code: number, reason: string) => void;
	/** receives JSON, parses to object */
	OnReceive: (msg: object) => void;
}

const PING_MSG = 'PING'; // shouldn't need, WebSocket already handles
const PONG_MSG = 'PONG'; // for detecting disconnections

export class JsonSocketClient {
	webSocket: WebSocket;
	address: string;
	callbacks: I_JsonSocketCallbacks;
	pingIntervalMs: number;
	pingIntervalId: number;
	
	_Open = (webSocket: WebSocket, openEvent: Event) => {
		console.debug(`🔌socket: connected`, this.address, openEvent);
		this.pingIntervalId = setInterval(this.Ping, this.pingIntervalMs);
		this.callbacks.OnOpen();
	};
	
	_Close = (webSocket: WebSocket, closeEvent: CloseEvent) => {
		console.debug(`🔌socket: connection closed 💥💥💥💥💥💥💥💥💥💥`, closeEvent);
		clearInterval(this.pingIntervalId);
		this.callbacks.OnClose(closeEvent.code, closeEvent.reason);
	};
	
	_Error = (webSocket: WebSocket, errorEvent: Event) => {
		console.debug(`🔌socket: error`, errorEvent);
		clearInterval(this.pingIntervalId);
		this.callbacks.OnError(errorEvent);
	};
	
	_Receive = (webSocket: WebSocket, messageEvent: MessageEvent) => {
		if (messageEvent.data === PONG_MSG) return; //>> received pong
		
		// console.debug(`🔌socket: receive`, messageEvent.data);
		const msg = JSON.parse(messageEvent.data);
		this.callbacks.OnReceive(msg);
	};
	
	
	/* ##  API  ## */
	
	SetCallbacks = (callbacks: I_JsonSocketCallbacks) => this.callbacks = callbacks;
	
	Connect = (
		address: string,
		pingIntervalMs = 5000,
	) => {
		console.debug(`Socket.Connect`, address);
		
		if (this.webSocket) {
			// throw new Error(`clean up last instance of WebSocket`); // TODO
			console.warn(`existing WebSocket, status: ${this.webSocket.readyState}`)
		}
		
		if (!this.callbacks) throw new Error(`SetCallbacks first!`);
		
		this.address = address;
		const webSocket = new WebSocket(address);
		webSocket.onopen = (evt) => this._Open(webSocket, evt);
		webSocket.onclose = (evt) => this._Close(webSocket, evt);
		webSocket.onerror = (evt) => this._Error(webSocket, evt);
		webSocket.onmessage = (evt) => this._Receive(webSocket, evt);
		this.webSocket = webSocket;
		
		clearInterval(this.pingIntervalId);
		this.pingIntervalMs = pingIntervalMs;
	};
	
	/** takes object, converts to JSON, sends     */
	Send = (dataObj: object) => {
		if (this.webSocket.readyState !== WebSocket.OPEN) {
			this._Close(this.webSocket, new CloseEvent('closed somehow??'));
			throw new Error(`tried to send on closed socket`);
		}
		
		console.debug(`Socket.Send`, dataObj);
		const json = JSON.stringify(dataObj);
		this.webSocket.send(json);
	};
	
	Ping = () => {
		this.webSocket.send(PING_MSG);
	};
	
	Close = (code: number, reason: string) => {
		console.debug(`Socket.Close`, code, reason);
		clearInterval(this.pingIntervalId);
		this.webSocket.close(code, reason);
	};
}

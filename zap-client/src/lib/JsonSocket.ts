 export interface I_JsonSocketCallbacks {
	OnOpen: () => void;
	OnError: (errorEvent: Event) => void;
	OnClose: (code: number, reason: string) => void;
	/** receives JSON, parses to object */
	OnReceive: (packet: object) => void;
}

const PING = 'PING';
const PONG_MSG = 'PONG';

export class JsonSocket {
	ws: WebSocket;
	address: string;
	callbacks: I_JsonSocketCallbacks;
	pingIntervalMs: number;
	pingIntervalId: number;
	
	_Open = (openEvent: Event) => {
		console.debug(`🔌socket: connected`, this.address, openEvent);
		this.pingIntervalId = setInterval(this.Ping, this.pingIntervalMs);
		this.callbacks.OnOpen();
	};
	
	_Close = (closeEvent: CloseEvent) => {
		console.debug(`🔌socket: connection closed 💥💥💥💥💥💥💥💥💥💥`, closeEvent);
		clearInterval(this.pingIntervalId);
		this.callbacks.OnClose(closeEvent.code, closeEvent.reason);
	};
	
	_Error = (errorEvent: Event) => {
		console.error(`🔌socket: error`, errorEvent);
		clearInterval(this.pingIntervalId);
		this.callbacks.OnError(errorEvent);
	};
	
	_Receive = (messageEvent: MessageEvent) => {
		if (messageEvent.data === PONG_MSG) return; //>> received pong
		
		console.debug(`🔌socket: receive`, messageEvent.data);
		const packet = JSON.parse(messageEvent.data);
		this.callbacks.OnReceive(packet);
	};
	
	
	/* ##  API  ## */
	
	SetCallbacks = (callbacks: I_JsonSocketCallbacks) => this.callbacks = callbacks;
	
	Connect = (
		address: string,
		pingIntervalMs = 5000,
	) => {
		console.debug(`Socket.Connect`, address);
		
		if (this.ws) throw new Error(`TODO: clean up last instance of WebSocket`); // TODO
		
		if (!this.callbacks) throw new Error(`SetCallbacks first!`);
		
		this.address = address;
		this.ws = new WebSocket(address);
		
		this.ws.onopen = this._Open;
		this.ws.onclose = this._Close;
		this.ws.onerror = this._Error;
		this.ws.onmessage = this._Receive;
		
		clearInterval(this.pingIntervalId);
		this.pingIntervalMs = pingIntervalMs;
	};
	
	/** takes object, converts to JSON, sends     */
	Send = (dataObj: object) => {
		console.debug(`Socket.Send`, dataObj);
		const json = JSON.stringify(dataObj);
		this.ws.send(json);
	};
	
	Ping = () => {
		this.ws.send(PING);
	};
	
	Close = (code: number, reason: string) => {
		console.debug(`Socket.Close`, code, reason);
		clearInterval(this.pingIntervalId);
		this.ws.close(code, reason);
	};
}

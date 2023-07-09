export interface I_SocketCallbacks {
	fnOnOpen: () => {};
	fnOnError: (errorEvent: Event) => {};
	fnOnClose: (code: number, reason: string) => {};
	fnOnReceive: (packet: any) => {};
}

const PING = 'PING';
const PONG_MSG = 'PONG';

export class JsonSocket {
	ws: WebSocket;
	address: string;
	callbacks: I_SocketCallbacks;
	pingIntervalMs: number;
	pingIntervalId: number;
	
	_Open = (openEvent: Event) => {
		console.debug(`🔌socket: connected`, this.address, openEvent);
		this.pingIntervalId = setInterval(this.Ping, this.pingIntervalMs);
		this.callbacks.fnOnOpen();
	};
	
	_Close = (closeEvent: CloseEvent) => {
		console.debug(`🔌socket: connection closed 💥💥💥💥💥💥💥💥💥💥`, closeEvent);
		clearInterval(this.pingIntervalId);
		this.callbacks.fnOnClose(closeEvent.code, closeEvent.reason);
	};
	
	_Error = (errorEvent: Event) => {
		console.error(`🔌socket: error`, errorEvent);
		clearInterval(this.pingIntervalId);
		this.callbacks.fnOnError(errorEvent);
	};
	
	_Receive = (messageEvent: MessageEvent) => {
		if (messageEvent.data === PONG_MSG) return; //>> received pong
		
		console.debug(`🔌socket: receive`, messageEvent.data);
		const packet = JSON.parse(messageEvent.data);
		this.callbacks.fnOnReceive(packet);
	};
	
	
	/* ##  API  ## */
	
	SetCallbacks = (callbacks: I_SocketCallbacks) => this.callbacks = callbacks;
	
	Connect = (
		address: string,
		pingIntervalMs: number = 5000,
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
	
	Send = (dataObj: any) => {
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

import uWS, {TemplatedApp, WebSocket} from 'uWebSockets.js';
import {
	BasePkHandler,
	E_Endpoint,
	I_PkSource,
	T_ClientId,
	T_MsgId, T_Packet, T_SocketMsg,
} from '../../zap-shared/SystemTypes.js';
import {ZapGame} from './ZapGame.js';
import {ZapPacketDefs} from '../../zap-shared/Packets.js';
import {InitializePackets_SERVER} from './ServerPkHandlers.js';

const PING_MSG = 'PING';
const PONG_MSG = 'PONG';

export class ClientConn implements I_PkSource {
	isOpen: boolean;
	id: T_ClientId;
	socket: WebSocket<ClientConn>;
	endpoint: E_Endpoint;
	game: ZapGame;
	toSocket: string; // `client/id`
	
	public toString(): string {return `${this.endpoint} ${this.id} ${this.game}`;}
}

export class ZapServer {
	wsApp: TemplatedApp;
	packets = new ZapPacketDefs<ClientConn>();
	packetMap = new Map<T_MsgId, BasePkHandler<ClientConn>>();
	
	clientIdInc: T_ClientId = 0;
	clients = new Map<T_ClientId, ClientConn>();
	
	constructor(wsHost: string, wsPort: number) {
		this.wsApp = uWS
			.App({})
			.ws<ClientConn>('/*', {
				compression: uWS.SHARED_COMPRESSOR, // or DISABLED ?
				// maxPayloadLength: 16 * 1024, // * 1024, // TODO
				maxPayloadLength: 100_000,
				idleTimeout: 32, // seconds
				maxBackpressure: 1024 * 1024, // per socket
				
				open: this.OnNewConnection,
				close: this.OnConnectionClosed,
				message: this.OnMessageReceived,
				drain: this.OnTooMuchPressure,
				upgrade: (res, req, context) => {
					console.log(`Upgrading HTTP connection to WebSocket URL: ${req.getUrl()}`);
					res.upgrade(
						new ClientConn(),
						req.getHeader('sec-websocket-key'),
						req.getHeader('sec-websocket-protocol'),
						req.getHeader('sec-websocket-extensions'),
						context,
					);
					
				},
			})
			.any('/*', (res, req) => {
				console.log(`app: any /*`);
				res.end('bad');
			})
			.get('/health', (res, req) => {
				console.log(`app: get /health`);
				res.writeStatus('200 OK').end('200 OK');
			})
			.listen(
				wsHost,
				wsPort,
				(listenSocket) => console.log(`Listen to port ${wsPort}: ${!!listenSocket}`),
			)
		;
		
		InitializePackets_SERVER(this.packets, this);
		for (const pkHandler of this.packets.AllPkHandlers) {
			this.packetMap.set(pkHandler.id, pkHandler);
			
			pkHandler.Send = (packet, address) => this.PublishPacket(packet, address, pkHandler);
		}
	}
	
	OnNewConnection = (socket: WebSocket<ClientConn>) => {
		const client = socket.getUserData();
		client.id = ++this.clientIdInc;
		client.socket = socket;
		client.endpoint = E_Endpoint.client;
		client.toSocket = `client/${client.id}`;
		socket.subscribe(client.toSocket);
		this.clients.set(client.id, client);
		console.log(`++conn ${client} connected`);
		
		this.packets.Pk_Log.Send(`hello ${client}`, client.toSocket);
	};
	
	OnConnectionClosed = (socket: WebSocket<ClientConn>, code: number, msgBuffer: ArrayBuffer) => {
		const client = socket.getUserData();
		client.isOpen = false;
		this.clients.delete(client.id);
		console.log(`--conn ${client} DISCONNECTED: ${code}`);
	};
	
	OnTooMuchPressure = (socket: WebSocket<ClientConn>) => {
		console.warn(`TODO: socket has too much back pressure`); // TODO: OnTooMuchPressure
	};
	
	OnMessageReceived = (
		socket: WebSocket<ClientConn>,
		msgBuffer: ArrayBuffer,
		isBinary: boolean,
	) => {
		const client = socket.getUserData();
		
		if (isBinary) throw new Error(`TODO: got binary message`);
		const raw = Buffer.from(msgBuffer).toString();
		
		if (raw === PING_MSG) {
			// TODO
			return;
		}
		
		
		console.log(`received json: ${raw}`);
		const socketMsg = JSON.parse(raw) as T_SocketMsg;
		
		
		const pkHandler = this.packetMap.get(socketMsg.id);
		if (!pkHandler) {
			console.error(`missing pk handler: ${socketMsg.id}`, raw);
			return;
		}
		
		const maybeError = pkHandler.Handle(
			socketMsg,
			E_Endpoint.server, // TODO: useless
			pkHandler.to, // TODO: useless
			client,
		);
		
		if (maybeError) throw new Error(maybeError);
	};
	
	PublishPacket(packet: T_Packet, address: string, pkHandler: BasePkHandler<ClientConn>) {
		const json = JSON.stringify({
			id: pkHandler.id,
			packet: packet,
		});
		console.log(`publish to ${address}, ${json}`, packet);
		this.wsApp.publish(address, json);
	}
	
	// OnNewConnection = (ws: WebSocket) => {
	//
	//
	// 	ws.onopen = this.OnNewConnection;
	// 	ws.onclose = this.OnConnectionClosed;
	// 	ws.onerror = this.OnError;
	// 	// ws.onmessage = this.OnMessageReceived;
	//
	// };
	//
	// Asdf = (openEvent: Event) => {
	// 	console.debug(`🔌ws: new connection`, openEvent);
	//
	// 	const client = new ClientConnection();
	// 	client.id = ++this.clientIdInc;
	// 	client.socket = openEvent.target;
	// 	client.clientType = E_ClientType.unregistered;
	// };
	//
	// OnConnectionClosed = (closeEvent: CloseEvent) => {
	// 	console.debug(`🔌ws: connection closed 💥💥💥💥💥💥💥💥💥💥`, closeEvent);
	// };
	//
	// OnError = (errorEvent: Event) => {
	// 	console.error(`🔌ws: error`, errorEvent);
	// };
	//
	// OnMessageReceived = (messageEvent: MessageEvent) => {
	// 	if (messageEvent.data === PING_MSG) {
	// 		this.ws.send(PONG_MSG);
	// 		return;
	// 	}
	//
	// 	messageEvent.console.debug(`🔌ws: receive`, messageEvent.data);
	// 	const packet = JSON.parse(messageEvent.data);
	// 	this.callbacks.OnReceive(packet);
	// };
}
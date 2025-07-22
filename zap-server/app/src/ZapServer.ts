import uWS, {TemplatedApp, WebSocket} from 'uWebSockets.js';
import {
	BasePkHandler,
	E_Endpoint,
	I_PkSource,
	T_ClientId,
	T_GameIdf,
	T_MsgId,
	T_Packet,
	T_SocketMsg,
} from '../zap-shared/SystemTypes.js';
import {GamePersist, ZapGame} from './ZapGame.js';
import {InitializePackets_SERVER} from './ServerPkHandlers.js';
import {ZapPacketDefs} from '../zap-shared/_Packets.js';
import {ArticleDat, PostArticleDat} from '../zap-shared/_Dats.js';
import {AddClientToGame, MakeGame} from './GameLogic.js';

const PING_MSG = 'PING';
const PONG_MSG = 'PONG';
const TICK_RATE_MS = 1000;
const STARTING_TIMER_LABEL = 'Game Turn';
const STARTING_TIMER_MS = 30 * 60 * 1000;
const DB_BACKUP_MS = 5 * 60 * 1000;
const ARTICLE_COUNT_INITIAL_SEND = 10; // TODO: config/elsewhere

export class ClientConn implements I_PkSource {
	isOpen: boolean;
	id: T_ClientId;
	socket: WebSocket<ClientConn>;
	endpoint: E_Endpoint;
	game: ZapGame | null;
	toSocket: string; // `client/id`
	
	label: string; // debug only
}

export class ZapServer {
	wsApp: TemplatedApp;
	storagePath: string;
	packets = new ZapPacketDefs<ClientConn>();
	packetMap = new Map<T_MsgId, BasePkHandler<ClientConn>>();
	
	clientIdInc: T_ClientId = 0;
	clients = new Map<T_ClientId, ClientConn>();
	
	games = new Map<T_GameIdf, ZapGame>();
	
	constructor(wsHost: string, wsPort: number, storagePath: string) {
		this.storagePath = storagePath;
		
		//## init uWebSockets.js
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
		
		//## init PACKETS
		InitializePackets_SERVER(this.packets, this);
		for (const pkHandler of this.packets._ALL_PACKET_HANDLERS) {
			this.packetMap.set(pkHandler.id, pkHandler);
			
			pkHandler._Publish =
				(address, packet) => this.PublishPacket(address, packet, pkHandler);
		}
	}
	
	OnNewConnection = (socket: WebSocket<ClientConn>) => {
		const client = socket.getUserData();
		client.id = ++this.clientIdInc;
		client.socket = socket;
		client.endpoint = E_Endpoint.client;
		client.toSocket = `client/${client.id}`;
		this.UpdateLabel(client);
		
		socket.subscribe(client.toSocket);
		this.clients.set(client.id, client);
		console.log(`++conn ${client.label} connected`);
		
		this.packets.Log.Send(client.toSocket, `hello ${client.label}`);
		this.packets.DemandRegister.Send(client.toSocket, {
			Games: [...this.games.keys()],
		});
	};
	
	OnConnectionClosed = (socket: WebSocket<ClientConn>, code: number, msgBuffer: ArrayBuffer) => {
		const client = socket.getUserData();
		client.isOpen = false;
		this.clients.delete(client.id);
		console.log(`--conn ${client.label} DISCONNECTED: ${code}`);
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
			socket.send(PONG_MSG);
			return; //>> send pong
		}
		
		console.log(`received json: ${raw}`);
		const socketMsg = JSON.parse(raw) as T_SocketMsg;
		
		const pkHandler = this.packetMap.get(socketMsg.id);
		if (!pkHandler) {
			console.error(`missing pk handler: ${socketMsg.id}`, raw);
			return; //>> missing pk handler
		}
		
		const maybeError = pkHandler._Receive(
			socketMsg,
			client,
		);
		
		if (maybeError) throw new Error(maybeError);
	};
	
	PublishPacket(address: string, packet: T_Packet, pkHandler: BasePkHandler<ClientConn>) {
		const json = JSON.stringify({
			id: pkHandler.id,
			ep: pkHandler.to,
			pk: packet,
		});
		this.wsApp.publish(address, json);
	}
	
	RegisterClient(client: ClientConn, gameIdf: T_GameIdf, endpoint: E_Endpoint) {
		let game = this.games.get(gameIdf);
		
		if (!game) {
			game = MakeGame(gameIdf, this);
			this.games.set(gameIdf, game);
			console.log(`++game: ${game}`);
		}
		
		console.log(`client(#${client.id}) endpoint change: ${E_Endpoint[client.endpoint]} -> ${E_Endpoint[endpoint]}`);
		client.endpoint = endpoint;
		this.UpdateLabel(client);
		
		AddClientToGame(game, client, this);
	}
	
	UpdateLabel = (client: ClientConn) => client.label =
		`client(${E_Endpoint[client.endpoint]} #${client.id}, ${client.game?.idf || 'none'})`;
}
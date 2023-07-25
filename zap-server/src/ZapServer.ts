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
} from '../../zap-shared/SystemTypes.js';
import {ZapGame} from './ZapGame.js';
import {InitializePackets_SERVER} from './ServerPkHandlers.js';
import {ZapPacketDefs} from '../../zap-shared/_Packets.js';
import {GameDat} from '../../zap-shared/_Dats.js';
import {ZapDb} from './ZapDb.js';

const PING_MSG = 'PING';
const PONG_MSG = 'PONG';
const TICK_RATE_MS = 1000;
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
		UpdateLabel(client);
		
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
		// console.log(`publish to ${address}, ${json}`);
		this.wsApp.publish(address, json);
	}
	
	
	SetClientEndpoint(client: ClientConn, endpoint: E_Endpoint) {
		console.log(`client(#${client.id}) endpoint change: ${E_Endpoint[client.endpoint]} -> ${E_Endpoint[endpoint]}`);
		client.endpoint = endpoint;
		UpdateLabel(client);
	}
	
	MakeGame(idf: T_GameIdf) {
		const game = new ZapGame();
		game.idf = idf;
		game.toAllClients = `${idf}/all`;
		game.toAdmins = `${idf}/admins`;
		game.toPlayers = `${idf}/players`;
		game.toProjectors = `${idf}/projectors`;
		
		game.db = new ZapDb<GameDat>(
			{
				idf: idf,
				lastId: 0,
				articles: [],
			}
			, {
				folderPath: `${this.storagePath}/${idf}`,
				backupIntervalMs: DB_BACKUP_MS,
				// Serials: GameDat.Serials,
			});
		game.db.onLoad = () => this.SendInitialArticles(game, game.toAllClients);
		game.timer = {
			label: '',
			ms: STARTING_TIMER_MS,
		};
		game.tickInterval = setInterval(() => this.TickGame(game), TICK_RATE_MS);
		
		console.log(`++game: ${game}`);
		this.games.set(idf, game);
		return game;
	}
	
	AddClientToGame(game: ZapGame, client: ClientConn) {
		this.RemoveClientFromGame(client);
		
		client.game = game;
		UpdateLabel(client);
		
		game.allClients.set(client.id, client);
		client.socket.subscribe(game.toAllClients);
		
		if (client.endpoint === E_Endpoint.admin) {
			game.admins.set(client.id, client);
			client.socket.subscribe(game.toAdmins);
		}
		else if (client.endpoint === E_Endpoint.player) {
			game.players.set(client.id, client);
			client.socket.subscribe(game.toPlayers);
		}
		else if (client.endpoint === E_Endpoint.projector) {
			game.projectors.set(client.id, client);
			client.socket.subscribe(game.toProjectors);
		}
		
		this.SendTimer(game, client.toSocket);
		this.SendInitialArticles(game, client.toSocket);
		console.log(`${game} added: ${client.label}`);
	}
	
	RemoveClientFromGame(client: ClientConn) {
		const game = client.game;
		if (!game) return; //>> no game
		
		client.game = null;
		UpdateLabel(client);
		
		game.allClients.delete(client.id);
		game.admins.delete(client.id);
		game.players.delete(client.id);
		game.projectors.delete(client.id);
		
		client.socket.unsubscribe(game.toAllClients);
		client.socket.unsubscribe(game.toAdmins);
		client.socket.unsubscribe(game.toPlayers);
		client.socket.unsubscribe(game.toProjectors);
		
		console.log(`${game} removed: ${client.label}`);
		
		// TODO: check if game should still be alive
	}
	
	TickGame(game: ZapGame) {
		let next = game.timer.ms - 1000;
		if (next < 0) next = 0;
		game.timer.ms = next;
		
		// TODO: more resilient time syncing
		
		this.SendTimer(game, game.toAllClients);
	}
	
	SendInitialArticles(game: ZapGame, to: string) {
		this.packets.ArticleList.Send(to, {
			articles: game.db.current.articles.slice(-ARTICLE_COUNT_INITIAL_SEND),
		});
	}
	
	// SendGameInfo(game: ZapGame, to: string) {
	// 	this.packets.GameInfo.Send(to, {
	// 		idf: game.idf,
	// 		articleCount: game.db.current.articles.length,
	// 	});
	// }
	
	async ResetGame(game: ZapGame) {
		console.log(`RESETTING game ${game.idf}`);
		
		await game.db.Backup();
		
		game.db.current = {
			idf: game.idf,
			lastId: 0,
			articles: [],
		};
		
		this.SendInitialArticles(game, game.toAllClients);
		
		return game.db.Save();
	}
	
	SendTimer = (game: ZapGame, to: string) => this.packets.TimerTick.Send(to, game.timer);
}


const UpdateLabel = (client: ClientConn) => client.label =
	`client(${E_Endpoint[client.endpoint]} #${client.id}, ${client.game ? client.game.idf : '_'})`;
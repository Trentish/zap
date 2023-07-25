import {
	BasePkHandler,
	E_ConnStatus,
	E_Endpoint,
	GetEndpoint,
	I_PkSource,
	T_MsgId,
	T_Packet,
	T_SocketMsg,
} from '../../zap-shared/SystemTypes.ts';
import {ZapPacketDefs} from '../../zap-shared/_Packets.ts';
import {I_JsonSocketCallbacks, JsonSocketClient} from './lib/JsonSocketClient.ts';
import {InitializePackets_CLIENT} from './ClientPkHandlers.ts';
import {
	$articleRequestCount,
	$connError,
	$connStatus,
	$endpoint,
	$gameIdf,
	$location,
	$store,
} from './ClientState.ts';


const WS_SERVER = 'ws://localhost:3007'; // TODO: config
const RECONNECT_INTERVAL_MS = 5000;

export class ConnToServer implements I_PkSource {endpoint = E_Endpoint.server;}
const Conn = new ConnToServer(); // placeholder


export class ZapClient implements I_JsonSocketCallbacks {
	socket = new JsonSocketClient();
	packets = new ZapPacketDefs<ConnToServer>();
	packetMap = new Map<T_MsgId, BasePkHandler<ConnToServer>>();
	
	get endpoint() {return $store.get($endpoint);}
	
	get gameIdf() {return $store.get($gameIdf);}
	
	constructor() {
		console.log(`initialize Client`);
		
		$store.set($connStatus, E_ConnStatus.initializing);
		
		this.UpdateLocation();
		$store.sub($location, this.UpdateLocation);
		
		//## init PACKETS
		InitializePackets_CLIENT(this.packets, this);
		for (const pkHandler of this.packets._ALL_PACKET_HANDLERS) {
			this.packetMap.set(pkHandler.id, pkHandler);
			
			pkHandler._Publish = (address, packet) => this.PublishPacket(packet, pkHandler);
		}
		
		this.socket.SetCallbacks(this);
		this.Connect();
		
		setInterval(this.TryReconnect, RECONNECT_INTERVAL_MS);
		// setInterval(this.Tick, 1000);
	}
	
	Connect = () => {
		$store.set($connError, '');
		$store.set($connStatus, E_ConnStatus.connecting);
		this.socket.Connect(WS_SERVER);
	};
	
	TryReconnect = () => {
		// console.log(`check reconnect`);
		const status = $store.get($connStatus);
		if (status === E_ConnStatus.connected) return; //>> already connected
		if (status === E_ConnStatus.connecting) return; //>> already reconnecting
		console.log(`trying to reconnect to ${WS_SERVER}`);
		this.Connect();
	};
	
	OnOpen = () => {
		console.log(`open`);
		$store.set($connStatus, E_ConnStatus.connected);
	};
	
	OnError = (errorEvent: Event) => {
		console.error(`socket connection error`, errorEvent);
		$store.set($connError, `socket connection error`);
	};
	
	OnClose = (code: number, reason: string) => {
		console.log(`closed ${code}, ${reason}`);
		$store.set($connError, `socket closed: ${code} ${reason}`);
		$store.set($connStatus, E_ConnStatus.disconnected);
	};
	
	OnReceive(raw: object) {
		const socketMsg = raw as T_SocketMsg;
		// console.log(`received`, socketMsg);
		
		const pkHandler = this.packetMap.get(socketMsg.id);
		if (!pkHandler) {
			console.error(`missing pk handler: ${socketMsg.id}`, raw);
			return;
		}
		
		const maybeError = pkHandler._Receive(
			socketMsg,
			Conn,
		);
		
		if (maybeError) throw new Error(maybeError);
	}
	
	PublishPacket(packet: T_Packet, pkHandler: BasePkHandler<ConnToServer>) {
		this.socket.Send({
			id: pkHandler.id,
			ep: pkHandler.to,
			pk: packet,
		});
	}
	
	UpdateLocation() {
		const loc = $store.get($location);
		const pathArr = loc.pathname?.split('/').filter(s => s) || [];
		const gameIdf = pathArr.length >= 2 ? pathArr[1].toLowerCase() : '';
		const endpoint = pathArr.length >= 1 ? GetEndpoint(pathArr[0]) : E_Endpoint.unknown;
		
		$store.set($endpoint, endpoint);
		$store.set($gameIdf, gameIdf);
		console.log(`UpdateLocation: ${loc.pathname}`, pathArr);
		
		document.title = `${E_Endpoint[endpoint]} of ${gameIdf || '?'} (ZAP)`;
	}
	
	currentArticleRequestCount = 0;
	
	UpdateArticleRequest() {
		// const count = $store.get($articleRequestCount);
		// if (this.currentArticleRequestCount)
	}
	
	// TEMP
	// Tick() {
	// 	store.set(timerMsAtom, (current) => {
	// 		let next = current - 1000;
	// 		if (next < 0) next = 0;
	// 		return next;
	// 	});
	// }
}

// export const at1 = atom(555);
// const testy = atom({blah: 55});
// const val = store.get(at1);
// store.set(at1, 12345);
// const unsub = store.sub(at1, () => {
// 	const value = store.get(at1);
// });
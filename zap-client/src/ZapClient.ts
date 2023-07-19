import {atom, getDefaultStore} from 'jotai';
import {
	BasePkHandler,
	E_Endpoint, GetEndpoint,
	I_PkSource, T_GameIdf,
	T_MsgId, T_Packet,
	T_SocketMsg,
} from '../../zap-shared/SystemTypes.ts';
import {ZapPacketDefs} from '../../zap-shared/_Packets.ts';
import {I_JsonSocketCallbacks, JsonSocketClient} from './lib/JsonSocketClient.ts';
import {InitializePackets_CLIENT} from './ClientPkHandlers.ts';
import {atomWithLocation} from 'jotai-location';
import {GameDat} from '../../zap-shared/_Dats.ts';


const WS_SERVER = 'ws://localhost:3007';

export const store = getDefaultStore();
export const locationAtom = atomWithLocation();
export const endpointAtom = atom(E_Endpoint.unknown);
export const gameIdfAtom = atom<T_GameIdf>('');
export const allGameIdfsAtom = atom<string[]>([])
export const timerMsAtom = atom(30 * 60 * 1000)
export const gameDatAtom = atom(new GameDat());

export class ConnToServer implements I_PkSource {
	endpoint = E_Endpoint.server;
}

const TempConnToServer = new ConnToServer(); // TODO


export class ZapClient implements I_JsonSocketCallbacks {
	socket = new JsonSocketClient();
	packets = new ZapPacketDefs<ConnToServer>();
	packetMap = new Map<T_MsgId, BasePkHandler<ConnToServer>>();
	
	get endpoint() {return store.get(endpointAtom);}
	
	get gameIdf() {return store.get(gameIdfAtom);}
	
	constructor() {
		console.log(`initialize Client`);
		
		this.UpdateLocation();
		store.sub(locationAtom, this.UpdateLocation);
		
		//## init PACKETS
		InitializePackets_CLIENT(this.packets, this);
		for (const pkHandler of this.packets._ALL_PACKET_HANDLERS) {
			this.packetMap.set(pkHandler.id, pkHandler);
			
			pkHandler._Publish = (address, packet) => this.PublishPacket(packet, pkHandler);
		}
		
		this.socket.SetCallbacks(this);
		this.socket.Connect(WS_SERVER);
		
		setInterval(this.Tick, 1000);
	}
	
	OnOpen = () => console.log(`open`);
	OnError = (errorEvent: Event) => console.error(`socket error`, errorEvent);
	OnClose = (code: number, reason: string) => console.log(`closed ${code}, ${reason}`);
	
	OnReceive(raw: object) {
		const socketMsg = raw as T_SocketMsg;
		console.log(`received`, socketMsg);
		const pkHandler = this.packetMap.get(socketMsg.id);
		if (!pkHandler) {
			console.error(`missing pk handler: ${socketMsg.id}`, raw);
			return;
		}
		
		const maybeError = pkHandler._Receive(
			socketMsg,
			TempConnToServer,
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
		const loc = store.get(locationAtom);
		const pathArr = loc.pathname?.split('/').filter(s => s) || [];
		store.set(endpointAtom, pathArr.length >= 1 ? GetEndpoint(pathArr[0]) : E_Endpoint.unknown);
		store.set(gameIdfAtom, pathArr.length >= 2 ? pathArr[1].toLowerCase() : '');
		console.log(`UpdateLocation: ${loc.pathname}`, pathArr);
	}
	
	// TEMP
	Tick() {
		store.set(timerMsAtom, (current) => current - 1000);
	}
}


// export const at1 = atom(555);
// const testy = atom({blah: 55});
// const val = store.get(at1);
// store.set(at1, 12345);
// const unsub = store.sub(at1, () => {
// 	const value = store.get(at1);
// });
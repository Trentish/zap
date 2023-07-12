import {atom, getDefaultStore} from 'jotai';
import {I_JsonSocketCallbacks, JsonSocketClient} from './lib/JsonSocketClient';
import {InitializePackets_CLIENT} from './ClientPkHandlers';
import {ZapPacketDefs} from '../../zap-shared/Packets';
import {
	BasePkHandler,
	E_Endpoint,
	I_PkSource,
	T_MsgId,
	T_SocketMsg,
} from '../../zap-shared/SystemTypes.ts';


const WS_SERVER = 'ws://localhost:3007';

const store = getDefaultStore();

export class ConnToServer implements I_PkSource {}

const TempConnToServer = new ConnToServer(); // TODO


export const at1 = atom(555);
const testy = atom({blah: 55});

export class ZapClient implements I_JsonSocketCallbacks {
	socket = new JsonSocketClient();
	packets = new ZapPacketDefs<ConnToServer>();
	packetMap = new Map<T_MsgId, BasePkHandler<ConnToServer>>();
	
	
	constructor() {
		const val = store.get(at1);
		store.set(at1, 12345);
		const unsub = store.sub(at1, () => {
			const value = store.get(at1); // TODO: ??
		});
		
		
		console.log(`initialize Client`);
		
		
		InitializePackets_CLIENT(this.packets, this);
		for (const pkHandler of this.packets.AllPkHandlers) {
			this.packetMap.set(pkHandler.id, pkHandler);
		}
		
		this.socket.SetCallbacks(this);
		this.socket.Connect(WS_SERVER);
	}
	
	OnOpen() {
		console.log(`open`);
	}
	
	OnError(errorEvent: Event) {
		console.error(`socket error`, errorEvent);
	}
	
	OnClose(code: number, reason: string) {
		console.log(`closed ${code}, ${reason}`);
	}
	
	OnReceive(raw: object) {
		const socketMsg = raw as T_SocketMsg;
		console.log(`received`, socketMsg);
		const pkHandler = this.packetMap.get(socketMsg.id);
		if (!pkHandler) {
			console.error(`missing pk handler: ${socketMsg.id}`, raw);
			return;
		}
		
		const maybeError = pkHandler.Handle(
			socketMsg,
			E_Endpoint.server, // TODO: useless
			pkHandler.to, // TODO: useless
			TempConnToServer,
		);
		
		if (maybeError) throw new Error(maybeError);
	}
}
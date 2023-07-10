import {atom, getDefaultStore} from 'jotai';
import {I_JsonSocketCallbacks, JsonSocket} from './lib/JsonSocket.ts';


const WS_SERVER = 'ws://localhost:3005';

const store = getDefaultStore();


export type T_Packet = {
	id: string,
	payload: unknown,
}
// const packet = JSON.parse(messageEvent.data);

export const at1 = atom(555);

export class ZapClient implements I_JsonSocketCallbacks {
	socket: JsonSocket = new JsonSocket();
	
	constructor() {
		const val = store.get(at1);
		store.set(at1, 12345);
		const unsub = store.sub(at1, () => {
			const value = store.get(at1);
			// TODO: ??
		});
		
		
		console.log(`initialize Client`);
		
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
	
	OnReceive(packet: object) {
		console.log(`received`, packet);
	}
}
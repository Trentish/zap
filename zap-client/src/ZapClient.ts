import {atom, getDefaultStore} from 'jotai';
import {JsonSocket} from './lib/JsonSocket.ts';


const WS_SERVER = 'ws://localhost:3005';

const store = getDefaultStore();


export type T_Packet = {
	id: string,
	payload: any,
}
// const packet = JSON.parse(messageEvent.data);

export const at1 = atom(555);

export class ZapClient {
	socket: JsonSocket = new JsonSocket();
	
	constructor() {
		const val = store.get(at1);
		store.set(at1, 12345);
		const unsub = store.sub(at1, () => {
			const value = store.get(at1);
			// TODO: ??
		});
		
		
	}
}
import {ZapPacketDefs} from '../../zap-shared/_Packets.ts';
import {allGameIdfsAtom, ConnToServer, store, ZapClient} from './ZapClient.ts';

// TODO: break this up at some point
export function InitializePackets_CLIENT(defs: ZapPacketDefs<ConnToServer>, client: ZapClient) {
	
	defs.Log.From_SERVER = (pk) => console.log(`%c${pk}`, `font-weight: bold;`);
	
	defs.DemandRegister.From_SERVER = (pk) => {
		console.log(`TODO: do client register, games: [${pk.Games.join()}]`);
		store.set(allGameIdfsAtom, pk.Games);
		
		defs.Register.Send({
			Endpoint: client.endpoint,
			GameIdf: client.gameIdf,
		});
	};
	
	
}
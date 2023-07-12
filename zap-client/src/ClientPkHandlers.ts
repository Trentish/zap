import {ZapPacketDefs} from '../../zap-shared/Packets.ts';
import {ConnToServer, ZapClient} from './ZapClient.ts';

// TODO: break this up at some point
export function InitializePackets_CLIENT(defs: ZapPacketDefs<ConnToServer>, client: ZapClient) {
	
	defs.Pk_Log.From_SERVER = (pk) => {
		console.log(`Pk_Log from server: ${pk}`);
	};
	
	defs.Pk_DemandRegister.From_SERVER = (pk) => {
		console.log(`TODO: do client register ${pk.Games.join()}`)
	}
	
	
}
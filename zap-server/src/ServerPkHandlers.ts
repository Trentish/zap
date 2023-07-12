import {ZapPacketDefs} from '../../zap-shared/Packets.js';
import {ClientConn, ZapServer} from './ZapServer.js';


// TODO: break this up at some point
export function InitializePackets_SERVER(defs: ZapPacketDefs<ClientConn>, server: ZapServer) {
	defs.Pk_Register.From_CLIENT = (pk, source) => {
		console.log(`Pk_Register: ${pk} from ${source}`);
	};
	
}
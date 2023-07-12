import {ZapPacketDefs} from '../../zap-shared/_Packets.js';
import {ClientConn, ZapServer} from './ZapServer.js';


// TODO: break this up at some point
export function InitializePackets_SERVER(defs: ZapPacketDefs<ClientConn>, server: ZapServer) {
	defs.Register.From_CLIENT = (pk, src) => {
		if (!pk.GameIdf) {
			// skipping everything for now (client will reload with proper data)
			return; //>> no game idf
		}
		
		const game = server.games.get(pk.GameIdf)
			|| server.MakeGame(pk.GameIdf);
		
		server.SetClientEndpoint(src, pk.Endpoint);
		server.AddClientToGame(game, src);
	};
}
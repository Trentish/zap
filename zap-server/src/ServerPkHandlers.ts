import {ZapPacketDefs} from '../../zap-shared/_Packets.js';
import {ClientConn, ZapServer} from './ZapServer.js';
import {AddArticle, SendAllArticles, ResetGame, SetTimer, ForceSpotlight} from './GameLogic.js';

export function InitializePackets_SERVER(defs: ZapPacketDefs<ClientConn>, server: ZapServer) {
	
	//## SYSTEM
	defs.Register.From_CLIENT = (pk, src) => {
		// HACK: skipping if missing GameIdf (client will reload with proper data)
		if (!pk.GameIdf) return; //>> no game idf
		
		server.RegisterClient(src, pk.GameIdf, pk.Endpoint);
	};
	
	
	//## ARTICLES
	defs.PostArticle.From_CLIENT = (pk, src) => AddArticle(getGame(src), pk, server);
	defs.AllArticles.From_CLIENT = (pk, src) => SendAllArticles(getGame(src), src, server);
	defs.ResetGame.From_ADMIN = (pk, src) => ResetGame(getGame(src), server);
	defs.ForceSpotlight.From_ADMIN = (pk, src) => ForceSpotlight(getGame(src), pk.id, server);
	
	
	//## TIMER
	defs.SetTimer.From_ADMIN = (pk, src) => SetTimer(getGame(src), pk, server);
	
	
	//## MISC
	defs.DbForceLoad.From_ADMIN = (pk, src) => getGame(src).db.Load();
	defs.DbForceSave.From_ADMIN = (pk, src) => getGame(src).db.Save();
	defs.DbForceBackup.From_ADMIN = (pk, src) => getGame(src).db.Backup();
	
}

// TEMP
function getGame(client: ClientConn) {
	const game = client.game;
	if (!game) throw new Error(`TODO: game packet received but no game for ${client.label}`); // TODO
	return game;
}
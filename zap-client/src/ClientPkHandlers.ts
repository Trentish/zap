import {ZapPacketDefs} from '../../zap-shared/_Packets.ts';
import {
	allGameIdfsAtom,
	ConnToServer,
	gameDatAtom,
	store,
	timerMsAtom,
	ZapClient,
} from './ZapClient.ts';
import {ArticleDat, GameDat} from '../../zap-shared/_Dats.ts';

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
	
	defs.GameDat.Serials = GameDat.Serials;
	defs.GameDat.From_SERVER = (pk ) => {
		console.log(`gameDat received`, pk);
		store.set(gameDatAtom, {...pk});
	}
	
	defs.ArticleAdded.Serials = ArticleDat.Serials;
	defs.ArticleAdded.From_SERVER = (pk) => {
		const dat = store.get(gameDatAtom);
		dat.articles.push(pk);
		store.set(gameDatAtom, {...dat});
	}
	
	defs.TimerTick.From_SERVER = (pk) => {
		store.set(timerMsAtom, pk.ms);
	}
}
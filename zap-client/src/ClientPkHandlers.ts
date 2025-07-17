import {ZapPacketDefs} from '../zap-shared/_Packets.ts';
import {ConnToServer, ZapClient} from './ZapClient.ts';
import {
	$allArticles,
	$allGameIdfs,
	$allStats,
	$situation,
	$spotlight,
	$store,
} from './ClientState.ts';

// TODO: break this up at some point?
export function InitializePackets_CLIENT(defs: ZapPacketDefs<ConnToServer>, client: ZapClient) {
	
	//## SYSTEM
	
	defs.Log.From_SERVER = (pk) => console.log(`%c${pk}`, `font-weight: bold;`);
	
	defs.DemandRegister.From_SERVER = (pk) => {
		console.log(`TODO: do client register, games: [${pk.Games.join()}]`);
		$store.set($allGameIdfs, pk.Games);
		
		defs.Register.Send({
			Endpoint: client.endpoint,
			GameIdf: client.gameIdf,
		});
	};
	
	
	//## ARTICLES
	
	defs.ArticleList.From_SERVER = (pk) => {
		$store.set($allArticles, pk.articles);
	};
	defs.ArticleAdded.From_SERVER = (pk) => {
		$store.set($allArticles, (current) => [...current, pk]);
	};
	defs.SetSpotlight.From_SERVER = (pk) => {
		console.log(`-> 🔦 received spotlight`, pk);
		$store.set($spotlight, pk);
	};
	
	
	//## TIMER
	
	defs.TimerTick.From_SERVER = (pk) => client.ReceiveTimerTick(pk);
	defs.Situation.From_SERVER = (pk) =>  {
		$store.set($situation, pk);
	}
	
	defs.AllStats.From_SERVER = (pk) => {
		$store.set($allStats, pk);
	}
	
	//## MISC
	
	
}
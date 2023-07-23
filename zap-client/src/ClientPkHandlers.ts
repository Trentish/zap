import {ZapPacketDefs} from '../../zap-shared/_Packets.ts';
import {
	$allGameIdfs,
	ConnToServer,
	$gameDat,
	$store,
	$timerMs,
	ZapClient,
} from './ZapClient.ts';

// TODO: break this up at some point
export function InitializePackets_CLIENT(defs: ZapPacketDefs<ConnToServer>, client: ZapClient) {
	
	defs.Log.From_SERVER = (pk) => console.log(`%c${pk}`, `font-weight: bold;`);
	
	defs.DemandRegister.From_SERVER = (pk) => {
		console.log(`TODO: do client register, games: [${pk.Games.join()}]`);
		$store.set($allGameIdfs, pk.Games);
		
		defs.Register.Send({
			Endpoint: client.endpoint,
			GameIdf: client.gameIdf,
		});
	};
	
	defs.GameDat.From_SERVER = (pk ) => {
		console.log(`gameDat received`, pk);
		$store.set($gameDat, {...pk});
	}
	
	defs.ArticleAdded.From_SERVER = (pk) => {
		const dat = $store.get($gameDat);
		dat.articles.push(pk);
		$store.set($gameDat, {...dat});
	}
	
	defs.TimerTick.From_SERVER = (pk) => {
		$store.set($timerMs, pk.ms);
	}
}
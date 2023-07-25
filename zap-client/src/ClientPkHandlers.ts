import {ZapPacketDefs} from '../../zap-shared/_Packets.ts';
import {ConnToServer, ZapClient} from './ZapClient.ts';
import {$allArticles, $allGameIdfs,  $store, $timer} from './ClientState.ts';

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
	
	defs.ArticleAdded.From_SERVER = (pk) => {
		// const article = $articleLup(pk.id);
		// $store.set(article, pk);
		// const holder = $store.get($articleHolder);
		// $store.set($articleHolder, {
		// 	count: holder.articles.length + 1,
		// 	highestId: -1, // TODO: delete
		// 	articles: [...holder.articles, pk],
		// });
		// const split = $store.get($splitArticles);
		$store.set($allArticles, (current) => [...current, pk]);
		console.log(`add article: ${pk.id}`);
	};
	defs.ArticleList.From_SERVER = (pk) => {
		$store.set($allArticles, pk.articles);
		// $store.set($articleHolder, {
		// 	count: pk.articles.length,
		// 	highestId: -1, // TODO: delete
		// 	articles: pk.articles,
		// });
		// for (const dat of pk.articles) {
		// 	const article = $articleLup(dat.id);
		// 	$store.set(article, dat);
		// 	console.log(`set articleLup: ${dat.id}`);
		// }
	};
	
	
	//## TIMER
	
	defs.TimerTick.From_SERVER = (pk) => {
		$store.set($timer, pk);
	};
	
	
	//## MISC
	
	// defs.GameInfo.From_SERVER = (pk) => {
	// 	$store.set($gameInfo, pk);
	// };
	
	
}
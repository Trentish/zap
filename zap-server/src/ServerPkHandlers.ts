import {ZapPacketDefs} from '../../zap-shared/_Packets.js';
import {ClientConn, ZapServer} from './ZapServer.js';
import {ArticleDat, GameDat, TimerDat} from '../../zap-shared/_Dats.js';
import {nanoid} from 'nanoid';


// TODO: break this up at some point?
export function InitializePackets_SERVER(defs: ZapPacketDefs<ClientConn>, server: ZapServer) {
	
	//## SYSTEM
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
	
	
	//## ARTICLES
	
	defs.PostArticle.From_CLIENT = (pk, src) => {
		console.log(`PostArticle receive from ${src.label}`, pk);
		const game = src.game;
		if (!game) throw new Error(`TODO: PostArticle but not in game`);
		
		const gameDat: GameDat = game.db.current;
		const id = gameDat.lastId + 1;
		const now = new Date();
		
		const article: ArticleDat = {
			id: id,
			guid: nanoid(16),
			createdAt: now.toJSON(),
			headline: pk.headline,
			author: pk.author,
			orgIdf: pk.orgIdf,
			themeTags: ['TODO'], // TODO
		};
		
		console.log(`created Article: ${article.id} ${article.headline}`);
		
		gameDat.lastId = id;
		gameDat.articles.push(article);
		game.db.Save();
		
		defs.ArticleAdded.Send(game.toAllClients, article);
	};
	
	defs.RequestAllArticles.From_CLIENT = (pk, src) => {
		const game = src.game;
		if (!game) throw new Error(`TODO: RequestAllArticles but not in game`);
		
		console.log(`request for all articles, count: ${game.db.current.articles.length}`);
		defs.ArticleList.Send(src.toSocket, {
			articles: game.db.current.articles,
		});
	};
	
	defs.ResetGame.From_ADMIN = (pk, src) => {
		const game = src.game;
		if (!game) throw new Error(`TODO: ResetGame but not in game`);
		
		return server.ResetGame(game);
	};
	
	// defs.RequestArticles.From_CLIENT = (pk, src) => {
	// 	const game = src.game;
	// 	if (!game) throw new Error(`TODO: RequestArticles but not in game`);
	//
	// 	const gameDat: GameDat = game.db.current;
	//
	// 	const articles = gameDat.articles.slice(pk.min, pk.max);
	//
	// 	defs.ArticleList.Send(src.toSocket, {
	// 		clearExisting: false,
	// 		articles: articles,
	// 	});
	// };
	
	
	//## TIMER
	
	defs.SetTimer.From_ADMIN = (pk, src) => {
		const game = src.game;
		if (!game) throw new Error(`TODO: SetTimer but not in game`);
		
		game.timer.label = pk.label;
		if (pk.ms >= 0) game.timer.ms = pk.ms;
		server.SendTimer(game, game.toAllClients);
	};
	
	
	//## MISC
	
	defs.DbForceLoad.From_ADMIN = (pk, src) => src.game?.db.Load();
	defs.DbForceSave.From_ADMIN = (pk, src) => src.game?.db.Save();
	defs.DbForceBackup.From_ADMIN = (pk, src) => src.game?.db.Backup();
	
}
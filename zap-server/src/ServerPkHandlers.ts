import {ZapPacketDefs} from '../../zap-shared/_Packets.js';
import {ClientConn, ZapServer} from './ZapServer.js';
import {ArticleDat, GameDat, TimerDat} from '../../zap-shared/_Dats.js';
import {nanoid} from 'nanoid';


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
	
	defs.PostArticle.From_CLIENT = (pk, src) => {
		console.log(`PostArticle receive from ${src.label}`, pk);
		const game = src.game;
		if (!game) throw new Error(`TODO: PostArticle but not in game`);
		
		const article = new ArticleDat();
		article.guid = nanoid(16);
		article.createdAt = new Date();
		article.headline = pk.headline;
		article.author = pk.author;
		article.orgIdf = 'TODO'; // TODO
		article.themeTags = ['TODO']; // TODO
		
		console.log(`created Article: ${article.guid} ${article.headline}`);
		
		game.db.current.articles.push(article);
		game.db.Save();
		
		defs.ArticleAdded.Send(game.toAllClients, article);
	};
	
	defs.SetTimer.From_ADMIN = (pk, src) => {
		const game = src.game;
		if (!game) throw new Error(`TODO: not in game`);
		
		game.timer.label = pk.label;
		if (pk.ms >= 0) game.timer.ms = pk.ms;
		server.SendTimer(game, game.toAllClients);
	};
	
	defs.DbTestLoad.From_ADMIN = (pk, src) => {
		src.game?.db.Load();
	};
	
	defs.DbTestSave.From_ADMIN = (pk, src) => {
		src.game?.db.Save();
	};
	
	defs.ClearAllArticles.From_ADMIN = (pk, src) => {
		const game = src.game;
		if (!game) return;
		
		const gameDat = game.db.current;
		if (!gameDat) return;
		
		console.log(`CLEARING all articles for ${game.idf}`);
		
		gameDat.articles = [];
		game.db.Save();
		
		
		defs.GameDat.Send(game.toAllClients, gameDat);
	};
	
	
}
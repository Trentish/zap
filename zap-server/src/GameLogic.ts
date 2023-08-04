import {GamePersist, SpotlightPhase, ZapGame} from './ZapGame.js';
import {ClientConn, ZapServer} from './ZapServer.js';
import {E_Endpoint, T_GameIdf} from '../../zap-shared/SystemTypes.js';
import {ZapDb} from './ZapDb.js';
import {
	ArticleDat,
	HEADLINE_SIZE,
	PostArticleDat,
	SetTimerDat, SituationDat
} from '../../zap-shared/_Dats.js';
import {RangeToRange} from '../../zap-shared/Maths.js';

const TICK_RATE_MS = 1000;
const STARTING_TIMER_LABEL = 'Game Turn';
const STARTING_TIMER_MS = 30 * 60 * 1000;
const DB_BACKUP_MS = 5 * 60 * 1000;
const ARTICLE_COUNT_INITIAL_SEND = 12; // TODO: config/elsewhere
/** will be affected by tick rate */
const SPOTLIGHT_DURATION_MS: [number, number] = [10000, 25000];
const SPOTLIGHT_COOLDOWN_MS = 3000; // must be >= max outro

export function MakeGame(idf: T_GameIdf, server: ZapServer): ZapGame {
	const game = new ZapGame();
	game.idf = idf;
	game.toAllClients = `${idf}/all`;
	game.toAdmins = `${idf}/admins`;
	game.toPlayers = `${idf}/players`;
	game.toProjectors = `${idf}/projectors`;
	
	const gamePersist = new GamePersist();
	gamePersist.idf = idf;
	gamePersist.lastId = 0;
	gamePersist.articles = [];
	
	game.db = new ZapDb<GamePersist>(
		gamePersist, {
			folderPath: `${server.storagePath}/${idf}`,
			backupIntervalMs: DB_BACKUP_MS,
		});
	game.db.onLoad = () => DbOnLoad(game, server);
	
	game.timer = {
		label: STARTING_TIMER_LABEL,
		ms: STARTING_TIMER_MS,
	};
	game.lastTick = Date.now();
	game.tickInterval = setInterval(() => TickGame(game, server), TICK_RATE_MS);
	TickGame(game, server);
	
	return game;
}

export function DbOnLoad(game: ZapGame, server: ZapServer) {
	console.log(`game ${game.idf}, loaded db`);
	
	const gamePersist = game.db.current;
	const lastArticleIndex = gamePersist.articles.length - 1;
	
	const lastId = lastArticleIndex >= 0
		? gamePersist.articles[lastArticleIndex].id
		: -1;
	
	game.spotlight = {
		spotlightId: -1,
		pendingAboveId: lastId,
	}
	game.spotlightIndex = lastArticleIndex;
	game.spotlightTime = 0;
	game.spotlightPhase = SpotlightPhase.NONE;
	SendSpotlight(game, server);
	
	SendInitialArticles(game, game.toAllClients, server);
}

// TODO: more resilient time syncing
export function TickGame(game: ZapGame, server: ZapServer) {
	const nowEpochMs = Date.now();
	const deltaTime = nowEpochMs - game.lastTick;
	game.lastTick = nowEpochMs;
	
	game.timer.ms = game.timer.ms - deltaTime;
	SendTimer(game, server);
	
	TickSpotlight(game, server, deltaTime);
}

function TickSpotlight(game: ZapGame, server: ZapServer, deltaTime: number) {
	const gamePersist = game.db.current;
	const lastArticleIndex = gamePersist.articles.length - 1;
	
	switch (game.spotlightPhase) {
		
		case SpotlightPhase.NONE:
			if (game.spotlightIndex >= lastArticleIndex) return; //>> no pending
			
			++game.spotlightIndex;
			
			const articleToSpotlight = gamePersist.articles[game.spotlightIndex];
			const headlineLength = articleToSpotlight.headline.length;
			
			game.spotlightTime = RangeToRange(headlineLength, HEADLINE_SIZE, SPOTLIGHT_DURATION_MS);
			game.spotlightPhase = SpotlightPhase.SPOTLIGHT;
			
			game.spotlight = {
				spotlightId: articleToSpotlight.id,
				pendingAboveId: articleToSpotlight.id,
			};
			
			return SendSpotlight(game, server); //>> start spotlight
		
		case SpotlightPhase.SPOTLIGHT:
			game.spotlightTime -= deltaTime;
			if (game.spotlightTime >= 0) return; //>> wait on spotlight
			
			game.spotlightTime = SPOTLIGHT_COOLDOWN_MS;
			game.spotlightPhase = SpotlightPhase.COOLDOWN;
			game.spotlight = {
				spotlightId: -1,
				pendingAboveId: game.spotlight.pendingAboveId,
			};
			
			return SendSpotlight(game, server); //>> start cooldown
		
		case SpotlightPhase.COOLDOWN:
			game.spotlightTime -= deltaTime;
			if (game.spotlightTime >= 0) return; //>> wait on cooldown
			
			game.spotlightPhase = SpotlightPhase.NONE;
			return TickSpotlight(game, server, 0);
	}
}

export function ForceSpotlight(game: ZapGame, id: number, server: ZapServer) {
	const articleIndex = game.db.current.articles.findIndex(a => a.id === id);
	if (articleIndex < 0) return; //>> can't find article by id
	
	game.spotlight = {
		spotlightId: -1,
		pendingAboveId: id - 1,
	}
	game.spotlightIndex = articleIndex - 1;
	game.spotlightTime = 0;
	game.spotlightPhase = SpotlightPhase.NONE;
	SendSpotlight(game, server);
}

export function SetTimer(game: ZapGame, setTimerDat: SetTimerDat, server: ZapServer) {
	game.timer.label = setTimerDat.label || '';
	if (!setTimerDat.setLabelOnly) {
		game.timer.ms = setTimerDat.ms || 0;
		game.lastTick = Date.now();
	}
	SendTimer(game, server);
}

const SendTimer = (
	game: ZapGame,
	server: ZapServer,
) => server.packets.TimerTick.Send(game.toAllClients, game.timer);

const SendSpotlight = (
	game: ZapGame,
	server: ZapServer,
) => server.packets.SetSpotlight.Send(game.toAllClients, game.spotlight);

export function SetSituation(game: ZapGame, setSituation: SituationDat, server: ZapServer) {
	game.situation = setSituation;
	SendSituation(game, server);
}

const SendSituation = (
	game: ZapGame,
	server: ZapServer
) => server.packets.Situation.Send(game.toAllClients, game.situation);

export function AddClientToGame(game: ZapGame, client: ClientConn, server: ZapServer) {
	RemoveClientFromGame(client, server);
	
	client.game = game;
	server.UpdateLabel(client);
	
	game.allClients.set(client.id, client);
	client.socket.subscribe(game.toAllClients);
	
	switch (client.endpoint) {
		case E_Endpoint.admin:
			game.admins.set(client.id, client);
			client.socket.subscribe(game.toAdmins);
			break;
		case E_Endpoint.player:
			game.players.set(client.id, client);
			client.socket.subscribe(game.toPlayers);
			break;
		case E_Endpoint.projector:
			game.projectors.set(client.id, client);
			client.socket.subscribe(game.toProjectors);
			break;
	}
	
	SendTimer(game, server);
	SendSpotlight(game, server);
	SendInitialArticles(game, client.toSocket, server);
	
	console.log(`${game} added: ${client.label}`);
}

export function RemoveClientFromGame(client: ClientConn, server: ZapServer) {
	const game = client.game;
	if (!game) return; //>> no game
	
	client.game = null;
	server.UpdateLabel(client);
	
	game.allClients.delete(client.id);
	game.admins.delete(client.id);
	game.players.delete(client.id);
	game.projectors.delete(client.id);
	
	client.socket.unsubscribe(game.toAllClients);
	client.socket.unsubscribe(game.toAdmins);
	client.socket.unsubscribe(game.toPlayers);
	client.socket.unsubscribe(game.toProjectors);
	
	console.log(`${game} removed: ${client.label}`);
	
	// TODO: check if game should still be alive
}

export async function ResetGame(game: ZapGame, server: ZapServer) {
	console.log(`RESETTING game ${game.idf}`);
	
	await game.db.Backup();
	
	game.db.current = {
		idf: game.idf,
		lastId: 0,
		articles: [],
	};
	
	game.lastTick = Date.now();
	game.timer = {
		label: STARTING_TIMER_LABEL,
		ms: STARTING_TIMER_MS,
	};
	
	game.spotlight = {
		spotlightId: -1,
		pendingAboveId: -1,
	};
	game.spotlightIndex = -1;
	game.spotlightTime = 0;
	game.spotlightPhase = SpotlightPhase.NONE;
	
	SendInitialArticles(game, game.toAllClients, server);
	
	return game.db.Save();
}

export function AddArticle(game: ZapGame, postArticleDat: PostArticleDat, server: ZapServer) {
	const gamePersist: GamePersist = game.db.current;
	const id = gamePersist.lastId + 1;
	const now = new Date();
	
	const article: ArticleDat = {
		id: id,
		// guid: nanoid(16),
		createdAt: now.toJSON(),
		headline: postArticleDat.headline,
		author: postArticleDat.author,
		orgIdf: postArticleDat.orgIdf,
		location: postArticleDat.location,
		themeTags: ['TODO'], // TODO
	};
	
	console.log(`created Article: ${article.id} ${article.headline}`);
	
	gamePersist.lastId = id;
	gamePersist.articles.push(article);
	
	server.packets.ArticleAdded.Send(game.toAllClients, article);
	
	return game.db.Save();
}


function SendInitialArticles(game: ZapGame, to: string, server: ZapServer) {
	server.packets.ArticleList.Send(to, {
		articles: game.db.current.articles.slice(-ARTICLE_COUNT_INITIAL_SEND),
	});
}

export function SendAllArticles(game: ZapGame, client: ClientConn, server: ZapServer) {
	server.packets.ArticleList.Send(client.toSocket, {
		articles: game.db.current.articles,
	});
}
import {T_GameIdf, T_Serials} from './SystemTypes.ts';

export interface PostArticleDat {
	headline: string;
	author: string;
	orgIdf: string; // TODO
}

export interface ArticleDat {
	id: number;
	guid: string; // TODO: delete?
	createdAt: string;
	headline: string;
	author: string;
	orgIdf: string;
	themeTags: string[];
	// tickerVisible: boolean; // maybe?
	// sound, etc.?
	
	// constructor(id: number) {
	// 	this.id = id;
	// }
	//
	// static Serials: T_Serials<ArticleDat> = [
	// 	(article) => (
	// 		{
	// 			id: article.id,
	// 			guid: article.guid,
	// 			createdAt: article.createdAt.toJSON(),
	// 			headline: article.headline,
	// 			author: article.author,
	// 			orgIdf: article.orgIdf,
	// 			themeTags: article.themeTags,
	// 		}
	// 	),
	// 	(obj) => (
	// 		{
	// 			id: obj.id,
	// 			guid: obj.guid,
	// 			createdAt: new Date(obj.createdAt ?? 0),
	// 			headline: obj.headline,
	// 			author: obj.author,
	// 			orgIdf: obj.orgIdf,
	// 			themeTags: obj.themeTags,
	// 		} as ArticleDat
	// 	),
	// ];
}

// export interface GameInfoDat {
// 	idf: T_GameIdf;
// 	articleCount: number;
// }

// TODO: server only?
export interface GameDat {
	idf: T_GameIdf;
	lastId: number;
	articles: ArticleDat[];
	
	// static Serials: T_Serials<GameDat> = [
	// 	(game) => (
	// 		{
	// 			idf: game.idf,
	// 			articles: game.articles?.map(ArticleDat.Serials[0]),
	// 		}
	// 	),
	// 	(obj) => (
	// 		{
	// 			idf: obj.idf,
	// 			articles: obj.articles?.map(ArticleDat.Serials[1]),
	// 		} as GameDat
	// 	),
	// ];
}


export interface ArticleListDat {
	articles: ArticleDat[];
	
	// static Serials: T_Serials<ArticleListDat> = [
	// 	(dat) => (
	// 		{
	// 			articles: dat.articles?.map(ArticleDat.Serials[0]),
	// 		}
	// 	),
	// 	(obj) => (
	// 		{
	// 			articles: obj.articles?.map(ArticleDat.Serials[1]),
	// 		} as ArticleListDat
	// 	),
	// ];
}


// TODO: use or not?
export interface OrgDat {
	idf: string,
	proper_name: string,
	// logo, etc.?
}

// TODO: 'tick' messages could be optimized later
export interface TimerDat {
	label: string,
	/** set to -1 to ignore this field (i.e. change label only) */
	ms: number,
}

//  Oath, Grudge, Triumph, Calamity, Discovery, Gossip, Doom
// export type T_Theme = {
// 	Idf: string,
// 	// sound, etc.?
// }
// articlesObj: Record<string, ArticleDat0>;
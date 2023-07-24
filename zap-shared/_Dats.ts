import {T_GameIdf, T_Serials} from './SystemTypes.ts';


export class ArticleDat {
	guid: string;
	createdAt: Date;
	headline: string;
	author: string;
	orgIdf: string;
	themeTags: string[];
	// tickerVisible: boolean; // maybe?
	// sound, etc.?
	
	
	static Serials: T_Serials<ArticleDat> = [
		(article) => (
			{
				guid: article.guid,
				createdAt: article.createdAt.toJSON(),
				headline: article.headline,
				author: article.author,
				orgIdf: article.orgIdf,
				themeTags: article.themeTags,
			}
		),
		(obj) => (
			{
				guid: obj.guid,
				createdAt: new Date(obj.createdAt ?? 0),
				headline: obj.headline,
				author: obj.author,
				orgIdf: obj.orgIdf,
				themeTags: obj.themeTags,
			} as ArticleDat
		),
	];
}


export class GameDat {
	idf: T_GameIdf;
	articles: ArticleDat[];
	
	static Serials: T_Serials<GameDat> = [
		(game) => (
			{
				idf: game.idf,
				articles: game.articles?.map(ArticleDat.Serials[0]),
			}
		),
		(obj) => (
			{
				idf: obj.idf,
				articles: obj.articles?.map(ArticleDat.Serials[1]),
			} as GameDat
		),
	];
}

// TODO: use or not?
export type OrgDat = {
	idf: string,
	proper_name: string,
	// logo, etc.?
}

// TODO: 'tick' messages could be optimized later
export type TimerDat = {
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
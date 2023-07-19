import {T_GameIdf, T_Serials} from './SystemTypes.ts';


export class ArticleDat {
	guid: string;
	createdAt: Date;
	headline: string;
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
				orgIdf: article.orgIdf,
				themeTags: article.themeTags,
			}
		),
		(obj) => (
			{
				guid: obj.guid,
				createdAt: new Date(obj.createdAt ?? 0),
				headline: obj.headline,
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

export type TimerDat = {
	ms: number,
	// TODO: label?
}

//  Oath, Grudge, Triumph, Calamity, Discovery, Gossip, Doom
// export type T_Theme = {
// 	Idf: string,
// 	// sound, etc.?
// }
// articlesObj: Record<string, ArticleDat0>;
import {T_GameIdf, T_Packet} from './SystemTypes.ts';


export class ArticleDat {
	guid: string;
	createdAt: Date;
	headline: string;
	orgIdf: string;
	themeTags: string[];
	// tickerVisible: boolean; // maybe?
	// sound, etc.?
	
	
	static FromJsonObj = (obj: ArticleDat) => (
		{
			guid: obj.guid,
			createdAt: new Date(obj.createdAt),
			headline: obj.headline,
			orgIdf: obj.orgIdf,
			themeTags: obj.themeTags,
		} as ArticleDat
	);
	
	static ToJsonObj = (article: ArticleDat) => (
		{
			guid: article.guid,
			createdAt: article.createdAt.toJSON(),
			headline: article.headline,
			orgIdf: article.orgIdf,
			themeTags: article.themeTags,
		}
	);
	
	static Serials: [(obj: ArticleDat) => ArticleDat, (pk: ArticleDat) => T_Packet] = [
		ArticleDat.FromJsonObj,
		ArticleDat.ToJsonObj,
	];
}


export class GameDat {
	idf: T_GameIdf;
	articles: ArticleDat[];
	
	static ToJsonObj = (game: GameDat) => (
		{
			idf: game.idf,
			articles: game.articles?.map(ArticleDat.ToJsonObj),
		}
	);
	
	static FromJsonObj = (obj: Partial<GameDat>) => (
		{
			idf: obj.idf,
			articles: obj.articles?.map(ArticleDat.FromJsonObj),
		} as GameDat
	);
	
	static Serials: [(obj: GameDat) => GameDat, (pk: GameDat) => T_Packet] = [
		GameDat.FromJsonObj,
		GameDat.ToJsonObj,
	];
}


export type OrgDat = {
	idf: string,
	proper_name: string,
	// logo, etc.?
}

//  Oath, Grudge, Triumph, Calamity, Discovery, Gossip, Doom
// export type T_Theme = {
// 	Idf: string,
// 	// sound, etc.?
// }
// articlesObj: Record<string, ArticleDat0>;
//
// articlesObj: Object.entries(game.articlesObj).reduce(
// 	(obj, [key, val]) => {
// 		obj[key] = ArticleDat0.ToJsonObj(val);
// 		return obj;
// 	}, {}),
//
// articlesObj: Object.entries(obj.articles).reduce(
// 	(obj, [key, val]) => {
// 		obj[key] = ArticleDat0.FromJsonObj(val);
// 		return obj;
// 	}, {}),
//
// static JsonReplacer(key: string, value) {
// 	switch (key) {
// 		case 'articles':
// 			return JSON.stringify(value, ArticleDat0.JsonReplacer);
// 	}
// 	return value;
// }
//
// static JsonReviver(key: string, value) {
// 	switch (key) {
// 		case 'articles':
// 			return new Date(value);
// 	}
// 	return value;
// }
// export type ArticleDat = {
// 	guid: number,
// 	created_at: Date, // TODO: will Date type actually work? need json reviver?
// 	headline: string,
//
// 	org_idf: string,
// 	theme_tags: string[],
// 	// tickerVisible: boolean, // maybe?
// 	// sound, etc.?
// }
//
//
// static JsonReplacer(key: string, value) {
// 	switch (key) {
// 		case 'createdAt':
// 			return value.toJSON();
// 	}
// 	return value;
// }
//
// static JsonReviver(key: string, value) {
// 	switch (key) {
// 		case 'createdAt':
// 			return new Date(value);
// 	}
// 	return value;
// }
// static ToJson(article: ArticleDat0): string {
// 	return JSON.stringify(article, (key, value) => {
// 		switch (key) {
// 			case 'createdAt':
// 				return value.toJSON();
// 		}
// 		return value;
// 	});
// 	return JSON.stringify({
// 		guid: article.guid,
// 		createdAt: article.createdAt.toJSON(),
// 		headline: article.headline,
// 		orgIdf: article.orgIdf,
// 		themeTags: article.themeTags,
// 	});
// }
//
// static FromJson(json: string): ArticleDat0 {
// 	const parsed = JSON.parse(json);
// 	return new ArticleDat0();
// }
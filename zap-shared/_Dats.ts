import {T_GameIdf} from './SystemTypes.ts';

export interface PostArticleDat {
	headline: string;
	author: string;
	orgIdf: string; // TODO
}

export interface ArticleDat {
	id: number;
	createdAt: string;
	headline: string;
	author: string;
	orgIdf: string;
	themeTags: string[];
	// tickerVisible: boolean; // maybe?
	// sound, etc.?
}

// TODO: server only?
export interface GameDat {
	idf: T_GameIdf;
	lastId: number;
	articles: ArticleDat[];
}


export interface ArticleListDat {
	articles: ArticleDat[];
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
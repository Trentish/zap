import {T_GameIdf} from './SystemTypes.ts';

export const HEADLINE_MIN_SIZE = 1;
export const HEADLINE_MAX_SIZE = 150;
export const HEADLINE_SIZE: [number, number] = [HEADLINE_MIN_SIZE, HEADLINE_MAX_SIZE];

export interface PostArticleDat {
	headline: string;
	author: string;
	orgIdf: string;
	location?: string;
}

export interface ArticleDat {
	id: number;
	createdAt?: string;
	headline: string;
	author?: string;
	orgIdf: string;
	location?: string;
	themeTags?: string[]; // TODO: currently unused
	// tickerVisible: boolean; // maybe?
	// sound, etc.?
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

export interface SpotlightDat {
	spotlightId: number, // article ID
	pendingAboveId: number, // article IDs above will be hidden/pending
}

export interface SetTimerDat {
	label?: string,
	ms?: number,
	setLabelOnly?: boolean,
	keepPhase?: boolean,
}

// TODO: 'tick' messages could be optimized later
export interface TimerDat {
	label: string,
	/** set to -1 to ignore this field (i.e. change label only) */
	ms: number,
	phaseIndex: number,
}

export interface PhaseOptionsDat {
	phases: PhaseDat[],
	index: number,
}

export interface PhaseDat {
	label: string,
	ms: number,
}

export interface SituationDat {
	label: string,
	cssClass: string,
}

export interface SetStatDat {
	index: number,
	value: string,
}

export interface AllStatsDat {
	values: string[],
}

//  Oath, Grudge, Triumph, Calamity, Discovery, Gossip, Doom
// export type T_Theme = {
// 	Idf: string,
// 	// sound, etc.?
// }
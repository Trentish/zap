export type ArticleDat = {
	guid: number,
	created_at: Date,
	headline: string,
	
	org_idf: string,
	theme_tags: string[],
	// tickerVisible: boolean, // maybe?
	// sound, etc.?
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

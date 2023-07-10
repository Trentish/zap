export type T_Article = {
	guid: number,
	createdAt: Date,
	headline: string,
	
	orgIdf: string,
	themeTags: string[],
	// tickerVisible: boolean, // maybe?
	// sound, etc.?
}

export type T_Org = {
	idf: string,
	properName: string,
	// logo, etc.?
}

//  Oath, Grudge, Triumph, Calamity, Discovery, Gossip, Doom
// export type T_Theme = {
// 	Idf: string,
// 	// sound, etc.?
// }

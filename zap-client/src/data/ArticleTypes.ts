export type T_Article = {
	Guid: number,
	Headline: string,
	Type: E_ArticleType,
}

export enum E_ArticleType {
	Oath,
	Grudge,
	Triumph,
	Calamity,
	Discovery,
	Gossip,
	Doom,
}

export type T_Org = {
	Idf: string,
	ProperName: string,
}
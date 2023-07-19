import {BasePacketDefs, E_Endpoint, I_PkSource, T_GameIdf} from './SystemTypes.ts';
import {ArticleDat, GameDat} from './_Dats.ts';

export class ZapPacketDefs<TSrc extends I_PkSource> extends BasePacketDefs<TSrc> {
	
	Log = this.SERVER_to_CLIENT<string>();
	
	DemandRegister = this.SERVER_to_CLIENT<{
		Games: T_GameIdf[],
	}>();
	
	Register = this.CLIENT_to_SERVER<{
		Endpoint: E_Endpoint;
		GameIdf: T_GameIdf;
	}>();
	
	ArticleTest = this.SERVER_to_PROJECTOR<ArticleDat>();
	
	// PostArticle = this.CLIENT_to_SERVER<ArticleDat>();
	PostArticle = this.CLIENT_to_SERVER<{
		headline: string,
	}>();
	
	SetTimer = this.ADMIN_to_SERVER<{
		ms: number
	}>();
	
	TimerTick = this.SERVER_to_CLIENT<{
		ms: number
	}>();
	
	GameDat = this.SERVER_to_CLIENT<GameDat>();
	ArticleAdded = this.SERVER_to_CLIENT<ArticleDat>();
	
	DbTestLoad = this.ADMIN_to_SERVER<string>();
	DbTestSave = this.ADMIN_to_SERVER<string>();
	
	ClearAllArticles = this.ADMIN_to_SERVER<string>();
	
	constructor() {
		super();
		this.AssignPacketIds();
	}
}
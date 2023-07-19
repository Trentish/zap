import {BasePacketDefs, E_Endpoint, I_PkSource, T_GameIdf} from './SystemTypes.ts';
import {ArticleDat, GameDat, TimerDat} from './_Dats.ts';

export class ZapPacketDefs<TSrc extends I_PkSource> extends BasePacketDefs<TSrc> {
	
	Log = this.SERVER_to_CLIENT<string>();
	
	DemandRegister = this.SERVER_to_CLIENT<{
		Games: T_GameIdf[],
	}>();
	
	Register = this.CLIENT_to_SERVER<{
		Endpoint: E_Endpoint;
		GameIdf: T_GameIdf;
	}>();
	
	PostArticle = this.CLIENT_to_SERVER<{
		headline: string,
	}>();
	
	SetTimer = this.ADMIN_to_SERVER<TimerDat>();
	TimerTick = this.SERVER_to_CLIENT<TimerDat>();
	
	GameDat = this.SERVER_to_CLIENT<GameDat>().WithSerials(GameDat.Serials);
	ArticleAdded = this.SERVER_to_CLIENT<ArticleDat>().WithSerials(ArticleDat.Serials);
	
	DbTestLoad = this.ADMIN_to_SERVER<string>();
	DbTestSave = this.ADMIN_to_SERVER<string>();
	
	ClearAllArticles = this.ADMIN_to_SERVER<string>();
	
	constructor() {
		super();
		this.AssignPacketIds();
	}
}
import {BasePacketDefs, E_Endpoint, I_PkSource, T_GameIdf} from './SystemTypes.ts';
import {ArticleDat, ArticleListDat, PostArticleDat, TimerDat} from './_Dats.ts';

type none = string; // no packet

export class ZapPacketDefs<TSrc extends I_PkSource> extends BasePacketDefs<TSrc> {
	
	//## SYSTEM
	Log = this.SERVER_to_CLIENT<string>();
	DemandRegister = this.SERVER_to_CLIENT<{
		Games: T_GameIdf[],
	}>();
	Register = this.CLIENT_to_SERVER<{
		Endpoint: E_Endpoint;
		GameIdf: T_GameIdf;
	}>();
	
	
	//## ARTICLES
	PostArticle = this.CLIENT_to_SERVER<PostArticleDat>();
	RequestAllArticles = this.CLIENT_to_SERVER<none>();
	ResetGame = this.ADMIN_to_SERVER<none>();
	
	ArticleAdded = this.SERVER_to_CLIENT<ArticleDat>(); // .WithSerials(ArticleDat.Serials);
	ArticleList = this.SERVER_to_CLIENT<ArticleListDat>(); // .WithSerials(ArticleListDat.Serials);
	
	
	//## TIMER
	SetTimer = this.ADMIN_to_SERVER<TimerDat>();
	TimerTick = this.SERVER_to_CLIENT<TimerDat>();
	
	
	//## MISC
	DbForceLoad = this.ADMIN_to_SERVER<none>();
	DbForceSave = this.ADMIN_to_SERVER<none>();
	DbForceBackup = this.ADMIN_to_SERVER<none>();
	
	
	constructor() {
		super();
		this.AssignPacketIds();
	}
}
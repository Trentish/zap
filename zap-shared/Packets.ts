import {BasePacketDefs, E_Endpoint, I_PkSource, T_GameIdf} from './SystemTypes.ts';
import {ArticleDat} from './ArticleTypes.ts';

export class ZapPacketDefs<TSrc extends I_PkSource> extends BasePacketDefs<TSrc> {
	
	Pk_Log = this.SERVER_to_CLIENT<string>();
	
	Pk_DemandRegister = this.SERVER_to_CLIENT<{
		Games: T_GameIdf[],
	}>();
	
	Pk_Register = this.CLIENT_to_SERVER<{
		GameIdf: T_GameIdf;
		Endpoint: E_Endpoint;
	}>();
	
	Pk_ArticleTest = this.SERVER_to_PROJECTOR<ArticleDat>();
	
	
	constructor() {
		super();
		this.AssignPacketIds();
	}
}
import {BasePacketDefs, E_Endpoint, I_PkSource, T_GameIdf} from './SystemTypes.ts';
import {ArticleDat} from './_Dats.ts';

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
	
	
	constructor() {
		super();
		this.AssignPacketIds();
	}
}
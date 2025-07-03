import {T_ClientId, T_GameIdf} from '../../zap-shared/SystemTypes.js';
import {ClientConn} from './ZapServer.js';
import {ZapDb} from './ZapDb.js';
import {
	AllStatsDat,
	ArticleDat,
	SituationDat,
	SpotlightDat,
	TimerDat,
} from '../../zap-shared/_Dats.js';

export class ZapGame {
	idf: T_GameIdf;
	toAllClients: string; // `gameIdf/all`
	toAdmins: string; // `gameIdf/admins`
	toPlayers: string; // `gameIdf/players`
	toProjectors: string; // `gameIdf/projectors`
	
	allClients = new Map<T_ClientId, ClientConn>();
	admins = new Map<T_ClientId, ClientConn>();
	players = new Map<T_ClientId, ClientConn>();
	projectors = new Map<T_ClientId, ClientConn>();
	
	/** instance of ZapDb specific to this ZapGame */
	db: ZapDb<GamePersist>;
	lastTick: number;
	timer: TimerDat = {
		label: '',
		ms: 0,
	};
	situation: SituationDat = {
		label: '',
		cssClass: '',
	};
	tickInterval: NodeJS.Timer;
	
	spotlight: SpotlightDat = {
		spotlightId: -1,
		pendingAboveId: -1,
	};
	spotlightIndex: number = -1;
	spotlightTime: number = 0;
	spotlightPhase: SpotlightPhase = SpotlightPhase.NONE;
	
	public toString(): string {return `game(${this.idf}, clients: ${this.allClients.size})`;}
}

export class GamePersist {
	idf: T_GameIdf;
	lastId: number;
	articles: ArticleDat[];
	allStats: AllStatsDat;
}

export enum SpotlightPhase {
	NONE,
	SPOTLIGHT,
	COOLDOWN,
}
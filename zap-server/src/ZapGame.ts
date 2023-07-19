import {T_ClientId, T_GameIdf} from '../../zap-shared/SystemTypes.js';
import {ClientConn} from './ZapServer.js';
import {ZapDb} from './ZapDb.js';
import {ArticleDat, GameDat} from '../../zap-shared/_Dats.js';

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
	
	db: ZapDb<GameDat>;
	
	public toString(): string {return `game(${this.idf}, clients: ${this.allClients.size})`;}
}
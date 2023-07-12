import {T_ClientId, T_GameIdf} from '../../zap-shared/SystemTypes.js';
import {ClientConn} from './ZapServer.js';

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
}
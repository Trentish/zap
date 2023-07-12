export type T_SocketMsg = {
	id: T_MsgId,
	packet: T_Packet,
}

export type T_MsgId = number;
export type T_Packet = object | string;

/** will be string if error, otherwise undefined */
export type T_MaybeError = string | undefined | void;

export type T_ClientId = number;
export type T_GameIdf = string;

export enum E_Endpoint {
	unknown,
	server,
	client, // generic/debug use only, prefer specific client types below:
	admin,
	player,
	projector,
}

// TODO: maybe rename to Conn or something?
export interface I_PkSource {}


export class BasePkHandler<TSrc extends I_PkSource> {
	id: T_MsgId;
	name: string;
	from: E_Endpoint;
	to: E_Endpoint;
	
	Handle(
		msg: T_SocketMsg,
		from: E_Endpoint,
		to: E_Endpoint,
		src: TSrc,
	): T_MaybeError {}
	
	Send: (packet: T_Packet, address: string) => void;
	
	public toString(): string {return `${this.name}(#${this.id}, ${this.from} --> ${this.to}`;}
}

export class PkHandler<TPk extends T_Packet, TSrc extends I_PkSource> extends BasePkHandler<TSrc> {
	protected From_SERVER: (pk: TPk) => void;
	protected From_CLIENT: (pk: TPk, src: TSrc) => void;
	protected From_ADMIN: (pk: TPk, src: TSrc) => void;
	protected From_PLAYER: (pk: TPk, src: TSrc) => void;
	protected From_PROJECTOR: (pk: TPk, src: TSrc) => void;
	
	Handle(
		msg: T_SocketMsg,
		from: E_Endpoint,
		to: E_Endpoint,
		src: TSrc,
	): T_MaybeError {
		// if (from !== this.from) return `TODO: ${this}, from ${from} expected ${this.from}, ${msg}`;
		// if (to !== this.to) return `TODO: ${this}, to ${to} expected ${this.to}, ${msg}`;
		
		
		switch (from) {
			case E_Endpoint.unknown:
				return `bad message (from unknown) ${msg}`;
			case E_Endpoint.server:
				return this.From_SERVER
					? this.From_SERVER(msg.packet as TPk)
					: `${this} missing From_SERVER handler`;
			case E_Endpoint.client:
				return this.From_CLIENT
					? this.From_CLIENT(msg.packet as TPk, src)
					: `${this} missing From_CLIENT handler`;
			case E_Endpoint.admin:
				return this.From_ADMIN
					? this.From_ADMIN(msg.packet as TPk, src)
					: `${this} missing From_ADMIN handler`;
			case E_Endpoint.player:
				return this.From_PLAYER
					? this.From_PLAYER(msg.packet as TPk, src)
					: `${this} missing From_PLAYER handler`;
			case E_Endpoint.projector:
				return this.From_PROJECTOR
					? this.From_PROJECTOR(msg.packet as TPk, src)
					: `${this} missing From_PROJECTOR handler`;
		}
	}
	
}

export class ServerPkOutgoing<TPk extends T_Packet, TSrc extends I_PkSource> extends PkHandler<TPk, TSrc> {
	
	To_Client: (src: TSrc, pk: TPk) => void;
}

export class SERVER_to_CLIENT<TPk extends T_Packet, TSrc extends I_PkSource> extends PkHandler<TPk, TSrc> {
	From = E_Endpoint.server;
	To = E_Endpoint.client;
	From_SERVER: (pk: TPk) => void;
	To_Client: (toPublishTopic: string, pk: TPk) => void;
}

export class SERVER_to_ADMIN<TPk extends T_Packet, TSrc extends I_PkSource> extends PkHandler<TPk, TSrc> {
	From = E_Endpoint.server;
	To = E_Endpoint.admin;
	From_SERVER: (pk: TPk) => void;
}

export class SERVER_to_PLAYER<TPk extends T_Packet, TSrc extends I_PkSource> extends PkHandler<TPk, TSrc> {
	From = E_Endpoint.server;
	To = E_Endpoint.player;
	From_SERVER: (pk: TPk) => void;
}

export class SERVER_to_PROJECTOR<TPk extends T_Packet, TSrc extends I_PkSource> extends PkHandler<TPk, TSrc> {
	From = E_Endpoint.server;
	To = E_Endpoint.projector;
	From_SERVER: (pk: TPk) => void;
}

export class CLIENT_to_SERVER<TPk extends T_Packet, TSrc extends I_PkSource> extends PkHandler<TPk, TSrc> {
	From = E_Endpoint.client;
	To = E_Endpoint.server;
	From_CLIENT: (pk: TPk, src: TSrc) => void;
}

export class ADMIN_to_SERVER<TPk extends T_Packet, TSrc extends I_PkSource> extends PkHandler<TPk, TSrc> {
	From = E_Endpoint.admin;
	To = E_Endpoint.server;
	From_ADMIN: (pk: TPk, src: TSrc) => void;
}

export class PLAYER_to_SERVER<TPk extends T_Packet, TSrc extends I_PkSource> extends PkHandler<TPk, TSrc> {
	From = E_Endpoint.player;
	To = E_Endpoint.server;
	From_PLAYER: (pk: TPk, src: TSrc) => void;
}

export class PROJECTOR_to_SERVER<TPk extends T_Packet, TSrc extends I_PkSource> extends PkHandler<TPk, TSrc> {
	From = E_Endpoint.projector;
	To = E_Endpoint.server;
	From_PROJECTOR: (pk: TPk, src: TSrc) => void;
}

export class BasePacketDefs<TSrc extends I_PkSource> {
	protected StartingPacketId: number = 1;
	AllPkHandlers: BasePkHandler<TSrc>[] = [];
	
	AssignPacketIds() {
		let packetId = this.StartingPacketId;
		
		for (let [key, handler] of Object.entries(this)) {
			if (handler instanceof BasePkHandler) {
				handler.id = packetId;
				handler.name = key;
				this.AllPkHandlers.push(handler);
				console.log(`++packet ${handler.id} ${handler.name}`);
				packetId++;
			}
		}
		
		
		console.log(`${this.constructor.name} found ${this.AllPkHandlers.length} packets`);
	}
	
	SERVER_to_CLIENT = <TPk extends T_Packet>() => new SERVER_to_CLIENT<TPk, TSrc>();
	SERVER_to_ADMIN = <TPk extends T_Packet>() => new SERVER_to_ADMIN<TPk, TSrc>();
	SERVER_to_PLAYER = <TPk extends T_Packet>() => new SERVER_to_PLAYER<TPk, TSrc>();
	SERVER_to_PROJECTOR = <TPk extends T_Packet>() => new SERVER_to_PROJECTOR<TPk, TSrc>();
	CLIENT_to_SERVER = <TPk extends T_Packet>() => new CLIENT_to_SERVER<TPk, TSrc>();
	ADMIN_to_SERVER = <TPk extends T_Packet>() => new ADMIN_to_SERVER<TPk, TSrc>();
	PLAYER_to_SERVER = <TPk extends T_Packet>() => new PLAYER_to_SERVER<TPk, TSrc>();
	PROJECTOR_to_SERVER = <TPk extends T_Packet>() => new PROJECTOR_to_SERVER<TPk, TSrc>();
}
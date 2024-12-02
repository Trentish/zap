export type T_SocketMsg = {
	id: T_MsgId,
	ep: E_Endpoint,
	pk: T_Packet,
}

export type T_MsgId = number;
export type T_Packet = object | string;

/** will be string if error, otherwise undefined/void */
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
	history,
}

export enum E_ConnStatus {
	unset,
	initializing,
	connecting,
	connected,
	disconnected,
}

export type T_SerialToJsonObj<T> = (val: T) => Partial<T> | object;
export type T_SerialFromJsonObj<T> = (obj: Partial<T>) => T;
/** [to, from] */
export type T_Serials<T> = [T_SerialToJsonObj<T>, T_SerialFromJsonObj<T>];

// Serials: [(obj: TPk) => TPk,(pk: TPk) => T_Packet] = [obj => obj as TPk, pk => pk];

export function GetEndpoint(str: string): E_Endpoint {
	switch (str ? str.toLowerCase() : '') {
		default:
		case 'unknown':
			return E_Endpoint.unknown;
		case 'server':
			return E_Endpoint.server;
		case 'client':
			return E_Endpoint.client;
		case 'admin':
			return E_Endpoint.admin;
		case 'player':
			return E_Endpoint.player;
		case 'projector':
			return E_Endpoint.projector;
		case 'history':
			return E_Endpoint.history;
	}
}

// TODO: maybe rename to Conn or something?
export interface I_PkSource {
	endpoint: E_Endpoint;
}


export class BasePkHandler<TSrc extends I_PkSource> {
	id: T_MsgId;
	name: string;
	from: E_Endpoint;
	to: E_Endpoint;
	useClientCatchall: boolean;
	
	_Receive(
		msg: T_SocketMsg,
		src: TSrc,
	): T_MaybeError {}
	
	_Publish: (address: string, packet: T_Packet) => void;
	
	public toString(): string {return `${this.name}(#${this.id}, ${this.from} --> ${this.to})`;}
}

export class ServerPkOutgoing<TPk extends T_Packet, TSrc extends I_PkSource> extends BasePkHandler<TSrc> {
	Send = (address: string, pk: TPk) => this._Publish(address, this.SerializeTo(pk));
	
	// this will be on the CLIENT
	_Receive(
		msg: T_SocketMsg,
		src: TSrc,
	): T_MaybeError {
		const isUnexpected = !this.useClientCatchall && msg.ep !== this.to;
		if (isUnexpected) return `unexpected endpoint (to) ${msg.ep}, ${this}`;
		
		const pk = this.SerializeFrom(msg.pk as TPk);
		
		if (!this.From_SERVER) throw new Error(`missing PK handler ${this.name}`);
		this.From_SERVER(pk);
	}
	
	
	/** [to, from] */
	WithSerials(serials: T_Serials<TPk>) {
		this.Serials = serials;
		return this;
	}
	
	protected Serials: T_Serials<TPk> = [pk => pk, obj => obj as TPk];
	protected SerializeTo: T_SerialToJsonObj<TPk> = (pk) => this.Serials[0](pk);
	protected SerializeFrom: T_SerialFromJsonObj<TPk> = (obj) => this.Serials[1](obj);
	
	protected From_SERVER: (pk: TPk) => void;
}

export class ClientPkOutgoing<TPk extends T_Packet, TSrc extends I_PkSource> extends BasePkHandler<TSrc> {
	Send = (pk: TPk) => this._Publish('', this.SerializeTo(pk));
	
	// this will be on the SERVER
	_Receive(
		msg: T_SocketMsg,
		src: TSrc,
	): T_MaybeError {
		const pk = this.SerializeFrom(msg.pk as TPk);
		
		if (this.useClientCatchall) {
			this.From_CLIENT(pk, src);
			return; //>> client catch all
		}
		
		const from = src.endpoint;
		if (from !== this.from) return `unexpected endpoint (from) ${from}, ${this}`;
		
		switch (from) {
			case E_Endpoint.client:
				this.From_CLIENT(pk, src);
				return;
			case E_Endpoint.admin:
				this.From_ADMIN(pk, src);
				return;
			case E_Endpoint.player:
				this.From_PLAYER(pk, src);
				return;
			case E_Endpoint.projector:
				this.From_PROJECTOR(pk, src);
				return;
			case E_Endpoint.history:
				this.From_HISTORY(pk, src);
				return;
			
		}
		
		return `${this} missing From_${E_Endpoint[from].toUpperCase()} handler`;
	}
	
	/** [to, from] */
	WithSerials(serials: T_Serials<TPk>) {
		this.Serials = serials;
		return this;
	}
	
	protected Serials: T_Serials<TPk> = [pk => pk, obj => obj as TPk];
	protected SerializeTo: T_SerialToJsonObj<TPk> = (pk) => this.Serials[0](pk);
	protected SerializeFrom: T_SerialFromJsonObj<TPk> = (obj) => this.Serials[1](obj);
	
	protected From_CLIENT: (pk: TPk, src: TSrc) => void;
	protected From_ADMIN: (pk: TPk, src: TSrc) => void;
	protected From_PLAYER: (pk: TPk, src: TSrc) => void;
	protected From_PROJECTOR: (pk: TPk, src: TSrc) => void;
	protected From_HISTORY: (pk: TPk, src: TSrc) => void;
}

/** to any type of client */
export class SERVER_to_CLIENT<TPk extends T_Packet, TSrc extends I_PkSource> extends ServerPkOutgoing<TPk, TSrc> {
	from = E_Endpoint.server;
	to = E_Endpoint.client;
	useClientCatchall = true;
	declare From_SERVER: (pk: TPk) => void;
}

export class SERVER_to_ADMIN<TPk extends T_Packet, TSrc extends I_PkSource> extends ServerPkOutgoing<TPk, TSrc> {
	from = E_Endpoint.server;
	to = E_Endpoint.admin;
	declare From_SERVER: (pk: TPk) => void;
}

export class SERVER_to_PLAYER<TPk extends T_Packet, TSrc extends I_PkSource> extends ServerPkOutgoing<TPk, TSrc> {
	from = E_Endpoint.server;
	to = E_Endpoint.player;
	declare From_SERVER: (pk: TPk) => void;
}

export class SERVER_to_PROJECTOR<TPk extends T_Packet, TSrc extends I_PkSource> extends ServerPkOutgoing<TPk, TSrc> {
	from = E_Endpoint.server;
	to = E_Endpoint.projector;
	declare From_SERVER: (pk: TPk) => void;
}

export class SERVER_to_HISTORY<TPk extends T_Packet, TSrc extends I_PkSource> extends ServerPkOutgoing<TPk, TSrc> {
	from = E_Endpoint.server;
	to = E_Endpoint.history;
	declare From_SERVER: (pk: TPk) => void;
}

/** from any type of client */
export class CLIENT_to_SERVER<TPk extends T_Packet, TSrc extends I_PkSource> extends ClientPkOutgoing<TPk, TSrc> {
	from = E_Endpoint.client;
	to = E_Endpoint.server;
	useClientCatchall = true;
	declare From_CLIENT: (pk: TPk, src: TSrc) => void;
}

export class ADMIN_to_SERVER<TPk extends T_Packet, TSrc extends I_PkSource> extends ClientPkOutgoing<TPk, TSrc> {
	from = E_Endpoint.admin;
	to = E_Endpoint.server;
	declare From_ADMIN: (pk: TPk, src: TSrc) => void;
}

export class PLAYER_to_SERVER<TPk extends T_Packet, TSrc extends I_PkSource> extends ClientPkOutgoing<TPk, TSrc> {
	from = E_Endpoint.player;
	to = E_Endpoint.server;
	declare From_PLAYER: (pk: TPk, src: TSrc) => void;
}

export class PROJECTOR_to_SERVER<TPk extends T_Packet, TSrc extends I_PkSource> extends ClientPkOutgoing<TPk, TSrc> {
	from = E_Endpoint.projector;
	to = E_Endpoint.server;
	declare From_PROJECTOR: (pk: TPk, src: TSrc) => void;
}

export class HISTORY_to_SERVER<TPk extends T_Packet, TSrc extends I_PkSource> extends ClientPkOutgoing<TPk, TSrc> {
	from = E_Endpoint.history;
	to = E_Endpoint.server;
	declare From_HISTORY: (pk: TPk, src: TSrc) => void;
}

export class BasePacketDefs<TSrc extends I_PkSource> {
	protected StartingPacketId: number = 1;
	_ALL_PACKET_HANDLERS: BasePkHandler<TSrc>[] = [];
	
	protected AssignPacketIds() {
		let packetId = this.StartingPacketId;
		
		for (let [key, handler] of Object.entries(this)) {
			if (handler instanceof BasePkHandler) {
				handler.id = packetId;
				handler.name = key;
				this._ALL_PACKET_HANDLERS.push(handler);
				console.log(`++packet ${handler.id} ${handler.name}`);
				packetId++;
			}
		}
		
		
		console.log(`${this.constructor.name} found ${this._ALL_PACKET_HANDLERS.length} packets`);
	}
	
	protected SERVER_to_CLIENT = <TPk extends T_Packet>() => new SERVER_to_CLIENT<TPk, TSrc>();
	protected SERVER_to_ADMIN = <TPk extends T_Packet>() => new SERVER_to_ADMIN<TPk, TSrc>();
	protected SERVER_to_PLAYER = <TPk extends T_Packet>() => new SERVER_to_PLAYER<TPk, TSrc>();
	protected SERVER_to_PROJECTOR = <TPk extends T_Packet>() => new SERVER_to_PROJECTOR<TPk, TSrc>();
	protected SERVER_to_HISTORY = <TPk extends T_Packet>() => new SERVER_to_HISTORY<TPk, TSrc>();
	protected CLIENT_to_SERVER = <TPk extends T_Packet>() => new CLIENT_to_SERVER<TPk, TSrc>();
	protected ADMIN_to_SERVER = <TPk extends T_Packet>() => new ADMIN_to_SERVER<TPk, TSrc>();
	protected PLAYER_to_SERVER = <TPk extends T_Packet>() => new PLAYER_to_SERVER<TPk, TSrc>();
	protected PROJECTOR_to_SERVER = <TPk extends T_Packet>() => new PROJECTOR_to_SERVER<TPk, TSrc>();
	protected HISTORY_to_SERVER = <TPk extends T_Packet>() => new HISTORY_to_SERVER<TPk, TSrc>();
}
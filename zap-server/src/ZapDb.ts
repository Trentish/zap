import {access, mkdir, opendir, readFile, rename, stat, writeFile} from 'fs/promises';
import {vow} from '../lib/vow.js';
import {constants} from 'fs';
import {T_SerialFromJsonObj, T_Serials, T_SerialToJsonObj} from '../../zap-shared/SystemTypes.js';

type T_Options<T> = {
	folderPath: string;
	autoSave?: boolean;
	/** if >0 and enough time has passed, renames old data file before saving  (default: 5min) */
	backupIntervalMs?: number;
	Serials?: T_Serials<T>;
}

const JSON_SPACE = 4;

export class ZapDb<T> {
	
	folderPath: string;
	filePath: string;
	autoSave = true;
	backupIntervalMs = 5 * 60 * 1000;
	Serials: T_Serials<T> = [val => val, obj => obj as T];
	
	current: T;
	lastSavedAt = new Date(0);
	lastBackup = new Date(0);
	
	onLoad: (db: ZapDb<T>) => void = _ => {};
	
	// private storage: Record<string, T> = {};
	
	constructor(initial: T, options: T_Options<T>) {
		Object.assign(this, options);
		this.current = initial;
		
		this.Initialize().then();
	}
	
	async Initialize() {
		// this.storage = {};
		const folder = this.folderPath;
		
		console.log(`📦 initialize ZapDb at ${folder}`);
		
		const [, accessError] = await vow(
			access(folder, constants.R_OK | constants.W_OK),
		);
		
		if (accessError) {
			console.log(`access: ${accessError}`);
			
			const [, makeError] = await vow(
				mkdir(folder, {
					recursive: true
				}),
			);
			if (makeError) throw new Error(`TODO: makeError ${makeError}`); // TODO
		}
		
		this.lastBackup = new Date(); // start backup timer
		
		return this.Load();
	}
	
	async Save() {
		await this.CheckBackup();
		
		const path = `${this.folderPath}/data.json`;
		
		const jsonObj = this.SerializeTo(this.current);
		const json = JSON.stringify(jsonObj, null, JSON_SPACE);
		
		const [, writeError] = await vow(
			writeFile(path, json),
		);
		if (writeError) throw new Error(`TODO: writeError ${writeError}`); // TODO
		
		this.lastSavedAt = new Date();
		
		console.debug(`📦 save: ${path}`, jsonObj);
	}
	
	async Load() {
		const path = `${this.folderPath}/data.json`;
		
		const [data, readError] = await vow(
			readFile(path),
		);
		if (readError) return console.error(`TODO: readError ${readError}`); // TODO
		
		const json = data.toString();
		const jsonObj = JSON.parse(json);
		this.current = this.SerializeFrom(jsonObj);
		
		console.debug(`📦 load: ${path}`, jsonObj);
		
		this.onLoad(this);
	}
	
	async CheckBackup() {
		if (!this.backupIntervalMs) return; //>> backups turned off
		
		const nextBackup = this.lastBackup.getTime() + this.backupIntervalMs;
		if (nextBackup > Date.now()) return; //>> skip (backup cooldown timer)
		
		return this.Backup();
	}
	
	async Backup() {
		const dataPath = `${this.folderPath}/data.json`;
		const dtString = getDateTimeFileString(new Date());
		const backupPath = `${this.folderPath}/data_backup_${dtString}.json`;
		
		
		console.debug(`📦 backup -> ${backupPath}`);
		
		const [, renameError] = await vow(
			rename(dataPath, backupPath),
		);
		if (renameError) return console.error(`TODO: backup/renameError ${renameError}`); // TODO
		
		this.lastBackup = new Date();
	}
	
	protected SerializeTo: T_SerialToJsonObj<T> = (val) => this.Serials[0](val);
	protected SerializeFrom: T_SerialFromJsonObj<T> = (obj) => this.Serials[1](obj);
}

function getDateTimeFileString(date: Date) {
	const year = date.getFullYear().toString().padStart(4, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hour = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const seconds = date.getSeconds().toString().padStart(2, '0');
	return `${year}-${month}-${day}_${hour}h${minutes}m${seconds}s`;
}

// const [accessRes, accessError] = await vow(
// 	access(rootFolder, constants.R_OK | constants.W_OK),
// );
// if (accessError) throw new Error(`accessError ${accessError}`);
//
// const [stats, statsError] = await vow(
// 	stat(rootFolder),
// );
// if (statsError) throw new Error(`statsError ${statsError}`);
//
//
// const [data, dataError] = await vow(readFile(rootFolder));
// if (dataError) throw new Error(`dataError ${dataError}`);
//
// this.storage = JSON.parse(data.toString());
//
// Set(key: string, value: T) {
// 	this.storage[key] = value;
// 	this.TryAutoSave();
// }
//
// Get(key: string) {
// 	return this.storage[key];
// }
//
// Has(key: string) {
// 	return this.storage.hasOwnProperty(key);
// }
//
// Delete(key: string) {
// 	const wasDeleted = delete this.storage[key];
// 	this.TryAutoSave();
// 	return wasDeleted;
// }
//
// Clear() {
// 	this.storage = {};
// 	this.TryAutoSave();
// }
//
// TryAutoSave() {
// 	if (this.autoSave) this.Save().then();
// }
// const [dir, dirError] = await vow(
// 	opendir(rootFolder),
// );
// if (dirError) return console.error(`dirError ${dirError}`);
//
// for await (const dirent of dir) {
// 	console.log(`${rootFolder}   -->   ${dirent.name}`);
// }
//
// /** stupid try/catch node error typing hack */
// function GetErrorCode(err: unknown): string {
// 	// @ts-ignore
// 	return err && err.code;
// }
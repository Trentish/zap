// import * as fs from 'fs';
import {access, mkdir, opendir, readFile, stat, writeFile} from 'fs/promises';
import {vow} from '../lib/vow.js';
import {constants, exists} from 'fs';

type T_Options<T> = {
	folderPath: string;
	autoSave?: boolean;
	ToJsonObj?: (v: T) => object;
	FromJsonObj?: (v: object) => T;
}
// const dateFolder = now.toJSON().split('T')[0];

const JSON_SPACE = 4;

export class ZapDb<T> {
	
	folderPath: string;
	filePath: string;
	autoSave = true;
	ToJsonObj: (v: T) => object;
	FromJsonObj: (v: object) => T;
	
	current: T;
	lastSavedAt = new Date(0);
	
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
				mkdir(folder)
			);
			if (makeError) throw new Error(`TODO: makeError ${makeError}`); // TODO
		}
		
		this.Load();
		
		// const [dir, dirError] = await vow(
		// 	opendir(rootFolder),
		// );
		// if (dirError) return console.error(`TODO: dirError ${dirError}`); // TODO
		//
		// for await (const dirent of dir) {
		// 	console.log(`${rootFolder}   -->   ${dirent.name}`);
		// }
	}
	
	async Save() {
		const path = `${this.folderPath}/data.json`;
		
		const jsonObj = this.ToJsonObj ? this.ToJsonObj(this.current) : this.current;
		const json = JSON.stringify(jsonObj, null, JSON_SPACE);
		
		const [, writeError] = await vow(
			writeFile(path, json),
		);
		if (writeError) throw new Error(`TODO: writeError ${writeError}`); // TODO
		
		this.lastSavedAt = new Date();
		
		console.log(`📦 save: ${path}`, jsonObj);
	}
	
	async Load() {
		const path = `${this.folderPath}/data.json`;
		
		const [data, readError] = await vow(
			readFile(path),
		);
		if (readError) return console.error(`TODO: readError ${readError}`); // TODO
		
		const json = data.toString();
		const jsonObj = JSON.parse(json);
		this.current = this.FromJsonObj ? this.FromJsonObj(jsonObj) : jsonObj;
		
		console.log(`📦 load: ${path}`, jsonObj);
	}
}


// const [accessRes, accessError] = await vow(
// 	access(rootFolder, constants.R_OK | constants.W_OK),
// );
// if (accessError) throw new Error(`TODO: accessError ${accessError}`); // TODO
//
// const [stats, statsError] = await vow(
// 	stat(rootFolder),
// );
// if (statsError) throw new Error(`TODO: statsError ${statsError}`); // TODO
//
//
// const [data, dataError] = await vow(readFile(rootFolder));
// if (dataError) throw new Error(`TODO: dataError ${dataError}`); // TODO
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

/** stupid try/catch node error typing hack */
function GetErrorCode(err: unknown): string {
	// @ts-ignore
	return err && err.code;
}
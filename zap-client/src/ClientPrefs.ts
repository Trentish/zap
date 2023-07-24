import {$author, $store} from './ZapClient.ts';

export class ClientPrefs {
	author = '';
	
	
	static PREFS_KEY = 'ZAP_CLIENT_PREFS';
}

export function ApplyLoadedClientPrefs(prefs: ClientPrefs) {
	$store.set($author, prefs.author);
}
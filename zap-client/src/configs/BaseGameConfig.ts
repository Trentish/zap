import {SyntheticEvent} from 'react';

export type T_Org = {
	id: string,
	label: string,
	bgVideo: string,
	introVideo: string,
	outroVideo: string,
}

export class BaseGameConfig {
	gameIdf: string;
	
	bgVideo = '../assets/videos/box-background.mp4';
	introVideo = `../assets/videos/fw_red.webm`; // TEMP
	outroVideo = `../assets/videos/circle_red.webm`; // TEMP
	fallbackOrg: T_Org = {
		id: 'default',
		label: '',
		bgVideo: `../assets/videos/box-background.mp4`,
		introVideo: `../assets/videos/fw_red.webm`,
		outroVideo: `../assets/videos/circle_red.webm`,
	};
	
	showCrawler = true;
	logo = '';
	
	orgs: T_Org[];
	protected orgLup: Map<string, T_Org> = new Map();
	
	
	constructor() {
		//
	}
	
	
	
	GetOrg(id: string): T_Org {
		const org = this.orgLup.get(id);
		console.log(`GetOrg ${id} -> `, org);
		if (!org) return this.fallbackOrg;
		return org;
	}
	
	OnStart_Spotlight(stingerIn: HTMLVideoElement|null, bgVideoRef: HTMLVideoElement|null) {
		console.log(`A new spotlight headline has dropped!`);
		
		stingerIn?.play();
	}
	
	// TODO: stingerOut here is confusing?
	OnPlay_StingerIn(event: SyntheticEvent<HTMLVideoElement>, stingerOut: HTMLVideoElement|null) {
		console.log(`OnPlay_StingerIn`)
		
		setTimeout(function () {
			console.log('StingerIn timeout');
			stingerOut?.play();
		}, 9000);
	}
	
	OnTimeUpdate_StingerIn(event: SyntheticEvent<HTMLVideoElement>, articleDiv: HTMLDivElement|null) {
		console.log(`OnTimeUpdate_StingerIn ${event.currentTarget.currentTime}`);
		if (event.currentTarget.currentTime >= 1) {
			console.log(`headlineStingerIn_onTimeUpdate we're 1 seconds in!`);
			if (articleDiv) articleDiv.classList.add('now-showing');
		}
	}
	
	// TODO: ref of something else (parent?) for adding/removing class, or move this to spotlight section
	OnTimeUpdate_StingerOut(event: SyntheticEvent<HTMLVideoElement>, articleDiv: HTMLDivElement|null) {
		console.log(`OnTimeUpdate_StingerOut ${event.currentTarget.currentTime}`);
		if (event.currentTarget.currentTime >= 1) {
			console.log(`headlineStingerOut_onTimeUpdate we're 1 seconds in!`);
			if (articleDiv) articleDiv.classList.remove('now-showing');
		}
	}
}


export const FallbackConfig = new BaseGameConfig();
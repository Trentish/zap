import React from 'react';
import {ArticleDat} from '../../../zap-shared/_Dats.ts';

export type T_Org = {
	id: string,
	label: string,
	bgVideo: string,
	overlayVideo?: string,
	
	introVideo: string,
	introAudio: string,
	introAudioDelay?: number,
	
	outroVideo: string,
	outroAudio: string,
	outroAudioDelay?: number,
	
	introMidMs?: number,
	outroMidMs?: number,
	
	showAsRadio?: boolean,
}

// TODO: where does this want to live
export const SPOTLIGHT_DURATION = 9000;
export const INTRO_MID_DEFAULT = 1000;
export const OUTRO_MID_DEFAULT = 500;

export class BaseGameConfig {
	gameIdf: string;
	
	bgVideo = '../assets/videos/box-background.mp4';
	
	fallbackOrg: T_Org = {
		id: 'default',
		label: '',
		bgVideo: `../assets/videos/box-background.mp4`,
		introVideo: `../assets/videos/fw_red.webm`,
		introAudio: '',
		outroVideo: `../assets/videos/circle_red.webm`,
		outroAudio: '',
	};
	
	showCrawler = true;
	logo = '';
	
	orgs: T_Org[];
	protected orgLup: Map<string, T_Org> = new Map();
	
	
	constructor() {
		//
	}
	
	GetOrg(article: ArticleDat | undefined): T_Org {
		if (!article) return this.fallbackOrg;
		
		const org = this.orgLup.get(article.orgIdf);
		console.log(`GetOrg ${article.orgIdf} -> `, org);
		if (!org) return this.fallbackOrg;
		return org;
	}
	
	// TODO: rename, maybe move to T_Org
	OnStart_Spotlight(article: ArticleDat | undefined, refs: T_SpotlightRefs) {
		console.log(`A new spotlight headline has dropped!`);
	}
}

export type T_SpotlightRefs = {
	spotlightContainerRef: React.RefObject<HTMLDivElement>,
	spotlightBackgroundRef: React.RefObject<HTMLVideoElement>,
	spotlightOverlayRef: React.RefObject<HTMLVideoElement>,
	introVideoRef: React.RefObject<HTMLVideoElement>,
	introAudioRef: React.RefObject<HTMLAudioElement>,
	outroVideoRef: React.RefObject<HTMLVideoElement>,
	outroAudioRef: React.RefObject<HTMLAudioElement>,
	carrierRef: React.RefObject<HTMLDivElement>,
	themeRef: React.RefObject<HTMLDivElement>,
	headlineRef: React.RefObject<HTMLDivElement>,
}

export const FallbackConfig = new BaseGameConfig();
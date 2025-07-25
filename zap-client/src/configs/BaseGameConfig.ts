import React from 'react';
import {ArticleDat, PhaseDat, SituationDat} from '../../../zap-shared/_Dats.ts';
import {useAtom} from 'jotai/index';
import {$config} from '../ClientState.ts';

export type T_Org = {
	id: string,
	cssClass?: string, // if none, uses 'id' instead
	label: string,
	bgVideo: string,
	// overlayVideo?: string,
	
	introVideo: string,
	introAudio?: string,
	introAudioDelay?: number,
	introVolume?: number,
	
	outroVideo: string,
	outroAudio?: string,
	outroAudioDelay?: number,
	outroVolume?: number,
	
	// delay before triggering "middle" of intro
	introMidMs?: number,
	outroMidMs?: number,
	
	showAsRadio?: boolean,
}

// TODO: where does this want to live
export const SPOTLIGHT_DURATION = 9000;
export const INTRO_MID_DEFAULT = 1400;
export const OUTRO_MID_DEFAULT = 500;

export class BaseGameConfig {
	gameIdf: string;
	gameDisplayName: string;
	
	bgVideo = '../assets/videos/box-background.mp4';
	overlayVideo = '';
	
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
	showTopStories = false;
	topStoryCount = 5;
	showLocationField = false;
	logo = '';
	crawlerLogo = '';
	showTimerLeadingZero = false;
	
	orgs: T_Org[];
	protected orgLup: Map<string, T_Org> = new Map();

	timerEndSound = '';
	timerEndSoundStartMs = 0;
	timerEndSoundVolume = 1;
	timerDefs: T_TimerDef[] = [];
	
	phaseDefs: PhaseDat[] = [];

	situationDefs: SituationDat[] = [];
	
	statDefs: T_StatDef[] = [];

	constructor() {
		//
	}
	
	GetAllOrgs() {
		return this.orgs;
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
	// spotlightOverlayRef: React.RefObject<HTMLVideoElement>,
	introVideoRef: React.RefObject<HTMLVideoElement>,
	introAudioRef: React.RefObject<HTMLAudioElement>,
	outroVideoRef: React.RefObject<HTMLVideoElement>,
	outroAudioRef: React.RefObject<HTMLAudioElement>,
	carrierRef: React.RefObject<HTMLDivElement>,
	themeRef: React.RefObject<HTMLDivElement>,
	headlineRef: React.RefObject<HTMLDivElement>,
}

export type T_TimerDef = {
	label?: string;
	ms?: number;
	setLabelOnly?: boolean;
}

export type T_StatDef = {
	label?: string;
	// value: string;
	icon?: string;
	isNumber?: boolean;
	className?: string;
}

export const FallbackConfig = new BaseGameConfig();
import {BaseGameConfig, T_Org, T_TimerDef} from './BaseGameConfig.ts';
import './goblin.css'; //## NOTE: will always load (regardless of gameIdf)

const DH_VID = '../assets/videos/goblin/';
const DH_AUD = '../assets/audio/';

class GoblinConfig extends BaseGameConfig {
	gameIdf = 'goblin';

	bgVideo = `${DH_VID}goblin-background.mp4`;

	showCrawler = true;
	logo = '../assets/images/goblin/ink7.svg';
	crawlerLogo = '../assets/images/goblin/ink7.svg';

	orgs: T_Org[] = [BIG_CHEESE_SEZ, REVENANT_REPORT, THE_SIREN, THE_SENTINEL, THE_BEHOLDERS_BUGLE];

	timerDefs: T_TimerDef[] = [
		{
			label: 'Test Timer',
			ms: (5 * 60 * 1000) + 30000,
		},
		{
			label: 'Clan Time',
			ms: 10 * 60 * 1000,
		},
		{
			label: 'Guild Meet',
			ms: 5 * 60 * 1000,
		},
		{
			label: 'Free Play',
			ms: 21 * 60 * 1000,
		},
	]

	constructor() {
		super();
		for (const org of this.orgs) {
			this.orgLup.set(org.id, org);
		}
	}
}


const BIG_CHEESE_SEZ: T_Org = {
	id: 'bigcheesesez',
	label: 'Big Cheese Sez',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}yellowarrow.webm`,
	introAudio: `${DH_AUD}news1.mp3`,
	introAudioDelay: 0,
	outroVideo: `${DH_VID}yellowarrow.webm`,
	outroAudio: ``,
	introMidMs: 1201,
	outroMidMs: 1201,
	showAsRadio: true,
};
const REVENANT_REPORT: T_Org = {
	id: 'revenantreport',
	label: 'Revenant Report',
	bgVideo: `${DH_VID}spotlight-background-6.mp4`,
	introVideo: `${DH_VID}yellowarrow.webm`,
	introAudio: `${DH_AUD}news2.mp3`,
	introAudioDelay: 200,
	outroVideo: `${DH_VID}yellowarrow.webm`,
	outroAudio: ``,
	introMidMs: 1201,
	outroMidMs: 1201,
	showAsRadio: true,
};
const THE_SIREN: T_Org = {
	id: 'thesiren',
	label: 'The Siren',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}yellowarrow.webm`,
	introAudio: `${DH_AUD}news3.mp3`,
	introAudioDelay: 200,
	outroVideo: `${DH_VID}yellowarrow.webm`,
	outroAudio: ``,
	introMidMs: 1201,
	outroMidMs: 1201,
	showAsRadio: true,
};
const THE_SENTINEL: T_Org = {
	id: 'thesentinel',
	label: 'The Sentinel',
	bgVideo: `${DH_VID}spotlight-background-6.mp4`,
	introVideo: `${DH_VID}yellowarrow.webm`,
	introAudio: `${DH_AUD}news4.mp3`,
	introAudioDelay: 0,
	outroVideo: `${DH_VID}yellowarrow.webm`,
	outroAudio: ``,
	introMidMs: 1201,
	outroMidMs: 1201,
	showAsRadio: true,
};
const THE_BEHOLDERS_BUGLE: T_Org = {
	id: 'thebeholdersbugle',
	label: 'The Beholder\'s Bugle',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}yellowarrow.webm`,
	introAudio: `${DH_AUD}news5.mp3`,
	introAudioDelay: 0,
	outroVideo: `${DH_VID}yellowarrow.webm`,
	outroAudio: ``,
	introMidMs: 1201,
	outroMidMs: 1201,
	showAsRadio: true,
};


export default new GoblinConfig();
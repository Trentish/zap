import {BaseGameConfig, T_Org, T_TimerDef} from './BaseGameConfig.ts';
import './grimvale.css'; //## NOTE: will always load (regardless of gameIdf)

const DH_VID = '../assets/videos/grimvale/';
const DH_AUD = '../assets/audio/';

class GrimvaleConfig extends BaseGameConfig {
	gameIdf = 'grimvale';

	bgVideo = `${DH_VID}grimvale-background.mp4`;

	showCrawler = true;
	logo = '../assets/images/grimvale/ink7.svg';
	crawlerLogo = '../assets/images/grimvale/ink7.svg';

	orgs: T_Org[] = [HEARSAY, INNOVATION, ACCOLADE, LIFESTYLE, FINANCE, CRISIS, DOOM];

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


const HEARSAY: T_Org = {
	id: 'hearsay',
	label: 'Hearsay',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}vahalla.webm`,
	introAudio: `${DH_AUD}grimvale_gossip.mp3`,
	introAudioDelay: 0,
	outroVideo: `${DH_VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
const INNOVATION: T_Org = {
	id: 'innovation',
	label: 'Innovation',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}vahalla.webm`,
	introAudio: `${DH_AUD}grimvale_innovation.mp3`,
	introAudioDelay: 200,
	outroVideo: `${DH_VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
const LIFESTYLE: T_Org = {
	id: 'lifestyle',
	label: 'Lifestyle',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}vahalla.webm`,
	introAudio: `${DH_AUD}grimvale_lifestyle.mp3`,
	introAudioDelay: 0,
	outroVideo: `${DH_VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
const ACCOLADE: T_Org = {
	id: 'accolade',
	label: 'Accolade',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}vahalla.webm`,
	introAudio: `${DH_AUD}grimvale_accolade.mp3`,
	introAudioDelay: 200,
	outroVideo: `${DH_VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
const CRISIS: T_Org = {
	id: 'crisis',
	label: 'Crisis',
	bgVideo: `${DH_VID}spotlight-background-5.mp4`,
	introVideo: `${DH_VID}realm.webm`,
	introAudio: `${DH_AUD}grimvale_crisis.mp3`,
	introAudioDelay: 0,
	outroVideo: `${DH_VID}realm.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
const FINANCE: T_Org = {
	id: 'finance',
	label: 'Finance',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}vahalla.webm`,
	introAudio: `${DH_AUD}grimvale_finance.mp3`,
	introAudioDelay: 0,
	outroVideo: `${DH_VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
const DOOM: T_Org = {
	id: 'doom',
	label: 'Doom',
	bgVideo: `${DH_VID}spotlight-background-5.mp4`,
	introVideo: `${DH_VID}lightning.webm`,
	introAudio: `${DH_AUD}grimvale_doom.mp3`,
	introAudioDelay: 0,
	outroVideo: `${DH_VID}lightning.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};


export default new GrimvaleConfig();
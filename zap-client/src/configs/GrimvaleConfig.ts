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

	orgs: T_Org[] = [GOSSIP, INNOVATION, ACCOLADE, CALAMITY, OATH, GRUDGE, DOOM];

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


const GOSSIP: T_Org = {
	id: 'gossip',
	label: 'Gossip',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}vahalla.webm`,
	introAudio: `${DH_AUD}gossip.mp3`,
	introAudioDelay: 500,
	outroVideo: `${DH_VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	showAsRadio: true,
};
const INNOVATION: T_Org = {
	id: 'innovation',
	label: 'Innovation',
	bgVideo: `${DH_VID}spotlight-background-6.mp4`,
	introVideo: `${DH_VID}vahalla.webm`,
	introAudio: `${DH_AUD}grimvale_innovation.mp3`,
	introAudioDelay: 500,
	outroVideo: `${DH_VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	showAsRadio: true,
};
const ACCOLADE: T_Org = {
	id: 'accolade',
	label: 'Accolade',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}vahalla.webm`,
	introAudio: `${DH_AUD}accolade.mp3`,
	introAudioDelay: 500,
	outroVideo: `${DH_VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 901,
	showAsRadio: true,
};
const CALAMITY: T_Org = {
	id: 'calamity',
	label: 'Calamity',
	bgVideo: `${DH_VID}spotlight-background-5.mp4`,
	introVideo: `${DH_VID}vahalla.webm`,
	introAudio: `${DH_AUD}calamity2.mp3`,
	introAudioDelay: 500,
	outroVideo: `${DH_VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	showAsRadio: true,
};
const OATH: T_Org = {
	id: 'oath',
	label: 'Oath',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}vahalla.webm`,
	introAudio: `${DH_AUD}oath.mp3`,
	introAudioDelay: 500,
	outroVideo: `${DH_VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	showAsRadio: true,
};
const GRUDGE: T_Org = {
	id: 'grudge',
	label: 'Grudge',
	bgVideo: `${DH_VID}spotlight-background-4.mp4`,
	introVideo: `${DH_VID}vahalla.webm`,
	introAudio: `${DH_AUD}grudge.mp3`,
	introAudioDelay: 500,
	// introVolume: .08,
	outroVideo: `${DH_VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	showAsRadio: true,
};
const DOOM: T_Org = {
	id: 'doom',
	label: 'Doom',
	bgVideo: `${DH_VID}spotlight-background-5.mp4`,
	introVideo: `${DH_VID}vahalla.webm`,
	introAudio: `${DH_AUD}doom.mp3`,
	introAudioDelay: 500,
	outroVideo: `${DH_VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	showAsRadio: true,
};


export default new GrimvaleConfig();
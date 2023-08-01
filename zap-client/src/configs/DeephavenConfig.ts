import {BaseGameConfig, T_Org} from './BaseGameConfig.ts';
import './deephaven.css'; //## NOTE: will always load (regardless of gameIdf)

const DH_VID = '../assets/videos/deephaven/';
const DH_AUD = '../assets/audio/';

class DeephavenConfig extends BaseGameConfig {
	gameIdf = 'deephaven';
	
	bgVideo = `${DH_VID}deephaven-background.mp4`;
	introVideo = `${DH_VID}ink-transition.webm`; // TEMP
	outroVideo = `${DH_VID}ink-transition.webm`; // TEMP
	
	showCrawler = true;
	logo = '../assets/images/deephaven/ink6.svg';
	
	orgs: T_Org[] = [GOSSIP, DISCOVERY, TRIUMPH, CALAMITY, OATH, GRUDGE, DOOM];
	
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
	introVideo: `${DH_VID}ink-transition.webm`,
	introAudio: `${DH_AUD}gossip.mp3`,
	introAudioDelay: 500,
	outroVideo: `${DH_VID}ink-transition.webm`,
	outroAudio: ``,
	showAsRadio: true,
};
const DISCOVERY: T_Org = {
	id: 'discovery',
	label: 'Discovery',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}ink-transition.webm`,
	introAudio: `${DH_AUD}discovery2.mp3`,
	introAudioDelay: 500,
	outroVideo: `${DH_VID}ink-transition.webm`,
	outroAudio: ``,
	showAsRadio: true,
};
const TRIUMPH: T_Org = {
	id: 'triumph',
	label: 'Triumph',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}ink-transition.webm`,
	introAudio: `${DH_AUD}triumph.mp3`,
	introAudioDelay: 500,
	outroVideo: `${DH_VID}ink-transition.webm`,
	outroAudio: ``,
	showAsRadio: true,
};
const CALAMITY: T_Org = {
	id: 'calamity',
	label: 'Calamity',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}ink-transition.webm`,
	introAudio: `${DH_AUD}calamity2.mp3`,
	introAudioDelay: 500,
	outroVideo: `${DH_VID}ink-transition.webm`,
	outroAudio: ``,
	showAsRadio: true,
};
const OATH: T_Org = {
	id: 'oath',
	label: 'Oath',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}ink-transition.webm`,
	introAudio: `${DH_AUD}oath.mp3`,
	introAudioDelay: 500,
	outroVideo: `${DH_VID}ink-transition.webm`,
	outroAudio: ``,
	showAsRadio: true,
};
const GRUDGE: T_Org = {
	id: 'grudge',
	label: 'Grudge',
	bgVideo: `${DH_VID}spotlight-background-3.mp4`,
	introVideo: `${DH_VID}ink-transition.webm`,
	introAudio: `${DH_AUD}grudge.mp3`,
	introAudioDelay: 500,
	outroVideo: `${DH_VID}ink-transition.webm`,
	outroAudio: ``,
	showAsRadio: true,
};
const DOOM: T_Org = {
	id: 'doom',
	label: 'Doom',
	bgVideo: `${DH_VID}spotlight-background-5.mp4`,
	introVideo: `${DH_VID}ink-transition.webm`,
	introAudio: `${DH_AUD}doom.mp3`,
	introAudioDelay: 500,
	outroVideo: `${DH_VID}ink-transition.webm`,
	outroAudio: ``,
	showAsRadio: true,
};


export default new DeephavenConfig();
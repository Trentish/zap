import {BaseGameConfig, T_Org} from './BaseGameConfig.ts';
import './deephaven.css'; //## NOTE: will always load (regardless of gameIdf)

const DH_VIDS = '../assets/videos/deephaven/';

class DeephavenConfig extends BaseGameConfig {
	gameIdf = 'deephaven';
	
	bgVideo = `${DH_VIDS}deephaven-background.mp4`;
	introVideo = `${DH_VIDS}ink-transition.webm`; // TEMP
	outroVideo = `${DH_VIDS}ink-transition.webm`; // TEMP
	
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
	bgVideo: `${DH_VIDS}spotlight-background-3.mp4`,
	introVideo: `${DH_VIDS}ink-transition.webm`,
	outroVideo: `${DH_VIDS}ink-transition.webm`,
	showAsRadio: true,
};
const DISCOVERY: T_Org = {
	id: 'discovery',
	label: 'Discovery',
	bgVideo: `${DH_VIDS}spotlight-background-3.mp4`,
	introVideo: `${DH_VIDS}ink-transition.webm`,
	outroVideo: `${DH_VIDS}ink-transition.webm`,
	showAsRadio: true,
};
const TRIUMPH: T_Org = {
	id: 'triumph',
	label: 'Triumph',
	bgVideo: `${DH_VIDS}spotlight-background-3.mp4`,
	introVideo: `${DH_VIDS}ink-transition.webm`,
	outroVideo: `${DH_VIDS}ink-transition.webm`,
	showAsRadio: true,
};
const CALAMITY: T_Org = {
	id: 'calamity',
	label: 'Calamity',
	bgVideo: `${DH_VIDS}spotlight-background-3.mp4`,
	introVideo: `${DH_VIDS}ink-transition.webm`,
	outroVideo: `${DH_VIDS}ink-transition.webm`,
	showAsRadio: true,
};
const OATH: T_Org = {
	id: 'oath',
	label: 'Oath',
	bgVideo: `${DH_VIDS}spotlight-background-3.mp4`,
	introVideo: `${DH_VIDS}ink-transition.webm`,
	outroVideo: `${DH_VIDS}ink-transition.webm`,
	showAsRadio: true,
};
const GRUDGE: T_Org = {
	id: 'grudge',
	label: 'Grudge',
	bgVideo: `${DH_VIDS}spotlight-background-3.mp4`,
	introVideo: `${DH_VIDS}ink-transition.webm`,
	outroVideo: `${DH_VIDS}ink-transition.webm`,
	showAsRadio: true,
};
const DOOM: T_Org = {
	id: 'doom',
	label: 'Doom',
	bgVideo: `${DH_VIDS}spotlight-background-5.mp4`,
	introVideo: `${DH_VIDS}ink-transition.webm`,
	outroVideo: `${DH_VIDS}ink-transition.webm`,
	showAsRadio: true,
};


export default new DeephavenConfig();
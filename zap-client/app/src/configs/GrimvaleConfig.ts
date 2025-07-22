import {BaseGameConfig, T_Org, T_TimerDef} from './BaseGameConfig.ts';
import './grimvale.css'; //## NOTE: will always load (regardless of gameIdf)

const VID = '../assets/videos/';
const AUD = '../assets/audio/';


/*


TODO: use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!
	use INK module instead!


*/

class GrimvaleConfig extends BaseGameConfig {
	gameIdf = 'grimvale';

	bgVideo = `${VID}mist.mp4`;

	showCrawler = true;
	logo = '../assets/images/ink7.svg';
	crawlerLogo = '../assets/images/ink7.svg';

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
	bgVideo: `${VID}spotlight-background-3.mp4`,
	introVideo: `${VID}vahalla.webm`,
	introAudio: `${AUD}gossip.mp3`,
	introAudioDelay: 0,
	outroVideo: `${VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
const INNOVATION: T_Org = {
	id: 'innovation',
	label: 'Innovation',
	bgVideo: `${VID}spotlight-background-3.mp4`,
	introVideo: `${VID}vahalla.webm`,
	introAudio: `${AUD}innovation.mp3`,
	introAudioDelay: 200,
	outroVideo: `${VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
const LIFESTYLE: T_Org = {
	id: 'lifestyle',
	label: 'Lifestyle',
	bgVideo: `${VID}spotlight-background-3.mp4`,
	introVideo: `${VID}vahalla.webm`,
	introAudio: `${AUD}lifestyle.mp3`,
	introAudioDelay: 0,
	outroVideo: `${VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
const ACCOLADE: T_Org = {
	id: 'accolade',
	label: 'Accolade',
	bgVideo: `${VID}spotlight-background-3.mp4`,
	introVideo: `${VID}vahalla.webm`,
	introAudio: `${AUD}accolade.mp3`,
	introAudioDelay: 200,
	outroVideo: `${VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
const CRISIS: T_Org = {
	id: 'crisis',
	label: 'Crisis',
	bgVideo: `${VID}spotlight-background-5.mp4`,
	introVideo: `${VID}realm.webm`,
	introAudio: `${AUD}crisis.mp3`,
	introAudioDelay: 0,
	outroVideo: `${VID}realm.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
const FINANCE: T_Org = {
	id: 'finance',
	label: 'Finance',
	bgVideo: `${VID}spotlight-background-3.mp4`,
	introVideo: `${VID}vahalla.webm`,
	introAudio: `${AUD}finance.mp3`,
	introAudioDelay: 0,
	outroVideo: `${VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
const DOOM: T_Org = {
	id: 'doom',
	label: 'Doom',
	bgVideo: `${VID}spotlight-background-5.mp4`,
	introVideo: `${VID}lightning.webm`,
	introAudio: `${AUD}doom.mp3`,
	introAudioDelay: 0,
	outroVideo: `${VID}lightning.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};


export default new GrimvaleConfig();
import {BaseGameConfig, T_Org, T_TimerDef} from './BaseGameConfig.ts';
import './grimvale.css';
import {$location, $store} from '../ClientState.ts';
import {ArticleDat} from '../../../zap-shared/_Dats.ts'; //## NOTE: will always load (regardless of gameIdf)

const DH_VID = '../assets/videos/grimvale/';
const DH_AUD = '../assets/audio/';

class GrimvaleConfig extends BaseGameConfig {
	gameIdf = 'grimvale';
	
	bgVideo = `${DH_VID}grimvale-background.mp4`;
	
	showCrawler = true;
	logo = '../assets/images/grimvale/ink7.svg';
	crawlerLogo = '../assets/images/grimvale/ink7.svg';
	
	orgs: T_Org[] = [];
	
	timerDefs: T_TimerDef[] = [
		{
			label: 'Test Timer',
			ms: (
				5 * 60 * 1000
			) + 30000,
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
	];
	
	constructor() {
		super();
	}
	
	// hack
	override GetOrg(article: ArticleDat | undefined): T_Org {
		this.orgs = GetHackyOrgs();
		this.orgLup.clear();
		
		for (const org of this.orgs) {
			this.orgLup.set(org.id, org);
		}
		
		return super.GetOrg(article);
	}
	
	// hack
	override GetAllOrgs(): T_Org[] {
		this.orgs = GetHackyOrgs();
		this.orgLup.clear();
		
		for (const org of this.orgs) {
			this.orgLup.set(org.id, org);
		}
		
		return super.GetAllOrgs();
	}
}

/** hack to get different news networks ("org" still means type of story, sorry) **/
function GetHackyOrgs(): T_Org[] {
	const loc = $store.get($location);
	const pathArr = loc.pathname?.split('/').filter(s => s) || [];
	const bardPath = pathArr.length >= 3 ? pathArr[2].toLowerCase() : '';
	
	switch (bardPath) {
		default: return BARD1;
		case 'bard1': return BARD1;
		case 'bard2': return BARD2;
		case 'bard3': return BARD3;
	}
}

const BARD1: T_Org[] = [
	{
		id: 'b1_gossip',
		label: 'B1 Gossip',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}gossip.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'discovery',
		label: 'Discovery',
		bgVideo: `${DH_VID}spotlight-background-6.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}discovery2.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'triumph',
		label: 'Triumph',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}triumph.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'calamity',
		label: 'Calamity',
		bgVideo: `${DH_VID}spotlight-background-5.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}calamity2.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'oath',
		label: 'Oath',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}oath.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'grudge',
		label: 'Grudge',
		bgVideo: `${DH_VID}spotlight-background-4.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}grudge.mp3`,
		introAudioDelay: 500,
		// introVolume: .08,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'doom',
		label: 'Doom',
		bgVideo: `${DH_VID}spotlight-background-5.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}doom.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
];


const BARD2: T_Org[] = [
	{
		id: 'b2_gossip',
		label: 'B2 Gossip',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}gossip.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'discovery',
		label: 'Discovery',
		bgVideo: `${DH_VID}spotlight-background-6.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}discovery2.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'triumph',
		label: 'Triumph',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}triumph.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'calamity',
		label: 'Calamity',
		bgVideo: `${DH_VID}spotlight-background-5.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}calamity2.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'oath',
		label: 'Oath',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}oath.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'grudge',
		label: 'Grudge',
		bgVideo: `${DH_VID}spotlight-background-4.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}grudge.mp3`,
		introAudioDelay: 500,
		// introVolume: .08,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'doom',
		label: 'Doom',
		bgVideo: `${DH_VID}spotlight-background-5.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}doom.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
];

const BARD3: T_Org[] = [
	{
		id: 'b3_gossip',
		label: 'B3 Gossip',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}gossip.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'discovery',
		label: 'Discovery',
		bgVideo: `${DH_VID}spotlight-background-6.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}discovery2.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'triumph',
		label: 'Triumph',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}triumph.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'calamity',
		label: 'Calamity',
		bgVideo: `${DH_VID}spotlight-background-5.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}calamity2.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'oath',
		label: 'Oath',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}oath.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'grudge',
		label: 'Grudge',
		bgVideo: `${DH_VID}spotlight-background-4.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}grudge.mp3`,
		introAudioDelay: 500,
		// introVolume: .08,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
	{
		id: 'doom',
		label: 'Doom',
		bgVideo: `${DH_VID}spotlight-background-5.mp4`,
		introVideo: `${DH_VID}slide_red.webm`,
		introAudio: `${DH_AUD}doom.mp3`,
		introAudioDelay: 500,
		outroVideo: `${DH_VID}slide_red.webm`,
		outroAudio: ``,
		introMidMs: 910,
		showAsRadio: true,
	},
];


export default new GrimvaleConfig();
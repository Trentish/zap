import {BaseGameConfig, T_Org, T_TimerDef} from './BaseGameConfig.ts';
import './grimvale.css';
import {$location, $store} from '../ClientState.ts';
import {ArticleDat} from '../../../zap-shared/_Dats.ts'; //## NOTE: will always load (regardless of gameIdf)

const DH_VID = '../assets/videos/grimvale/';
const DH_AUD = '../assets/audio/';


/*
ORGS: There are three bards, maybe same network, maybe not.

Bard headline types
Innovation: new company asset patent, etc.
Lifestyle: luxury related
Crisis/scandal: bad things (usually affects Rep)
Accolade: accomplishments, accolades (can affect Rep)
Finance: bazaar related, etc.
?: general misc

JUST AN IDEA, NOT REQUIRED:
Stinger SFX is specific instrument
Lute
Flute
Violin
Hurdy Gurdy?

and/or still do different Headline types, but they use the same instrument (per Bard), so 3-5 sounds per instrument per Bard

Different networks???



REPUTATION OF THE DIFFERENT COMPANIES
TICKER SYMBOL
CURRENT REP LEVEL (S+,S,S-,A+,A,A-,B+,B,B-,C+,C,C-,D+,D,D-,F+,F,F-)

POSSIBLY commodity prices:
Merch (have prices)
Apparel
Bags
Brews
Food
Jewelry
Potions
Structures
Tools



 */

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
		id: 'redbard',
		label: 'Hear ye, hear ye!',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}vahalla.webm`,
		introAudio: `${DH_AUD}celtic_harmony.mp3`,
		introAudioDelay: 0,
		outroVideo: `${DH_VID}vahalla.webm`,
		outroAudio: ``,
		introMidMs: 601,
		showAsRadio: true,
	},
	{
		id: 'greenbard',
		label: 'Lend me your ears!',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}vahalla.webm`,
		introAudio: `${DH_AUD}knights_and_maids.mp3`,
		introAudioDelay: 0,
		outroVideo: `${DH_VID}vahalla.webm`,
		outroAudio: ``,
		introMidMs: 601,
		showAsRadio: false,
	},
	{
		id: 'bluebard',
		label: 'Good people, hear the news!',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}vahalla.webm`,
		introAudio: `${DH_AUD}princess_of_tears.mp3`,
		introAudioDelay: 0,
		outroVideo: `${DH_VID}vahalla.webm`,
		outroAudio: ``,
		introMidMs: 601,
		showAsRadio: false,
	},
	/* These must be declared both here AND below to deal with a bug that I don't want to deal with. */
];


const BARD2: T_Org[] = [
	{
		id: 'greenbard',
		label: 'Lend me your ears!',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}vahalla.webm`,
		introAudio: `${DH_AUD}knights_and_maids.mp3`,
		introAudioDelay: 0,
		outroVideo: `${DH_VID}vahalla.webm`,
		outroAudio: ``,
		introMidMs: 601,
		showAsRadio: true,
	},
];

const BARD3: T_Org[] = [
	{
		id: 'bluebard',
		label: 'Good people, hear the news!',
		bgVideo: `${DH_VID}spotlight-background-3.mp4`,
		introVideo: `${DH_VID}vahalla.webm`,
		introAudio: `${DH_AUD}princess_of_tears.mp3`,
		introAudioDelay: 0,
		outroVideo: `${DH_VID}vahalla.webm`,
		outroAudio: ``,
		introMidMs: 601,
		showAsRadio: true,
	},
];


export default new GrimvaleConfig();
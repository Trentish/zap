import {BaseGameConfig, T_Org, T_TimerDef} from './BaseGameConfig.ts';
import './ink.css';
import {ACCOLADE, CRISIS, DOOM, GRUDGE, HEARSAY, INNOVATION, OATH, RenameOrg} from './InkOrgs.ts'; //## NOTE: will always load (regardless of gameIdf)

const VID = '../assets/videos/';
const AUD = '../assets/audio/';

class InkConfig extends BaseGameConfig {
	gameIdf = 'ink';
	
	bgVideo = `../assets/videos/mist.mp4`;
	
	showCrawler = true;
	logo = '../assets/images/ink7.svg';
	crawlerLogo = '../assets/images/ink7.svg';
	
	
	timerDefs: T_TimerDef[] = [
		{
			label: 'Guild Meet',
			ms: 5 * 60 * 1000,
		},
		{
			label: 'Free Play',
			ms: 21 * 60 * 1000,
		},
		{
			label: 'Clan Time',
			ms: 4 * 60 * 1000,
		},
	]
	
	constructor() {
		super();
		for (const org of this.orgs) {
			this.orgLup.set(org.id, org);
		}
	}
	
	
	orgs: T_Org[] = [
		RenameOrg(HEARSAY, 'Gossip'),
		RenameOrg(INNOVATION, 'Discovery'),
		RenameOrg(ACCOLADE, 'Triumph'),
		RenameOrg(CRISIS, 'Calamity'),
		RenameOrg(OATH, 'Oath'),
		RenameOrg(GRUDGE, 'Grudge'),
		RenameOrg(DOOM, 'Doom'),
	];
}




export default new InkConfig();
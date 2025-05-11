import {BaseGameConfig, T_Org, T_StatDef, T_TimerDef} from './BaseGameConfig.ts';
import './ink.css';
import {ACCOLADE, CRISIS, DOOM, GRUDGE, HEARSAY, INNOVATION, OATH, RenameOrg} from './InkOrgs.ts';
import {SituationDat} from '../../../zap-shared/_Dats.ts'; //## NOTE: will always load (regardless of gameIdf)

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
			label: 'Action Phase',
			ms: 18 * 60 * 1000,
		},
		{
			label: 'Faction Time',
			ms: 5 * 60 * 1000,
		},
		{
			label: 'Proclamations',
			ms: 5 * 60 * 1000,
		},
		{
			label: 'Resolution Phase',
			ms: 2 * 60 * 1000,
		},
		{
			label: 'Shadow Attack',
			setLabelOnly: true,
		},
	];
	
	constructor() {
		super();
		for (const org of this.orgs) {
			this.orgLup.set(org.id, org);
		}
	}
	
	
	orgs: T_Org[] = [
		RenameOrg(HEARSAY, 'Rumor'),
		RenameOrg(INNOVATION, 'Noteworthy'),
		RenameOrg(ACCOLADE, 'Triumph'),
		RenameOrg(CRISIS, 'Tragedy'),
		RenameOrg(OATH, 'Unity'),
		RenameOrg(GRUDGE, 'Disorder'),
		RenameOrg(DOOM, 'Shadow Attack'),
	];
	// orgs: T_Org[] = [
	// 	RenameOrg(HEARSAY, 'Gossip'),
	// 	RenameOrg(INNOVATION, 'Discovery'),
	// 	RenameOrg(ACCOLADE, 'Triumph'),
	// 	RenameOrg(CRISIS, 'Calamity'),
	// 	RenameOrg(OATH, 'Oath'),
	// 	RenameOrg(GRUDGE, 'Grudge'),
	// 	RenameOrg(DOOM, 'Doom'),
	// ];
	
	situationDefs: SituationDat[] = [
		{label: 'Attack', cssClass: 'attack'},
	];
	
	// statDefs: T_StatDef[] = [
	// 	{
	// 		label: 'Light Level:',
	// 		icon: '../assets/images/fist.png',
	// 		isNumber: true,
	// 	},
	// ];
}


export default new InkConfig();
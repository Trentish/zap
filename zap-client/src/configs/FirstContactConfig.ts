import {BaseGameConfig, T_Org, T_StatDef, T_TimerDef} from './BaseGameConfig.ts';
import './FirstContact.css'; //## NOTE: will always load (regardless of gameIdf)
import {PhaseDat, SituationDat} from '../../../zap-shared/_Dats.ts';

const VID = '../assets/videos/';
const AUD = '../assets/audio/';
const MINUTES = 60 * 1000;

class FirstContactConfig extends BaseGameConfig {
	gameIdf = 'fc';

	// bgVideo = `${VID}globe4.mp4`;
	bgVideo = '';

	showCrawler = false;
	showTopStories = true;
	topStoryCount = 5;

	logo = '../assets/images/wts/gnn_logo.svg';
	crawlerLogo = '../assets/images/wts/gnn_logo.svg';
	timerEndSound = `${AUD}juntas_end_turn_1.mp3`;

	orgs: T_Org[] = [GNN_BREAKING, GNN_OPINION, GNN_LATE_NIGHT];
	// situationDefs: SituationDat[] = [
	// 	{label: 'Alpha', cssClass: 'alpha'},
	// 	{label: 'Bravo', cssClass: 'bravo'},
	// 	{label: 'Charlie', cssClass: 'charlie'},
	// 	{label: 'Delta', cssClass: 'delta'},
	// 	{label: 'Echo', cssClass: 'echo'},
	// 	{label: 'Wolf', cssClass: 'wolf'},
	// ];

	timerDefs: T_TimerDef[] = [
		{
			label: '',
			ms: 40 * MINUTES,
		},
		{
			label: 'Team',
			ms: 10 * MINUTES,
		},
		{
			label: 'Action',
			ms: 15 * MINUTES,
		},
		{
			label: 'Diplomacy',
			ms: 10 * MINUTES,
		},
		{
			label: 'End of Turn',
			ms: 5 * MINUTES,
		},
	];
	
	phaseDefs: PhaseDat[] = [
		{ label: 'Action', ms: 30 * MINUTES },
		{ label: 'Go to Team', ms: 2 * MINUTES },
		{ label: 'Team', ms: 11 * MINUTES },
		{ label: 'Go to Action', ms: 2 * MINUTES },
	];

	statDefs: T_StatDef[] = [
		{label: 'DEFCON 1',className: 'defcon'},
		{label: 'DEFCON 2', className: 'defcon'},
		{label: 'DEFCON 3',className: 'defcon'},

		{label: 'AFC', className: 'corp first'},
		{label: 'ANE', className: 'corp'},
		{label: 'AST', className: 'corp'},
		{label: 'CH', className: 'corp'},
		{label: 'GRO', className: 'corp'},
		{label: 'KAS', className: 'corp'},
		{label: 'KC', className: 'corp'},
		{label: 'WUB', className: 'corp'},
	]

	constructor() {
		super();
		for (const org of this.orgs) {
			this.orgLup.set(org.id, org);
		}
	}
}

const GNN_BREAKING: T_Org = {
	id: 'gnnBreaking',
	label: 'Breaking News',
	bgVideo: `${VID}box-background.mp4`,
	introVideo: `${VID}circle_red.webm`,
	introAudio: `${AUD}news2.mp3`,
	// introAudioDelay: 500,
	outroVideo: `${VID}fw_red.webm`,
	outroAudio: ``,
	introMidMs: 1000,
	outroMidMs: 500,
	showAsRadio: true,
};

const GNN_OPINION: T_Org = {
	id: 'gnnOpinion',
	label: 'Opinion Desk',
	bgVideo: `${VID}box-background.mp4`,
	introVideo: `${VID}slide_red.webm`,
	introAudio: `${AUD}news4.mp3`,
	// introAudioDelay: 500,
	outroVideo: `${VID}fw_red.webm`,
	outroAudio: ``,
	introMidMs: 500,
	outroMidMs: 500,
	showAsRadio: true,
};

const GNN_LATE_NIGHT: T_Org = {
	id: 'gnnLateNight',
	label: 'Late Night News',
	bgVideo: `${VID}box-background.mp4`,
	introVideo: `${VID}jungle/yellowarrow.webm`,
	introAudio: `${AUD}news3.mp3`,
	// introAudioDelay: 500,
	outroVideo: `${VID}fw_red.webm`,
	outroAudio: ``,
	introMidMs: 1400,
	outroMidMs: 500,
	showAsRadio: true,
};

export default new FirstContactConfig();
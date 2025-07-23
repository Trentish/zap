import {BaseGameConfig, T_Org, T_StatDef, T_TimerDef} from './BaseGameConfig.ts';
import './Generalissimo.css';
import {SituationDat} from '../../../zap-shared/_Dats.ts'; //## NOTE: will always load (regardless of gameIdf)

const VID = '../assets/videos/';
const AUD = '../assets/audio/';
const MINUTES = 60 * 1000;

class GeneralissimoConfig extends BaseGameConfig {
	gameIdf = 'tgid';
	gameDisplayName = "The Generallisimo is Dead";

	// bgVideo = `${VID}globe4.mp4`;
	bgVideo = '';

	showCrawler = false;
	showTopStories = true;
	topStoryCount = 5;

	logo = '../assets/images/wts/gnn_logo.svg';
	crawlerLogo = '../assets/images/wts/gnn_logo.svg';
	timerEndSound = `${AUD}juntas_end_turn_1.mp3`;

	orgs: T_Org[] = [YBC,VOY];
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
			label: 'Proposals',
			ms: 30 * MINUTES,
		},
		{
			label: 'Voting',
			ms: 15 * MINUTES,
		},
		{
			label: 'Ministerial',
			ms: 5 * MINUTES,
		},
	];

	statDefs: T_StatDef[] = [
		{label: 'Budget', className: 'national first'},
		{label: 'Stability', className: 'national'},
		{label: 'Legacy', className: 'national'},
		{label: 'Mobilisation', className: 'national'},
		{label: 'Repression', className: 'national'},
		{label: 'BYT Stock', className: 'corp'},
		{label: 'FDC Stock', className: 'corp'},
	]

	constructor() {
		super();
		for (const org of this.orgs) {
			this.orgLup.set(org.id, org);
		}
	}
}

const YBC: T_Org = {
	id: 'ybc',
	label: 'Yugenyan Broadcasting Corp (YBC)',
	bgVideo: `${VID}box-background.mp4`,
	introVideo: `${VID}yellowarrow.webm`,
	introAudio: `${AUD}news3.mp3`,
	// introAudioDelay: 500,
	outroVideo: `${VID}fw_blue.webm`,
	outroAudio: ``,
	introMidMs: 1000,
	outroMidMs: 500,
	showAsRadio: true,
};

const VOY: T_Org = {
	id: 'voy',
	label: 'Voice of Yugenya (VOY)',
	bgVideo: `${VID}globe4.mp4`,
	introVideo: `${VID}yellowarrow.webm`,
	introAudio: `${AUD}news1.mp3`,
	// introAudioDelay: 500,
	outroVideo: `${VID}fw_blue.webm`,
	outroAudio: ``,
	introMidMs: 1000,
	outroMidMs: 500,
	showAsRadio: true,
};

export default new GeneralissimoConfig();
import {BaseGameConfig, T_Org, T_TimerDef} from './BaseGameConfig.ts';
import './DenOfWolves.css';
import {SituationDat} from "../../../zap-shared/_Dats.ts"; //## NOTE: will always load (regardless of gameIdf)

const VID = '../assets/videos/';
const AUD = '../assets/audio/';
const MINUTES = 60 * 1000;

class DenOfWolvesConfig extends BaseGameConfig {
    gameIdf = 'denofwolves';

    bgVideo = `${VID}box-background.mp4`;

    showCrawler = true;
    logo = '../assets/images/denofwolves/inc_logo.svg';
    crawlerLogo = '../assets/images/denofwolves/inc_logo.svg';
    timerEndSound = `${AUD}juntas_end_turn_1.mp3`;

    orgs: T_Org[] = [INC, ATTACK];
    situationDefs: SituationDat[] = [
        {label: 'Alpha', cssClass: 'alpha'},
        {label: 'Bravo', cssClass: 'bravo'},
        {label: 'Charlie', cssClass: 'charlie'},
        {label: 'Delta', cssClass: 'delta'},
        {label: 'Echo', cssClass: 'echo'},
        {label: 'Wolf', cssClass: 'wolf'}
    ];
	
	timerDefs: T_TimerDef[] = [
		{
			label: 'Team Time',
			ms: 8 * MINUTES,
		},
        {
			label: 'Action Phase',
			ms: 22 * MINUTES,
		},
	];
    // ];

    constructor() {
        super();
        for (const org of this.orgs) {
            this.orgLup.set(org.id, org);
        }
    }
}


const INC: T_Org = {
    id: 'inc',
    label: 'INC',
    bgVideo: `${VID}box-background.mp4`,
    introVideo: `../assets/videos/jungle/yellowarrow.webm`,
    introAudio: `${AUD}denofwolves_news_1.mp3`,
    // introAudioDelay: 500,
    outroVideo: `../assets/videos/jungle/yellowarrow.webm`,
    outroAudio: ``,
    introMidMs: 1400,
    outroMidMs: 1400,
    showAsRadio: true,
};


const ATTACK: T_Org = {
    id: 'attack',
    label: 'Wolf Attack',
    bgVideo: `${VID}box-background.mp4`,
    introVideo: `${VID}fw_red.webm`,
    introAudio: `${AUD}denofwolves_alarm1.wav`,
    introAudioDelay: 400,
	outroVideo: `${VID}fw_red.webm`,
    outroAudio: ``,
    introMidMs: 700,
    outroMidMs: 700,
    showAsRadio: true,
};

export default new DenOfWolvesConfig();
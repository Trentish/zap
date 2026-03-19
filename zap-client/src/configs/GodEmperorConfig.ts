import {BaseGameConfig, T_Org, T_TimerDef} from './BaseGameConfig.ts';
import './GodEmperor.css';
import {PhaseDat, SituationDat} from "../../../zap-shared/_Dats.ts"; //## NOTE: will always load (regardless of gameIdf)

const VID = '../assets/videos/';
const AUD = '../assets/audio/';
const MINUTES = 60 * 1000;

class GodEmperorConfig extends BaseGameConfig {
    gameIdf = 'godemperor';

    bgVideo = ``;

    logo = '../assets/images/godemperor/logo.png';
    timerEndSound = `${AUD}juntas_end_turn_1.mp3`;

    orgs: T_Org[] = [ANNOUNCEMENT];
    situationDefs: SituationDat[] = [];
	
	timerDefs: T_TimerDef[] = [
        {
			label: 'Reception and Houses',
			ms: 30 * MINUTES,
		},
        {
			label: 'Welcome',
			ms: 15 * MINUTES,
		},
		{
			label: 'Teach',
			ms: 30 * MINUTES,
		},
        {
			label: 'Lunch',
			ms: 30 * MINUTES,
		},
	];

    phaseDefs: PhaseDat[] = [
        { label: 'Ceremony', ms: 4 * MINUTES },
        { label: 'Planning', ms: 10 * MINUTES },
        { label: 'Go to Action', ms: 1 * MINUTES },
        { label: 'Action Phase', ms: 14 * MINUTES },
        { label: 'Return to House', ms: 1 * MINUTES },
    ];

    constructor() {
        super();
        for (const org of this.orgs) {
            this.orgLup.set(org.id, org);
        }
    }
}


const ANNOUNCEMENT: T_Org = {
    id: 'announce',
    label: 'announce',
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


export default new GodEmperorConfig();
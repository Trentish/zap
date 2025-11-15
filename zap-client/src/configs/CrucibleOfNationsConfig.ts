import {BaseGameConfig, T_Org, T_TimerDef} from './BaseGameConfig.ts';
import './CrucibleOfNations.css';
import {SituationDat} from "../../../zap-shared/_Dats.ts"; //## NOTE: will always load (regardless of gameIdf)

const VID = '../assets/videos/';
const AUD = '../assets/audio/';
const MINUTES = 60 * 1000;

class CrucibleOfNationsConfig extends BaseGameConfig {
    gameIdf = 'crucibleofnations';

    bgVideo = `${VID}box-background.mp4`;

    showCrawler = false;
    timerEndSound = `${AUD}juntas_end_turn_1.mp3`;

    orgs: T_Org[] = [];
    situationDefs: SituationDat[] = [];
	
	timerDefs: T_TimerDef[] = [
		{
			label: 'Team Phase',
			ms: 5 * MINUTES,
		},
        {
			label: 'Leadership Phase',
			ms: 18 * MINUTES,
		},
        {
			label: 'Council Phase',
			ms: 7 * MINUTES,
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

export default new CrucibleOfNationsConfig();
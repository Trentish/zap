import {BaseGameConfig, T_Org, T_TimerDef} from './BaseGameConfig.ts';
import './DenOfWolves.css';
import {SituationDat} from "../../../zap-shared/_Dats.ts"; //## NOTE: will always load (regardless of gameIdf)

const DOW_VID = '../assets/videos/';
const DOW_AUD = '../assets/audio/';

class DenOfWolvesConfig extends BaseGameConfig {
    gameIdf = 'denofwolves';

    bgVideo = `${DOW_VID}box-background.mp4`;

    showCrawler = true;
    logo = '../assets/images/denofwolves/inc_logo.svg';
    crawlerLogo = '../assets/images/denofwolves/inc_logo.svg';
    timerEndSound = `${DOW_AUD}juntas_end_turn_1.mp3`;

    orgs: T_Org[] = [INC];
    situationDefs: SituationDat[] = [
        {label: 'Alpha', cssClass: 'alpha'},
        {label: 'Bravo', cssClass: 'bravo'},
        {label: 'Charlie', cssClass: 'charlie'},
        {label: 'Delta', cssClass: 'delta'},
        {label: 'Echo', cssClass: 'echo'},
        {label: 'Wolf', cssClass: 'wolf'}
    ];

    // timerDefs: T_TimerDef[] = [
    //     {
    //         label: 'Test Timer',
    //         ms: (5 * 60 * 1000) + 30000,
    //     },
    //     {
    //         label: 'Guild Meet',
    //         ms: 5 * 60 * 1000,
    //     },
    //     {
    //         label: 'Free Play',
    //         ms: 21 * 60 * 1000,
    //     },
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
    bgVideo: `${DOW_VID}box-background.mp4`,
    introVideo: `../assets/videos/jungle/yellowarrow.webm`,
    introAudio: `${DOW_AUD}denofwolves_news_1.mp3`,
    // introAudioDelay: 500,
    outroVideo: `../assets/videos/jungle/yellowarrow.webm`,
    outroAudio: ``,
    introMidMs: 1400,
    outroMidMs: 1400,
    showAsRadio: true,
};

export default new DenOfWolvesConfig();
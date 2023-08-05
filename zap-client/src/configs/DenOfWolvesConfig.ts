import {BaseGameConfig, T_Org, T_TimerDef} from './BaseGameConfig.ts';
import './DenOfWolves.css'; //## NOTE: will always load (regardless of gameIdf)

const DOW_VID = '../assets/videos/denofwolves/';
const DOW_AUD = '../assets/audio/';

class DenOfWolvesConfig extends BaseGameConfig {
    gameIdf = 'denofwolves';

    // bgVideo = `${DOW_VID}deephaven-background.mp4`;

    showCrawler = true;
    logo = '../assets/images/denofwolves/ink_logo.svg';
    crawlerLogo = '../assets/images/denofwolves/ink_logo.svg';

    orgs: T_Org[] = [INC];

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
    bgVideo: `${DOW_VID}spotlight-background-3.mp4`,
    introVideo: `../assets/videos/jungle/yellowarrow.webm`,
    // introAudio: `${DOW_AUD}gossip.mp3`,
    // introAudioDelay: 500,
    outroVideo: `../assets/videos/jungle/yellowarrow.webm`,
    outroAudio: ``,
    showAsRadio: true,
};

export default new DenOfWolvesConfig();
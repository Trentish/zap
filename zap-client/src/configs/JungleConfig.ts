import {BaseGameConfig, T_Org, T_SpotlightRefs, T_TimerDef} from './BaseGameConfig.ts';
import {ArticleDat} from '../../../zap-shared/_Dats.ts';
import './jungle.css'; //## NOTE: will always load (regardless of gameIdf)

const J_VIDS = '../assets/videos/jungle/';
const J_AUDIO = '../assets/audio/';

class JungleConfig extends BaseGameConfig {
    gameIdf = 'jungle';


    bgVideo = `${J_VIDS}jungle.mp4`;

    showCrawler = false;
    showLocationField = true;
    logo = '../assets/images/jungle/logo-cnn.svg';
    crawlerLogo = '';

    orgs: T_Org[] = [CNN];

    timerDefs: T_TimerDef[] = [{
        label: '',
        ms: 1000,
    }];

    constructor() {
        super();
        for (const org of this.orgs) {
            this.orgLup.set(org.id, org);
        }
    }

    override GetOrg(article: ArticleDat | undefined): T_Org {
        if (!article) return this.fallbackOrg;

        // could do random Org here
        // if (article.orgIdf === 'CNN') {
        // 	return random from here MULTI_CNN_THING etc.
        // }

        return super.GetOrg(article);
    }


    override OnStart_Spotlight(article: ArticleDat | undefined, refs: T_SpotlightRefs) {
        return;
    }
}

const CNN: T_Org = {
    id: 'pbs',
    label: 'CNN',
    bgVideo: `${J_VIDS}jungle_1.mp4`,
    // overlayVideo: `${J_VIDS}vhs.mp4`,
    showAsRadio: true,
    introMidMs: 1400,
    outroMidMs: 1400,
    introVideo: `${J_VIDS}yellowarrow.webm`,
    introAudio: `${J_AUDIO}jungle_1.mp3`, // TODO
    outroVideo: `${J_VIDS}yellowarrow.webm`,
    outroAudio: `${J_AUDIO}news_outro_1`, // TODO
};

export default new JungleConfig();
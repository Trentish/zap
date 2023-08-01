import {BaseGameConfig, T_Org, T_SpotlightRefs} from './BaseGameConfig.ts';
import {ArticleDat} from '../../../zap-shared/_Dats.ts';
import './juntas.css'; //## NOTE: will always load (regardless of gameIdf)

const J_VIDS = '../assets/videos/juntas/';

class JuntasConfig extends BaseGameConfig {
	gameIdf = 'juntas';
	
	
	bgVideo = `${J_VIDS}globe2.mov`;
	overlayVideo = `${J_VIDS}vhs.mp4`;
	
	showCrawler = false;
	logo = '../assets/images/juntas/logo-cnn.svg';
	
	orgs: T_Org[] = [BBC, CNN, PBS];
	
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
		console.log(`OnStart_Spotlight juntas`);
		if (!refs.spotlightBackgroundRef.current) return;
		
		// TODO: special case scrubbing
		// TODO: special 'Reagan' shit :)
		const headlineLower = article?.headline.toLowerCase() || '';
		
		// if (headlineLower.includes('reagan')) return REAGAN;
		
		if (article?.headline.includes('fart')) {
			refs.spotlightBackgroundRef.current.currentTime = 50;
			return;
		}
		
		
		const timeArray = [260, 32, 575, 289];
		const randomIndex = Math.floor(Math.random() * timeArray.length);
		
		refs.spotlightBackgroundRef.current.currentTime = timeArray[randomIndex];
	}
}

const BBC: T_Org = {
	id: 'bbc',
	label: 'BBC',
	bgVideo: `${J_VIDS}tobacco_fwp91f00.mp4`,
	// overlayVideo: `${J_VIDS}vhs.mp4`,
	introVideo: `${J_VIDS}cnn-transition-1.webm`,
	introAudio: ``, // TODO
	outroVideo: `${J_VIDS}cnn-transition-1.webm`,
	outroAudio: ``, // TODO
};

const CNN: T_Org = {
	id: 'cnn',
	label: 'CNN',
	bgVideo: `${J_VIDS}tobacco_fwp91f00.mp4`,
	// overlayVideo: `${J_VIDS}vhs.mp4`,
	introVideo: `${J_VIDS}cnn-transition-1.webm`,
	introAudio: ``, // TODO
	outroVideo: `${J_VIDS}cnn-transition-1.webm`,
	outroAudio: ``, // TODO
	showAsRadio: true,
};

const PBS: T_Org = {
	id: 'pbs',
	label: 'PBS',
	bgVideo: `${J_VIDS}tobacco_fwp91f00.mp4`,
	// overlayVideo: `${J_VIDS}vhs.mp4`,
	introVideo: `${J_VIDS}cnn-transition-1.webm`,
	introAudio: ``, // TODO
	outroVideo: `${J_VIDS}cnn-transition-1.webm`,
	outroAudio: ``, // TODO
};

const REAGAN: T_Org = {
	id: 'reagan',
	label: `oh no not that guy`,
	bgVideo: `../assets/videos/deephaven/spotlight-background-5.mp4`,
	// overlayVideo: `${J_VIDS}vhs.mp4`,
	introVideo: `${J_VIDS}cnn-transition-1.webm`,
	introAudio: ``, // TODO
	outroVideo: `${J_VIDS}cnn-transition-1.webm`,
	outroAudio: ``, // TODO
};


const MULTI_CNN_THING = [
	CNN,
	REAGAN,
	// etc.
];

export default new JuntasConfig();
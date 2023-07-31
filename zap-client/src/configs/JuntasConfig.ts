import {BaseGameConfig, T_Org, T_SpotlightRefs} from './BaseGameConfig.ts';
import {ArticleDat} from '../../../zap-shared/_Dats.ts';

const J_VIDS = '../assets/videos/juntas/';

class JuntasConfig extends BaseGameConfig {
	gameIdf = 'juntas';
	
	
	bgVideo = `${J_VIDS}globe2.mov`;
	introVideo = `${J_VIDS}cnn-transition-1.webm`; // TEMP
	outroVideo = `${J_VIDS}cnn-transition-1.webm`; // TEMP
	
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
		
		// TODO: special 'Reagan' shit :)
		const headlineLower = article.headline.toLowerCase();
		
		if (headlineLower.includes('reagan')) return REAGAN;
		
		return super.GetOrg(article);
	}
	
	
	override OnStart_Spotlight(article: ArticleDat | undefined, refs: T_SpotlightRefs) {
		console.log(`OnStart_Spotlight juntas`);
		if (!refs.spotlightBackgroundRef.current) return;
		
		const timeArray = [260, 32, 575, 289];
		const randomIndex = Math.floor(Math.random() * timeArray.length);
		
		refs.spotlightBackgroundRef.current.currentTime = timeArray[randomIndex];
	}
}

const BBC: T_Org = {
	id: 'bbc',
	label: 'BBC',
	bgVideo: `${J_VIDS}tobacco_fwp91f00.mp4`,
	overlay: `${J_VIDS}vhs.mp4`,
	introVideo: `${J_VIDS}cnn-transition-1.webm`,
	outroVideo: `${J_VIDS}cnn-transition-1.webm`,
};

const CNN: T_Org = {
	id: 'cnn',
	label: 'CNN',
	bgVideo: `${J_VIDS}tobacco_fwp91f00.mp4`,
	overlay: `${J_VIDS}vhs.mp4`,
	introVideo: `${J_VIDS}cnn-transition-1.webm`,
	outroVideo: `${J_VIDS}cnn-transition-1.webm`,
};

const PBS: T_Org = {
	id: 'pbs',
	label: 'PBS',
	bgVideo: `${J_VIDS}tobacco_fwp91f00.mp4`,
	overlay: `${J_VIDS}vhs.mp4`,
	introVideo: `${J_VIDS}cnn-transition-1.webm`,
	outroVideo: `${J_VIDS}cnn-transition-1.webm`,
};

const REAGAN: T_Org = {
	id: 'reagan',
	label: `oh no not that guy`,
	bgVideo: `../assets/videos/deephaven/spotlight-background-5.mp4`,
	overlay: `${J_VIDS}vhs.mp4`,
	introVideo: `${J_VIDS}cnn-transition-1.webm`,
	outroVideo: `${J_VIDS}cnn-transition-1.webm`,
};

export default new JuntasConfig();
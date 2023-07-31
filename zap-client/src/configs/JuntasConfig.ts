import {BaseGameConfig, T_Org, T_SpotlightRefs} from './BaseGameConfig.ts';

const J_VIDS = '../assets/videos/juntas/';

class JuntasConfig extends BaseGameConfig {
	gameIdf = 'juntas';
	
	
	bgVideo = `${J_VIDS}globe2.mov`;
	introVideo = `${J_VIDS}cnn-transition-1.webm`; // TEMP
	outroVideo = `${J_VIDS}cnn-transition-1.webm`; // TEMP
	
	showCrawler = false;
	logo = '../assets/images/juntas/logo-cnn.svg';
	
	orgs: T_Org[] = [BBC, CNN, PBS];
	
	OnStart_Spotlight(refs: T_SpotlightRefs) {
		console.log(`OnPlay_StingerIn juntas`)
		
		if (!refs.spotlightVideoRef.current) return;
		
		const timeArray = [260, 32, 575, 289];
		const randomIndex = Math.floor(Math.random() * timeArray.length);
		
		refs.spotlightVideoRef.current.currentTime = timeArray[randomIndex];
		refs.introRef.current?.play();
	}
	
	
	constructor() {
		super();
		for (const org of this.orgs) {
			this.orgLup.set(org.id, org);
		}
	}
}

const BBC: T_Org = {
	id: 'bbc',
	label: 'BBC',
	bgVideo: `${J_VIDS}tobacco_fwp91f00.mp4`,
	introVideo: `${J_VIDS}cnn-transition-1.webm`,
	outroVideo: `${J_VIDS}cnn-transition-1.webm`,
};

const CNN: T_Org = {
	id: 'cnn',
	label: 'CNN',
	bgVideo: `${J_VIDS}tobacco_fwp91f00.mp4`,
	introVideo: `${J_VIDS}cnn-transition-1.webm`,
	outroVideo: `${J_VIDS}cnn-transition-1.webm`,
};

const PBS: T_Org = {
	id: 'pbs',
	label: 'PBS',
	bgVideo: `${J_VIDS}tobacco_fwp91f00.mp4`,
	introVideo: `${J_VIDS}cnn-transition-1.webm`,
	outroVideo: `${J_VIDS}cnn-transition-1.webm`,
};

export default new JuntasConfig();
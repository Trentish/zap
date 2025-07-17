import {T_Org} from './BaseGameConfig.ts';

const VID = '../assets/videos/';
const AUD = '../assets/audio/';

export function RenameOrg(org: T_Org, name: string): T_Org {
	return {
		...org,
		// id: name,
		label: name,
	};
}

export const HEARSAY: T_Org = {
	id: 'hearsay',
	cssClass: 'hearsay',
	label: 'Hearsay',
	bgVideo: `${VID}spotlight-background-3.mp4`,
	introVideo: `${VID}vahalla.webm`,
	introAudio: `${AUD}gossip.mp3`,
	introAudioDelay: 0,
	outroVideo: `${VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
export const INNOVATION: T_Org = {
	id: 'innovation',
	cssClass: 'innovation',
	label: 'Innovation',
	bgVideo: `${VID}spotlight-background-2.mp4`,
	introVideo: `${VID}vahalla.webm`,
	introAudio: `${AUD}innovation.mp3`,
	introAudioDelay: 200,
	outroVideo: `${VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
export const ACCOLADE: T_Org = {
	id: 'accolade',
	cssClass: 'accolade',
	label: 'Accolade',
	bgVideo: `${VID}spotlight-background-4.mp4`,
	introVideo: `${VID}vahalla.webm`,
	introAudio: `${AUD}accolade.mp3`,
	introAudioDelay: 200,
	outroVideo: `${VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
export const CRISIS: T_Org = {
	id: 'crisis',
	cssClass: 'crisis',
	label: 'Crisis',
	bgVideo: `${VID}spotlight-background-5.mp4`,
	introVideo: `${VID}realm.webm`,
	introAudio: `${AUD}crisis.mp3`,
	introAudioDelay: 0,
	outroVideo: `${VID}realm.webm`,
	outroAudio: ``,
	introMidMs: 1000,
	outroMidMs: 1000,
	showAsRadio: true,
};
export const OATH: T_Org = {
	id: 'oath',
	cssClass: 'oath',
	label: 'Oath',
	bgVideo: `${VID}spotlight-background-3.mp4`,
	introVideo: `${VID}vahalla.webm`,
	introAudio: `${AUD}oath.mp3`,
	introAudioDelay: 0,
	outroVideo: `${VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
export const GRUDGE: T_Org = {
	id: 'grudge',
	cssClass: 'grudge',
	label: 'Grudge',
	bgVideo: `${VID}spotlight-background-2.mp4`,
	introVideo: `${VID}realm.webm`,
	introAudio: `${AUD}grudge.mp3`,
	introAudioDelay: 0,
	outroVideo: `${VID}realm.webm`,
	outroAudio: ``,
	introMidMs: 1000,
	outroMidMs: 1000,
	showAsRadio: true,
};
export const DOOM: T_Org = {
	id: 'doom',
	cssClass: 'doom',
	label: 'Doom',
	bgVideo: `${VID}spotlight-background-5.mp4`,
	introVideo: `${VID}lightning.webm`,
	introAudio: `${AUD}doom.mp3`,
	introAudioDelay: 0,
	outroVideo: `${VID}lightning.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};



export const LIFESTYLE: T_Org = {
	id: 'lifestyle',
	cssClass: 'lifestyle',
	label: 'Lifestyle',
	bgVideo: `${VID}spotlight-background-3.mp4`,
	introVideo: `${VID}vahalla.webm`,
	introAudio: `${AUD}lifestyle.mp3`,
	introAudioDelay: 0,
	outroVideo: `${VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
export const FINANCE: T_Org = {
	id: 'finance',
	cssClass: 'finance',
	label: 'Finance',
	bgVideo: `${VID}spotlight-background-3.mp4`,
	introVideo: `${VID}vahalla.webm`,
	introAudio: `${AUD}finance.mp3`,
	introAudioDelay: 0,
	outroVideo: `${VID}vahalla.webm`,
	outroAudio: ``,
	introMidMs: 601,
	outroMidMs: 601,
	showAsRadio: true,
};
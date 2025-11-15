import {atom, getDefaultStore} from 'jotai';
import {atomWithLocation} from 'jotai-location';
import {E_ConnStatus, E_Endpoint, T_GameIdf} from '../../zap-shared/SystemTypes.ts';
import {
	AllStatsDat,
	ArticleDat,
	SituationDat,
	SpotlightDat,
	TimerDat,
} from '../../zap-shared/_Dats.ts';
import {atomWithStorage, splitAtom} from 'jotai/utils';
import {nanoid} from 'nanoid';
import {FallbackConfig} from './configs/BaseGameConfig.ts';

// TODO: import all config files instead of hardcode
import DeephavenConfig from './configs/DeephavenConfig.ts';
import JuntasConfig from './configs/JuntasConfig.ts';
import JungleConfig from './configs/JungleConfig.ts';
import React from 'react';
import CrucibleOfNationsConfig from './configs/CrucibleOfNationsConfig.ts'
import DenOfWolvesConfig from './configs/DenOfWolvesConfig.ts';
import GrimvaleConfig from './configs/GrimvaleConfig.ts';
import GoblinConfig from './configs/GoblinConfig.ts';
import WatchTheSkiesConfig from './configs/WatchTheSkiesConfig.ts';
import InkConfig from './configs/InkConfig.ts';
import GenConfig from './configs/GenConfig.ts';
import FirstContactConfig from "./configs/FirstContactConfig.ts";
import GeneralissimoConfig from "./configs/GeneralissimoConfig.ts";
import TouchedByDarknessConfig from "./configs/TouchedByDarknessConfig.ts";

export const $store = getDefaultStore();
export const $connStatus = atom(E_ConnStatus.unset);
export const $connError = atom('');
export const $location = atomWithLocation();
export const $endpoint = atom(E_Endpoint.unknown);
export const $gameIdf = atom<T_GameIdf>('');
export const $allGameIdfs = atom<string[]>([]);
export const $uuid = atomWithStorage('ZAP_UUID', nanoid(5));
/** all articles we have locally (may not have *all* of them) */
export const $allArticles = atom<ArticleDat[]>([]);
export const $splitArticles = splitAtom($allArticles);//, a => `articleAtomId${a.id}`);
export const $spotlight = atom<SpotlightDat>({spotlightId: -1, pendingAboveId: -1});

export const $spotlightArticle = atom<ArticleDat | null>((get) => {
	const articles = get($allArticles);
	const spotlight = get($spotlight);
	const article = articles.find(a => a.id === spotlight.spotlightId);
	return article || null;
});

export const $crawlerArticles = atom<ArticleDat[]>([]);

export const $author = atomWithStorage('ZAP_AUTHOR', '');

export const $timer = atom<TimerDat>({label: '', ms: 0, phaseIndex: -1});
export const $timerAudioRef = atom<React.RefObject<HTMLAudioElement> | undefined>(undefined);

export const $situation = atom<SituationDat>({label: '', cssClass: ''});
export const $allStats = atom<AllStatsDat>({values: []});

export const $config = atom(get => {
	switch (get($gameIdf)) {
		case InkConfig.gameIdf:
			return InkConfig;
		case GenConfig.gameIdf:
			return GenConfig;
		case DeephavenConfig.gameIdf:
			return DeephavenConfig;
		case JuntasConfig.gameIdf:
			return JuntasConfig;
		case JungleConfig.gameIdf:
			return JungleConfig;
		case DenOfWolvesConfig.gameIdf:
			return DenOfWolvesConfig;
		case GrimvaleConfig.gameIdf:
			return GrimvaleConfig;
		case GoblinConfig.gameIdf:
			return GoblinConfig;
		case WatchTheSkiesConfig.gameIdf:
			return WatchTheSkiesConfig;
		case FirstContactConfig.gameIdf:
			return FirstContactConfig;
		case GeneralissimoConfig.gameIdf:
			return GeneralissimoConfig;
		case TouchedByDarknessConfig.gameIdf:
			return TouchedByDarknessConfig;
		case CrucibleOfNationsConfig.gameIdf:
			return CrucibleOfNationsConfig;
		default:
			return FallbackConfig;
	}
});
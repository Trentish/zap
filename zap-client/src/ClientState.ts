import {atom, getDefaultStore} from 'jotai';
import {atomWithLocation} from 'jotai-location';
import {E_ConnStatus, E_Endpoint, T_GameIdf} from '../../zap-shared/SystemTypes.ts';
import {ArticleDat, SpotlightDat, TimerDat} from '../../zap-shared/_Dats.ts';
import {atomWithStorage, splitAtom} from 'jotai/utils';
import {nanoid} from 'nanoid';
import {FallbackConfig} from './configs/BaseGameConfig.ts';
import DeephavenConfig from './configs/DeephavenConfig.ts';
import JuntasConfig from './configs/JuntasConfig.ts';
import JungleConfig from './configs/JungleConfig.ts';

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

export const $timer = atom<TimerDat>({label: '', ms: 0});

export const $config = atom(get => {
	switch (get($gameIdf)) {
		case DeephavenConfig.gameIdf:
			return DeephavenConfig;
		case JuntasConfig.gameIdf:
			return JuntasConfig;
		case JungleConfig.gameIdf:
			return JungleConfig;
		default:
			return FallbackConfig;
	}
});
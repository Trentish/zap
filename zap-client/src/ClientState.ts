import {atom, getDefaultStore} from 'jotai';
import {atomWithLocation} from 'jotai-location';
import {E_ConnStatus, E_Endpoint, T_GameIdf} from '../../zap-shared/SystemTypes.ts';
import {ArticleDat, SpotlightDat, TimerDat} from '../../zap-shared/_Dats.ts';
import {atomWithStorage, splitAtom} from 'jotai/utils';

export const $store = getDefaultStore();
export const $connStatus = atom(E_ConnStatus.unset);
export const $connError = atom('');
export const $location = atomWithLocation();
export const $endpoint = atom(E_Endpoint.unknown);
export const $gameIdf = atom<T_GameIdf>('');
export const $allGameIdfs = atom<string[]>([]);

export const $allArticles = atom<ArticleDat[]>([]);
export const $splitArticles = splitAtom($allArticles);//, a => `articleAtomId${a.id}`);
export const $spotlight = atom<SpotlightDat>({spotlightId: -1, pendingAboveId: -1});

export const $author = atomWithStorage('ZAP_AUTHOR', '');

export const $timer = atom<TimerDat>({label: '', ms: 0});

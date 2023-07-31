import {ArticleDat} from '../../../zap-shared/_Dats.ts';
import {Timer} from '../displays/Timer.tsx';
import {atom, useAtom} from 'jotai';
import './ProjectorPage.css';
import React, {useEffect, useRef, useState} from 'react';
import {
	$config,
	$splitArticles,
	$spotlight,
	$spotlightArticle,
	$store,
	$timer,
} from '../ClientState.ts';
import {Atom} from 'jotai/vanilla/atom';
import {clsx} from 'clsx';
import {Crawler} from './Crawler.tsx';
import {useClient} from '../ClientContext.ts';
import {BackgroundVideo, Video} from '../components/VideoComponents.tsx';
import {
	INTRO_MID_DEFAULT,
	OUTRO_MID_DEFAULT,
	T_Org,
	T_SpotlightRefs,
} from '../configs/BaseGameConfig.ts';

const SHOW_LAST_COUNT = 7;
const LOG = true;

const $spotlightOrg = atom<T_Org | null>(null);

export function ProjectorPage() {
	const client = useClient();
	const [config] = useAtom($config);
	
	return (
		<div className={`projector-page ${client.gameIdf}`}>
			<InitialClickMe/>
			
			<BackgroundVideo
				src={config.bgVideo}
				id={'backgroundVideoLoop'}
			/>
			
			<Timer $timer={$timer}/>
			
			<Headlines/>
			
			{config.showCrawler && (
				<Crawler/>
			)}
			
			{config.logo && (
				<img className={'logo'} src={config.logo}/>
			)}
			
			<Spotlight/>
		</div>
	);
}

function Headlines() {
	const [articles] = useAtom($splitArticles);
	
	return (
		<div className={'articles'}>
			{articles.slice(-SHOW_LAST_COUNT).reverse().map($article => (
				<Headline
					key={`${$article}`}
					$article={$article}
				/>
			))}
		</div>
	);
}

const SHOW = (element: HTMLElement | null) => element?.classList.add('show');
const HIDE = (element: HTMLElement | null) => element?.classList.remove('show');
const ADD_CLASS = (element: HTMLElement | null, c: string) => element?.classList.add(c);
const REMOVE_CLASS = (element: HTMLElement | null, c: string) => element?.classList.remove(c);
const PLAY = (videoEl: HTMLVideoElement | null) => videoEl?.play().then();
const SET_VID = (videoEl: HTMLVideoElement | null, src: string | undefined) => {
	if (videoEl && src) videoEl.src = src;
};
const SET_TEXT = (element: HTMLDivElement | null, text: string) => {
	if (element) element.innerText = text;
};

function Spotlight() {
	const [article] = useAtom($spotlightArticle);
	const [config] = useAtom($config);
	
	const spotlightContainerRef = useRef<HTMLDivElement>(null);
	const spotlightBackgroundRef = useRef<HTMLVideoElement>(null);
	const spotlightOverlayRef = useRef<HTMLVideoElement>(null);
	const introRef = useRef<HTMLVideoElement>(null);
	const outroRef = useRef<HTMLVideoElement>(null);
	const carrierRef = useRef<HTMLDivElement>(null);
	const themeRef = useRef<HTMLDivElement>(null);
	const headlineRef = useRef<HTMLDivElement>(null);
	
	const refs: T_SpotlightRefs = {
		spotlightContainerRef: spotlightContainerRef,
		spotlightBackgroundRef: spotlightBackgroundRef,
		spotlightOverlayRef: spotlightOverlayRef,
		introRef: introRef,
		outroRef: outroRef,
		carrierRef: carrierRef,
		themeRef: themeRef,
		headlineRef: headlineRef,
	};
	
	if (LOG) console.log(`🔦 render: Spotlight`, article);
	
	useEffect(() => {
		const spotlightContainer = spotlightContainerRef.current;
		const background = spotlightBackgroundRef.current;
		const overlay = spotlightOverlayRef.current;
		const intro = introRef.current;
		const outro = outroRef.current;
		const carrier = carrierRef.current;
		const theme = themeRef.current;
		const headline = headlineRef.current;
		
		
		if (article) {
			//## article ENTER
			if (LOG) console.log(`🔦 useEffect: Spotlight,  article ENTER`, article);
			
			const org = config.GetOrg(article);
			$store.set($spotlightOrg, org);
			
			ADD_CLASS(spotlightContainer, org.id);
			
			SET_VID(background, org.bgVideo);
			SET_VID(intro, org.introVideo);
			SET_VID(outro, org.outroVideo);
			SET_VID(overlay, org.overlayVideo);
			SET_TEXT(theme, org.label);
			SET_TEXT(headline, article.headline);
			
			SHOW(intro);
			PLAY(intro);
			
			const introTimer = setTimeout(
				() => {
					if (LOG) console.log(`🔦 useEffect: Spotlight,  intro mid`);
					SHOW(intro);
					SHOW(background);
					SHOW(overlay);
					SHOW(carrier);
					
					config.OnStart_Spotlight(article, refs);
				},
				org.introMidMs || INTRO_MID_DEFAULT,
			);
			
			return () => {
				if (LOG) console.log(`🔦 useEffect: Spotlight,  ENTER cleanup`);
				clearTimeout(introTimer);
			}; //>> started spotlight
		}
		
		
		// not useAtom because we don't want it to trigger a new render
		const prevOrg = $store.get($spotlightOrg);
		
		if (!prevOrg) {
			if (LOG) console.log(`🔦 useEffect: Spotlight,  no prevOrg`);
			return; //>> was not playing a spotlight
		}
		
		//## spotlight EXIT
		if (LOG) console.log(`🔦 useEffect: Spotlight,  spotlight EXIT`);
		
		SHOW(outro);
		PLAY(outro);
		
		const outroTimer = setTimeout(
			() => {
				if (LOG) console.log(`🔦 useEffect: Spotlight,  outro mid`);
				
				HIDE(background);
				HIDE(overlay);
				HIDE(carrier);
			},
			prevOrg.outroMidMs || OUTRO_MID_DEFAULT,
		);
		
		return () => {
			if (LOG) console.log(`🔦 useEffect: Spotlight,  EXIT cleanup`);
			clearTimeout(outroTimer);
			REMOVE_CLASS(spotlightContainer, prevOrg.id);
			HIDE(background);
			HIDE(overlay);
			HIDE(intro);
			HIDE(outro);
			HIDE(carrier);
		}; //>> triggered outro
	}, [article]);
	
	return (
		<div
			ref={spotlightContainerRef}
			className={`spotlight-container`}
			id={'spotlight'}
		>
			<BackgroundVideo
				// src={org.bgVideo}
				src={''}
				className={'spotlight-background'}
				ref={spotlightBackgroundRef}
			/>
			
			<BackgroundVideo
				// src={org.overlayVideo}
				src={''}
				className={'spotlight-overlay'}
				ref={spotlightOverlayRef}
			/>
			
			<Video
				// src={org.introVideo}
				src={``}
				className={'intro'}
				ref={introRef}
			/>
			
			<Video
				// src={org.outroVideo}
				src={''}
				className={'outro'}
				ref={outroRef}
			/>
			
			<div
				className={'spotlight-carrier'}
				ref={carrierRef}
			>
				{/*<div className={'theme'}>{org?.label}</div>*/}
				{/*<div className={'headline'}>{article?.headline}</div>*/}
				<div
					className={'theme'}
					ref={themeRef}
				>{''}</div>
				<div
					className={'headline'}
					ref={headlineRef}
				>{''}</div>
			</div>
		</div>
	);
}

function Headline({$article}: { $article: Atom<ArticleDat> }) {
	const [article] = useAtom($article);
	const [spotlight] = useAtom($spotlight);
	
	const className = clsx(
		'article',
		article.orgIdf,
		{'spotlight': spotlight.spotlightId === article.id},
		{'pending': article.id > spotlight.pendingAboveId},
	);
	
	return (
		<div
			className={className}
			data-article-id={article.id}
			data-spotlight-id={spotlight.spotlightId}
			data-pending-above-id={spotlight.pendingAboveId}
		>
			{article.headline} --- {className}
		</div>
	);
}

function InitialClickMe() {
	const [needClick, setNeedClick] = useState(true);
	if (!needClick) return <div/>;
	
	return (
		<div
			className={'initial-click-me'}
			onClick={() => setNeedClick(false)}
		>Click Me</div>
	);
}
import {ArticleDat} from '../../../zap-shared/_Dats.ts';
import {Timer} from '../displays/Timer.tsx';
import {useAtom} from 'jotai';
import './ProjectorPage.css';
import React, {useRef} from 'react';
import {$config, $splitArticles, $spotlight, $timer} from '../ClientState.ts';
import {Atom} from 'jotai/vanilla/atom';
import {clsx} from 'clsx';
import {Crawler} from './Crawler.tsx';
import {useClient} from '../ClientContext.ts';
import {BackgroundVideo, Video} from '../components/VideoComponents.tsx';

const SHOW_LAST_COUNT = 7;

const stingerInRef = React.createRef<HTMLVideoElement>();
const stingerOutRef = React.createRef<HTMLVideoElement>();

// TODO: move
let MUTATING_SPOTLIGHT_REF: React.RefObject<HTMLDivElement>;

export function ProjectorPage() {
	const client = useClient();
	const [config] = useAtom($config);
	
	return (
		<div className={`projector-page ${client.gameIdf}`}>
			<BackgroundVideo
				src={config.bgVideo}
				id={'backgroundVideoLoop'}
			/>
			
			<Video
				// src={config.introVideo}
				src={'../assets/videos/juntas/cnn-transition-1.webm'}
				onTimeUpdate={evt => config.OnTimeUpdate_StingerIn(
					evt,
					MUTATING_SPOTLIGHT_REF?.current,
				)}
				onPlay={evt => config.OnPlay_StingerIn(evt, stingerOutRef.current)}
				className={'stinger in-stinger'}
				ref={stingerInRef}
			/>
			
			<Video
				src={config.outroVideo}
				onTimeUpdate={evt => config.OnTimeUpdate_StingerOut(
					evt,
					MUTATING_SPOTLIGHT_REF?.current,
				)}
				className={'stinger out-stinger'}
				ref={stingerOutRef}
			/>
			
			<Timer $timer={$timer}/>
			
			<Headlines/>
			
			{config.showCrawler && (
				<Crawler/>
			)}
			
			{config.logo && (
				<img className={'logo'} src={'../assets/images/deephaven/ink6.svg'}/>
			)}
		</div>
	);
}

function Headlines() {
	const [articles] = useAtom($splitArticles);
	
	return (
		<>
			<div className={`spotlight-articles`}>
				{articles.slice(-SHOW_LAST_COUNT).reverse().map($article => (
					<SpotlightHeadline
						key={`${$article}`}
						$article={$article}
					/>
				))}
			</div>
			<div className={'articles'}>
				{articles.slice(-SHOW_LAST_COUNT).reverse().map($article => (
					<Headline
						key={`${$article}`}
						$article={$article}
					/>
				))}
			</div>
		</>
	);
}

function SpotlightHeadline({$article}: { $article: Atom<ArticleDat> }) {
	const [article] = useAtom($article);
	const [spotlight] = useAtom($spotlight);
	const [config] = useAtom($config);
	
	
	const spotlightRef = useRef<HTMLDivElement>(null);
	const bgVideoRef = useRef<HTMLVideoElement>(null);
	
	
	const weAreSpotlightingThisArticleRightNow = spotlight.spotlightId === article.id;
	
	const className = clsx(
		'article',
		article.orgIdf,
		{'spotlight': weAreSpotlightingThisArticleRightNow},
	);
	
	if (weAreSpotlightingThisArticleRightNow) {
		// We do this so it's accessible elsewhere
		MUTATING_SPOTLIGHT_REF = spotlightRef;
	}
	
	return (
		<div
			ref={spotlightRef}
			onAnimationStart={() => config.OnStart_Spotlight(stingerInRef.current, bgVideoRef.current)}
			className={className}
			data-debug={`${article.id}, ${spotlight.spotlightId}, ${spotlight.pendingAboveId}`}
		>
			{weAreSpotlightingThisArticleRightNow && (
				<BackgroundVideo
					src={config.GetOrg(article.orgIdf).bgVideo}
					className={'spotlight-background'}
					ref={bgVideoRef}
				/>
			)}
			<div className={'spotlight-carrier'}>
				<div className={'theme'}>{article.orgIdf}</div>
				<div className={'headline'}>{article.headline}</div>
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
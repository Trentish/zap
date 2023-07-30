import {ArticleDat} from '../../../zap-shared/_Dats.ts';
import {Timer} from '../displays/Timer.tsx';
import {useAtom} from 'jotai';
import './ProjectorPage.css';
import React, {SyntheticEvent} from 'react';
import {$gameIdf, $splitArticles, $spotlight, $timer} from '../ClientState.ts';
import {Atom} from 'jotai/vanilla/atom';
import {clsx} from 'clsx';
import {Crawler} from './Crawler.tsx';
import {useClient} from '../ClientContext.ts';
import {BackgroundVideo, Video} from '../components/VideoComponents.tsx';

const eventBus = document;

const SHOW_LAST_COUNT = 7;

const stingerInRef = React.createRef<HTMLVideoElement>();
const stingerOutRef = React.createRef<HTMLVideoElement>();
const hackyHackHackCNNSpotRef = React.createRef<HTMLVideoElement>();

/*
	I don't love this as a solution -- global variable!
	but passing things around through DISJOINT events
	makes it hard. It's not a true event chain we fully
	control that we're dealing with.
*/
let MUTATING_SPOTLIGHT_REF = React.createRef<HTMLDivElement>();

eventBus.addEventListener('custom:startTheSpotlight', e => {
	if (stingerInRef.current != null) stingerInRef.current.play();
});
eventBus.addEventListener('custom:endTheSpotlight', e => {
	if (stingerOutRef.current != null) stingerOutRef.current.play();
});
eventBus.addEventListener('custom:scrubToRandomCNNSpot', e => {
	if (hackyHackHackCNNSpotRef.current != null) {
		const timeArray = [260, 32, 575, 289];
		const randomIndex = Math.floor(Math.random() * timeArray.length);
		
		hackyHackHackCNNSpotRef.current.currentTime = timeArray[randomIndex];
	}
});

const headlineStingerIn_onTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) => {
	console.log(event.currentTarget.currentTime);
	if (event.currentTarget.currentTime >= 1) {
		console.log('headlineStingerIn_onTimeUpdate we\'re 1 seconds in!');
		if (MUTATING_SPOTLIGHT_REF.current != null) MUTATING_SPOTLIGHT_REF.current.classList.add(
			'now-showing');
	}
};

const TEMPORARY__headlineStingerIn_onPlay = (event: SyntheticEvent<HTMLVideoElement>) => {
	/*
		We should be reacting to something the server does here.
		Ideally the server will give us something we can use
		so we can have the SpotlightHeadline function add an additional
		class to the spotlight when it's about to be turned off, say
		3 seconds before it's going to be removed (ideally customizable).
		That way we know the end is coming and can signal it that way, I think.

		Our goal is to have the outtro video complete and the spotlight hidden
		before react/theserver starts messing with the DOM again.

		At least those are my sleepy thoughts right now!
	 */
	
	setTimeout(function () {
		console.log('6 seconds');
		const evt = new CustomEvent('custom:endTheSpotlight');
		eventBus.dispatchEvent(evt);
	}, 9000);
};

const headlineStingerOut_onTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) => {
	console.log(event.currentTarget.currentTime);
	if (event.currentTarget.currentTime >= 1) {
		console.log('headlineStingerOut_onTimeUpdate we\'re 1 seconds in!');
		if (MUTATING_SPOTLIGHT_REF.current != null) MUTATING_SPOTLIGHT_REF.current.classList.remove(
			'now-showing');
	}
};

export function ProjectorPage() {
	const client = useClient();
	
	const [gameIdf] = useAtom($gameIdf);
	const itIsDeephavenTime = gameIdf === 'deephaven';
	const itIsJuntasTime = gameIdf === 'juntas';
	
	if (itIsDeephavenTime) {
		
		return (
			<div className={`projector-page ${client.gameIdf}`}>
				<BackgroundVideo
					src={'../assets/videos/box-background.mp4'}
					id={'backgroundVideoLoop'}
				/>
				<Video
					src={'../assets/videos/ink-transition.webm'}
					onTimeUpdate={headlineStingerIn_onTimeUpdate}
					onPlay={TEMPORARY__headlineStingerIn_onPlay}
					className={'stinger in-stinger'}
					ref={stingerInRef}
				/>
				<Video
					src={'../assets/videos/ink-transition.webm'}
					onTimeUpdate={headlineStingerOut_onTimeUpdate}
					className={'stinger out-stinger'}
					ref={stingerOutRef}
				/>
				<Timer $timer={$timer}/>
				
				<Headlines/>
				
				<Crawler/>
				<img className='inkbeard-news-logo' src={'../assets/images/deephaven/ink6.svg'}/>
			</div>
		);
	}
	
	
	if (itIsJuntasTime) {
		return (
			<div className={`projector-page ${client.gameIdf}`}>
				<BackgroundVideo
					src={'../assets/videos/juntas/globe2.mov'}
					id={'backgroundVideoLoop'}
				/>
				<Video
					src={'../assets/videos/juntas/cnn-transition-1.webm'}
					onTimeUpdate={headlineStingerIn_onTimeUpdate}
					onPlay={TEMPORARY__headlineStingerIn_onPlay}
					className='stinger in-stinger'
					ref={stingerInRef}
				/>
				<Video
					src={'../assets/videos/juntas/cnn-transition-1.webm'}
					onTimeUpdate={headlineStingerOut_onTimeUpdate}
					className='stinger out-stinger'
					ref={stingerOutRef}
				/>
				
				<Timer $timer={$timer}/>
				
				<Headlines/>
				
				{/*<Crawler/>*/}
				<img className='juntas-news-logo' src={'../assets/images/juntas/logo-cnn.svg'}/>
				
				<BackgroundVideo
					src={'../assets/videos/juntas/vhs.mp4'}
					id={'vhs-distortion'}
				/>
			</div>
		);
	}
	
	return (
		<div className={`projector-page ${client.gameIdf}`}>
			<BackgroundVideo
				src={'../assets/videos/box-background.mp4'}
				id={'backgroundVideoLoop'}
			/>
			<Video
				src={'../assets/videos/fw_red.webm'}
				onTimeUpdate={headlineStingerIn_onTimeUpdate}
				onPlay={TEMPORARY__headlineStingerIn_onPlay}
				className={'stinger in-stinger'}
				ref={stingerInRef}
			/>
			<Video
				src={'../assets/videos/circle_red.webm'}
				onTimeUpdate={headlineStingerOut_onTimeUpdate}
				className={'stinger out-stinger'}
				ref={stingerOutRef}
			/>
			<Timer $timer={$timer}/>
			
			<Headlines/>
			
			{/*<Crawler/>*/}
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
	const onAnimationStart = () => {
		console.log(`A new spotlight headline has dropped!`);
		const evt = new CustomEvent('custom:startTheSpotlight');
		eventBus.dispatchEvent(evt);
		
		
		const hackyMcHackerson = new CustomEvent('custom:scrubToRandomCNNSpot');
		eventBus.dispatchEvent(hackyMcHackerson);
	};
	
	const articleRef = React.createRef<HTMLDivElement>();
	
	const weAreSpotlightingThisArticleRightNow = spotlight.spotlightId === article.id;
	
	const className = clsx(
		'article',
		article.orgIdf,
		{'spotlight': weAreSpotlightingThisArticleRightNow},
	);
	
	if (weAreSpotlightingThisArticleRightNow) {
		// We do this so it's accessible elsewhere
		MUTATING_SPOTLIGHT_REF = articleRef;
	}
	
	/*
		TODO: Fix hackiness!
		TODO: Figure out how!
	 */
	const [gameIdf] = useAtom($gameIdf);
	const itIsDeephavenTime = gameIdf === 'deephaven';
	const itIsJuntasTime = gameIdf === 'juntas';
	
	if (itIsDeephavenTime) {
		return (
			<div
				ref={articleRef}
				onAnimationStart={onAnimationStart}
				className={className}
				data-article-id={article.id}
				data-spotlight-id={spotlight.spotlightId}
				data-pending-above-id={spotlight.pendingAboveId}
			>
				<BackgroundVideo
					src={'../assets/videos/deephaven/spotlight-background-3.mp4'}
					className={'spotlight-background'}
				/>
				<BackgroundVideo
					src={'../assets/videos/deephaven/spotlight-background-5.mp4'}
					className={'spotlight-background doom-background'}
				/>
				<div className={'spotlight-carrier'}>
					<div className={'theme'}>{article.orgIdf}</div>
					<div className={'headline'}>{article.headline}</div>
				</div>
			</div>
		);
	}
	
	if (itIsJuntasTime) {
		return (
			<div
				ref={articleRef}
				onAnimationStart={onAnimationStart}
				className={className}
				data-article-id={article.id}
				data-spotlight-id={spotlight.spotlightId}
				data-pending-above-id={spotlight.pendingAboveId}
			>
				<BackgroundVideo
					src={'../assets/videos/juntas/tobacco_fwp91f00.mp4'}
					className={'spotlight-background'}
					ref={hackyHackHackCNNSpotRef}
				/>
				<div className={'spotlight-carrier'}>
					<div className={'theme'}>{article.orgIdf}</div>
					<div className={'headline'}>{article.headline}</div>
				</div>
			</div>
		);
	}
	
	return (
		<div
			ref={articleRef}
			onAnimationStart={onAnimationStart}
			className={className}
			data-article-id={article.id}
			data-spotlight-id={spotlight.spotlightId}
			data-pending-above-id={spotlight.pendingAboveId}
		>
			<div className='spotlight-carrier'>
				<div className='headline'>{article.headline}</div>
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
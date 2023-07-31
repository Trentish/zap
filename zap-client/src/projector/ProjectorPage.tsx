import {ArticleDat} from '../../../zap-shared/_Dats.ts';
import {Timer} from '../displays/Timer.tsx';
import {useAtom} from 'jotai';
import './ProjectorPage.css';
import React, {useEffect, useRef} from 'react';
import {$allArticles, $config, $splitArticles, $spotlight, $timer} from '../ClientState.ts';
import {Atom} from 'jotai/vanilla/atom';
import {clsx} from 'clsx';
import {Crawler} from './Crawler.tsx';
import {useClient} from '../ClientContext.ts';
import {BackgroundVideo, Video} from '../components/VideoComponents.tsx';
import {T_SpotlightRefs} from '../configs/BaseGameConfig.ts';

const SHOW_LAST_COUNT = 7;

export function ProjectorPage() {
	const client = useClient();
	const [config] = useAtom($config);
	
	return (
		<div className={`projector-page ${client.gameIdf}`}>
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
				<img className={'logo'} src={'../assets/images/deephaven/ink6.svg'}/>
			)}
			
			<Spotlight/>
		</div>
	);
}

function Headlines() {
	const [articles] = useAtom($splitArticles);
	
	return (
		<>
			{/*<div className={`spotlight-articles`}>*/}
			{/*	{articles.slice(-SHOW_LAST_COUNT).reverse().map($article => (*/}
			{/*		<SpotlightHeadline*/}
			{/*			key={`${$article}`}*/}
			{/*			$article={$article}*/}
			{/*		/>*/}
			{/*	))}*/}
			{/*</div>*/}
			
			{/*<div className={'spotlight-articles'}>*/}
			{/*	<Spotlight/>*/}
			{/*</div>*/}
			
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

function Spotlight() {
	const [articles] = useAtom($allArticles);
	const [spotlight] = useAtom($spotlight);
	
	const article = articles.find(a => a.id === spotlight.spotlightId);
	
	return (
		<SpotlightHeadline article={article}/>
	);
}

// function SpotlightHeadline({$article}: { $article: Atom<ArticleDat> }) {
function SpotlightHeadline({article}: { article?: ArticleDat }) {
	const [spotlight] = useAtom($spotlight);
	const [config] = useAtom($config);
	
	const spotlightRef = useRef<HTMLDivElement>(null);
	const spotlightVideoRef = useRef<HTMLVideoElement>(null);
	const introRef = useRef<HTMLVideoElement>(null);
	const outroRef = useRef<HTMLVideoElement>(null);
	const carrierRef = useRef<HTMLDivElement>(null);
	
	const refs: T_SpotlightRefs = {
		spotlightRef: spotlightRef,
		spotlightVideoRef: spotlightVideoRef,
		introRef: introRef,
		outroRef: outroRef,
		carrierRef: carrierRef,
	};
	
	const orgIdf = article?.orgIdf || '';
	const org = config.GetOrg(orgIdf);
	
	
	useEffect(() => {
		if (!article) return;
		
		introRef.current?.play();
		
		setTimeout(() => {
			spotlightVideoRef.current?.classList.add('show');
			carrierRef.current?.classList.add('show');
		}, 1000);
		setTimeout(() => outroRef.current?.play(), 9000);
		setTimeout(() => {
			spotlightVideoRef.current?.classList.remove('show');
			carrierRef.current?.classList.remove('show');
		}, 9500);
		
	}, [spotlight]);
	
	const className = clsx(
		'spotlight-container',
		orgIdf,
	);
	
	return (
		<div
			ref={spotlightRef}
			className={className}
			id={'spotlight'}
		>
			<BackgroundVideo
				src={org.bgVideo}
				className={clsx('bg-spotlight')}
				ref={spotlightVideoRef}
			/>
			
			<Video
				src={org.introVideo}
				
				onPlay={() => introRef.current?.classList.add('show')}
				onEnded={() => {
					introRef.current?.classList.remove('show');
					spotlightVideoRef.current?.classList.add('show');
				}}
				className={'intro'}
				ref={introRef}
			/>
			
			<Video
				src={org.outroVideo}
				
				onPlay={() => outroRef.current?.classList.add('show')}
				onEnded={() => {
					outroRef.current?.classList.remove('show');
					spotlightVideoRef.current?.classList.remove('show');
				}}
				className={'outro'}
				ref={outroRef}
			/>
			{/*was carrier*/}
			<div
				className={clsx('spotlight-carrier')}
				ref={carrierRef}
			>
			{/*<div className={clsx('spotlight-carrier', isShowing && 'show')}>*/}
				<div className={'theme'}>{orgIdf}</div>
				<div className={'headline'}>{article?.headline}</div>
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
import {ArticleDat} from '../../../zap-shared/_Dats.ts';
import {Timer} from '../displays/Timer.tsx';
import {useAtom} from 'jotai';
import './ProjectorPage.css';
import React from 'react';
import {$splitArticles, $spotlight, $timer} from '../ClientState.ts';
import {Atom} from 'jotai/vanilla/atom';
import {clsx} from 'clsx';
import {Crawler} from './Crawler.tsx';

const SHOW_LAST_COUNT = 7;

export function ProjectorPage() {
	return (
		<div className={'projector-page'}>
			<video autoPlay muted loop id={'bgVideo'}>
				<source src={'../assets/videos/box-background.mp4'} type={'video/mp4'}/>
			</video>
			<Timer $timer={$timer}/>
			
			<Headlines/>
			
			<Crawler/>
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
		<div className={className}>
			{article.headline}
		</div>
	);
}
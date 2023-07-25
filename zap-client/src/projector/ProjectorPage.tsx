import {ArticleDat} from '../../../zap-shared/_Dats.ts';
import {Timer} from '../displays/Timer.tsx';
import {useAtom} from 'jotai';
import './ProjectorPage.css';
import React from 'react';
import {$splitArticles, $timer} from '../ClientState.ts';
import {Atom} from 'jotai/vanilla/atom';

export function ProjectorPage() {
	return (
		<div className={'articleContainer'}>
			<Timer $timer={$timer}/>
			
			<Headlines/>
		</div>
	);
}

function Headlines() {
	const [articles] = useAtom($splitArticles);
	
	return (
		<div className={'articles'}>
			{articles.map($article => (
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
	
	return (
		<div
			className={'article'}
			// style={{
			// 	backgroundColor: '#b74aff',
			// }}
		>
			<h2 className={'headline-name'}>
				{article.headline}
			</h2>
			{/*<h3>{Article.createdAt.toTimeString()}</h3>*/}
		
		</div>
	);
}
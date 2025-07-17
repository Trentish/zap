import {useClient} from '../ClientContext.ts';
import {Atom, useAtom} from 'jotai/index';
import {$config, $splitArticles} from '../ClientState.ts';
import React, {useState} from 'react';
import {Button} from '../components/ButtonComponents.tsx';
import {ArticleDat} from '../../zap-shared/_Dats.ts';
import './HistoryPage.css';
import './TopStories.css';


export function TopStories() {
	const client = useClient();
	const [articles] = useAtom($splitArticles);
	const [config] = useAtom($config);

	const articlesToShow = articles.slice(-config.topStoryCount).reverse();

	return (
		<div className={'topStories'}>

			<div className={'topStoryGrid'}>
				{articlesToShow.map($article => (
					<TopStoryHeadline
						key={`${$article}`}
						$article={$article}
					/>
				))}
			</div>

		</div>
	);
}

function TopStoryHeadline({$article}: {
	$article: Atom<ArticleDat>
}) {
	const [article] = useAtom($article);
	const [config] = useAtom($config);

	const org = config.GetOrg(article);

	let time = '';

	if (article.createdAt) {
		const date = new Date(article.createdAt);
		time = `${date.toLocaleTimeString(
			'en-US',
			{hour: 'numeric', minute: '2-digit', hour12: true},
		)}`;
	}

	return (
		<div className={'topStoryHeadline'}>✦︎ {article.headline}</div>
	);

	// return (
	// 	<>
	// 		{/*<div className={'topStoryTime'}>{time}</div>*/}
	// 		{/*<div className={'historyLabel'}>{org.label}:</div>*/}
	// 		<div className={'topStoryHeadline'}>{article.headline}</div>
	// 	</>
	// );
}
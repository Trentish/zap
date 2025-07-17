import {useClient} from '../ClientContext.ts';
import {Atom, useAtom} from 'jotai/index';
import {$config, $splitArticles, $spotlight} from '../ClientState.ts';
import React, {useState} from 'react';
import {Button} from '../components/ButtonComponents.tsx';
import {ArticleDat} from '../../zap-shared/_Dats.ts';
import './HistoryPage.css';

const DEFAULT_SHOW_COUNT = 10;

export function HistoryPage() {
	const client = useClient();
	const [articles] = useAtom($splitArticles);
	
	const [shouldShowAll, setShouldShowAll] = useState(false);
	
	const requestShowAll = () => {
		client.packets.AllArticles.Send('');
		setShouldShowAll(true);
	};
	
	const articlesToShow = shouldShowAll
		? articles.slice().reverse()
		: articles.slice(-DEFAULT_SHOW_COUNT).reverse();
	
	
	return (
		<div className={'historyPage control-group control-group-vertical'}>
			
			<div className={'historyGrid'}>
				{articlesToShow.map($article => (
					<HistoryHeadline
						key={`${$article}`}
						$article={$article}
					/>
				))}
			</div>
			
			{!shouldShowAll && (
				<Button
					label={'Show All'}
					onClick={requestShowAll}
				/>
			)}
		
		</div>
	);
}

function HistoryHeadline({$article}: {
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
		<>
			<div className={'historyTime'}>{time}</div>
			{/*<div className={'historyLabel'}>{org.label}:</div>*/}
			<div className={'historyHeadline'}>{article.headline}</div>
		</>
	);
}
import {useAtom} from 'jotai/index';
import {ArticleDat} from '../../../zap-shared/_Dats.ts';
import {Atom} from 'jotai';
import React, {useState} from 'react';
import {$splitArticles} from '../ClientState.ts';
import {Button} from '../components/ButtonComponents.tsx';
import {useClient} from '../ClientContext.ts';

const DEFAULT_SHOW_COUNT = 10;

export function ArticleSummary() {
	const client = useClient();
	const [articles] = useAtom($splitArticles);
	
	const [shouldShowAll, setShouldShowAll] = useState(false);
	
	const requestShowAll = () => {
		client.packets.RequestAllArticles.Send('');
		setShouldShowAll(true);
	};
	
	const articlesToShow = shouldShowAll
		? articles.slice().reverse()
		: articles.slice(-DEFAULT_SHOW_COUNT).reverse();
	
	console.log(`ArticleSummary: show ${shouldShowAll} ${articlesToShow.length}/${articles.length}`);
	
	return (
		<div className={'articleSummary'}>
			<h3>Articles:</h3>
			
			<div className={'grid'}>
				{articlesToShow.map($article => (
					<SummaryHeadline
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

function SummaryHeadline({$article}: { $article: Atom<ArticleDat> }) {
	const [article] = useAtom($article);
	
	return (
		<>
			<h2>({article.id}) {article.author}</h2>
			<h2>{article.orgIdf}</h2>
			<h2>{article.headline}</h2>
		</>
	);
}


// enum E_ShowOption {
// 	RECENT,
// 	MORE,
// 	ALL,
// }
//
// const $showOption = atom(0);
// const ShowOptions: T_RadioOption[] = [
// 	{label: 'Recent', data: 10},
// 	{label: 'More', data: 25},
// 	{label: 'All', data: -1},
// ];
// const [showOptionId] = useAtom($showOption);
// const showOption = ShowOptions[showOptionId];
// <p>option: {JSON.stringify(showOption)}</p>
//
// <Radios
// 	$value={$showOption}
// 	title={'Show'}
// 	options={ShowOptions}
// />
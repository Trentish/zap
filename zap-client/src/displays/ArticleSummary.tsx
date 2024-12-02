import {useAtom} from 'jotai/index';
import {ArticleDat} from '../../../zap-shared/_Dats.ts';
import {Atom} from 'jotai';
import React, {useState} from 'react';
import {$config, $splitArticles, $spotlight} from '../ClientState.ts';
import {Button} from '../components/ButtonComponents.tsx';
import {useClient} from '../ClientContext.ts';
import './ArticleSummary.css';

const DEFAULT_SHOW_COUNT = 10;

export function ArticleSummary({showAdmin}: { showAdmin?: boolean }) {
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
	
	console.log(`ArticleSummary: show ${shouldShowAll} ${articlesToShow.length}/${articles.length}`);
	
	return (
		<div className={'articleSummary control-group control-group-vertical'}>
			<h2>Articles:</h2>
			
			<div className={'articleSummaryGrid'}>
				{articlesToShow.map($article => (
					<SummaryHeadline
						key={`${$article}`}
						$article={$article}
						showAdmin={showAdmin}
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

function SummaryHeadline({$article, showAdmin}: {
	$article: Atom<ArticleDat>,
	showAdmin?: boolean
}) {
	const client = useClient();
	const [article] = useAtom($article);
	const [spotlight] = useAtom($spotlight);
	const [config] = useAtom($config);
	
	// const className = clsx(
	// 	'article',
	// 	{'spotlight': spotlight.spotlightId === article.id},
	// 	{'pending': article.id > spotlight.pendingAboveId},
	// );
	
	const icon = spotlight.spotlightId === article.id
		? ' 🔦'
		: article.id > spotlight.pendingAboveId
			? ' ⌛'
			: '';
	
	const org = config.GetOrg(article);
	
	return (
		<>
			<div>
				{showAdmin && (
					<Button
						className={'forceSpotlight'}
						label={'🔦'}
						onClick={() => client.packets.ForceSpotlight.Send({
							id: article.id,
						})}
					/>
				)}#{article.id}{icon}</div>
			<div>{org.label}</div>
			<div>{article.headline}</div>
			{showAdmin
				? (
					<div>{article.author}</div>
				) : (
					<div/>
				)}
		</>
	);
}

// function AdminForceSpotlight() {
// 	const client = useClient();
// 	const [spotlight] = useAtom($spotlight);
//
// 	const onSpotlight = () => {
// 		client.packets.ForceSpotlight.Send({
// 			id: id,
// 		});
// 	};
//
// 	return (
// 		<Button
// 			className={'tiny'}
// 			label={'Force Spotlight -5'}
// 			onClick={onSpotlight}
// 		/>
// 	);
// }

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
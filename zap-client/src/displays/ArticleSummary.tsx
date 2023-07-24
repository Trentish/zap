import {useAtom} from 'jotai/index';
import {$gameDat} from '../ZapClient.ts';
import {ArticleDat} from '../../../zap-shared/_Dats.ts';

export function ArticleSummary() {
	const [gameDat] = useAtom($gameDat);
	
	return (
		<div className={'articleSummary'}>
			{(
				gameDat.articles || []
			)
				.slice()
				.reverse()
				.map(article => (
					<SummaryHeadline
						key={article.guid}
						Article={article}
					/>
				))}
		
		</div>
	);
}

type P_HeadlineExample = {
	Article: ArticleDat,
	// Org: OrgDat,
};

function SummaryHeadline(props: P_HeadlineExample) {
	const {
		Article,
	} = props;
	
	return (
		<>
			<h2>{Article.author || 'author?'}</h2>
			<h2>{Article.orgIdf || 'org?'}</h2>
			<h2>{Article.headline}</h2>
		</>
	);
}
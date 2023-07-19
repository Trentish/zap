import {ArticleDat, OrgDat} from '../../../zap-shared/_Dats.ts';
import {Timer} from '../Timer.tsx';
import {useClient} from '../ClientContext.ts';
import {gameDatAtom, timerMsAtom} from '../ZapClient.ts';
import {useAtom} from 'jotai';
import './ProjectorPage.css';

const EXAMPLE_ARTICLE1: ArticleDat = {
	guid: 'jskldjflksdjf',
	headline: 'This is a headline test',
	createdAt: new Date(2023, 4, 5, 5, 55, 55),
	
	orgIdf: 'test_org',
	themeTags: ['themeTag1', 'themeTag2'],
};

const EXAMPLE_ORG1: OrgDat = {
	idf: 'test_org',
	proper_name: 'Test Org',
};

export function ProjectorPage() {
	const client = useClient();
	const [gameDat] = useAtom(gameDatAtom);
	
	return (
		<div className={'articleContainer'}>
			<Timer atom={timerMsAtom}/>
			
			<Headlines/>
		</div>
	);
}

function Headlines() {
	const [gameDat] = useAtom(gameDatAtom);
	
	return (
		<div className={'articles'}>
			{(gameDat.articles || []).map(article => (
				<Headline
					key={article.guid}
					Article={article}
				/>
			))}
		
		</div>
	)
}

type P_HeadlineExample = {
	Article: ArticleDat,
	// Org: OrgDat,
};

function Headline(props: P_HeadlineExample) {
	const {
		Article,
	} = props;
	
	
	return (
		<div className={'article'}
			// style={{
			// 	backgroundColor: '#b74aff',
			// }}
		>
			<h2 className={'headline-name'}>
				{Article.headline}
			</h2>
			{/*<h3>{Article.createdAt.toTimeString()}</h3>*/}
		
		</div>
	);
}
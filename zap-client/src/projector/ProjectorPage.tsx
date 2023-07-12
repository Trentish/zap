import {ArticleDat, OrgDat} from '../../../zap-shared/ArticleTypes.ts';

const EXAMPLE_ARTICLE1: ArticleDat = {
	guid: 0,
	headline: 'This is a headline test',
	created_at: new Date(2023, 4, 5, 5, 55, 55),
	
	org_idf: 'test_org',
	theme_tags: ['themeTag1', 'themeTag2'],
};

const EXAMPLE_ORG1: OrgDat = {
	idf: 'test_org',
	proper_name: 'Test Org',
};

export function ProjectorPage() {
	return (
		<div>
			<HeadlineExample
				Article={EXAMPLE_ARTICLE1}
				Org={EXAMPLE_ORG1}
			/>
		</div>
	);
}

type P_HeadlineExample = {
	Article: ArticleDat,
	Org: OrgDat,
};

function HeadlineExample(props: P_HeadlineExample) {
	const {
		Article,
	} = props;
	
	
	return (
		<div
			style={{
				backgroundColor: '#b74aff',
			}}
		>
			<h2 className={'headline-name'}>
				{Article.headline}
			</h2>
			<h3>{Article.created_at.toTimeString()}</h3>
		
		</div>
	);
}
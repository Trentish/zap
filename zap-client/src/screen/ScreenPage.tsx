import {T_Article, T_Org} from '../../../zap-types/ArticleTypes.ts';

const EXAMPLE_ARTICLE1: T_Article = {
	guid: 0,
	headline: 'This is a headline test',
	createdAt: new Date(2023, 4, 5, 5, 55, 55),
	
	orgIdf: 'test_org',
	themeTags: ['themeTag1', 'themeTag2'],
};

const EXAMPLE_ORG1: T_Org = {
	idf: 'test_org',
	properName: 'Test Org',
};

export function ScreenPage() {
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
	Article: T_Article,
	Org: T_Org,
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
		
		</div>
	);
}
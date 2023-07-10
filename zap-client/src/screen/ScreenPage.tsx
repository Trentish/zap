import {E_ArticleType, T_Article, T_Org} from '../data/ArticleTypes.ts';

const EXAMPLE_ARTICLE1: T_Article = {
	Guid: 0,
	Headline: 'This is a headline',
	Type: E_ArticleType.Oath,
};

const EXAMPLE_ORG1: T_Org = {
	Idf: 'test_org',
	ProperName: 'Test Org',
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
				{Article.Headline}
			</h2>
		
		</div>
	);
}
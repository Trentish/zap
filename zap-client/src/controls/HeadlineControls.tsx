import {useClient} from '../ClientContext.ts';
import {Input} from '../components/InputComponents.tsx';
import React from 'react';
import {atom} from 'jotai';
import {Button} from '../components/ButtonComponents.tsx';
import {$author, $store} from '../ClientState.ts';
import {HEADLINE_MAX_SIZE, HEADLINE_MIN_SIZE} from '../../../zap-shared/_Dats.ts';

const $headline = atom('');
const $org = atom('orgTODO'); // TODO: actual org support

const $canSubmit = atom((get) => {
	const headline = get($headline);
	if (!headline || headline.length <= HEADLINE_MIN_SIZE) return false; //>> below min size
	
	const author = get($author);
	if (!author || author.length <= 0) return false; //>> missing author
	
	const org = get($org);
	if (!org || org.length <= 0) return false; //>> missing org
	
	return true;
});

export function HeadlineControls() {
	const client = useClient();
	
	const postArticle = () => {
		const headline = $store.get($headline);
		const author = $store.get($author);
		const org = $store.get($org);
		
		client.packets.PostArticle.Send({
			// headline: `Testy test ${Math.floor(Math.random() * 99999)}`,
			headline: headline,
			author: author,
			orgIdf: org, // TODO
		});
		
		$store.set($headline, '');
	};
	
	const checkKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.key === 'Enter' && evt.ctrlKey) {
			postArticle();
		}
	};
	
	return (
		<div className={'headlineControls'}>
			<Input
				label={'Headline'}
				$value={$headline}
				description={`don't post stupid shit (TODO)`}
				placeholder={`X adjectively verbed Y!`}
				maxLength={HEADLINE_MAX_SIZE}
				inputProps={{onKeyDown: checkKeyDown}}
				textArea
			/>
			<Input
				label={'Author'}
				$value={$author}
				placeholder={'Jed McJedfry'}
			/>
			<Input
				label={'Org TODO'}
				$value={$org}
				description={`(TODO) for now, will apply this string as headline css className`}
			/>
			
			<Button
				label={'Post'}
				onClick={postArticle}
				enabledIf={$canSubmit}
			/>
			
			
			<br/><br/><br/><br/>
			<p>TODO: org stuff?</p>
		</div>
	);
}
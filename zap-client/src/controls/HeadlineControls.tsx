import {useClient} from '../ClientContext.ts';
import {$author, $store} from '../ZapClient.ts';
import {Input} from '../components/InputComponents.tsx';
import React from 'react';
import {atom} from 'jotai';
import {Button} from '../components/ButtonComponents.tsx';

const $headline = atom('');
const $org = atom('orgTODO'); // TODO: actual org support

const $canSubmit = atom((get) => {
	const headline = get($headline);
	if (!headline || headline.length <= 0) return false; //>> missing headline
	
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
		
		client.clientPrefs.author = author;
		client.SaveClientPrefs();
		$store.set($headline, '');
	};
	
	return (
		<div className={'headlineControls'}>
			<Input
				label={'Headline'}
				valueAtom={$headline}
				description={`don't post stupid shit (TODO)`}
				placeholder={`X adjectively verbed Y!`}
			/>
			<Input
				label={'Author'}
				valueAtom={$author}
				placeholder={'Jed McJedfry'}
			/>
			<Input
				label={'Org something'}
				valueAtom={$org}
				description={`TODO: actual org support`}
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
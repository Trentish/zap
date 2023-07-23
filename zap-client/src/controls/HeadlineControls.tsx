import {useClient} from '../ClientContext.ts';
import {$store} from '../ZapClient.ts';
import {Input} from '../components/InputComponents.tsx';
import React from 'react';
import {atom} from 'jotai';
import {Button} from '../components/ButtonComponents.tsx';

const $headline = atom('');

const $canSubmit = atom((get) => {
	const text = get($headline);
	return !!text && text.length > 0;
});

export function HeadlineControls() {
	const client = useClient();
	
	const postArticle = () => {
		const headline = $store.get($headline);
		
		client.packets.PostArticle.Send({
			// headline: `Testy test ${Math.floor(Math.random() * 99999)}`,
			headline: headline,
			orgIdf: 'TODO', // TODO
		});
	};
	
	return (
		<div
			style={{
				margin: 24,
			}}
		>
			<Input
				label={'Headline'}
				valueAtom={$headline}
				class={'input-headline'}
				description={`don't post stupid shit (TODO)`}
			/>
			
			<Button
				label={'Post'}
				onClick={postArticle}
				enabledIf={$canSubmit}
			/>
			
			
			<br/><br/><br/><br/>
			<p>TODO: org stuff</p>
		</div>
	);
}
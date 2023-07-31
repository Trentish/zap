import {PrimitiveAtom} from 'jotai/vanilla/atom';
import {useClient} from '../ClientContext.ts';
import {Input} from '../components/InputComponents.tsx';
import React from 'react';
import {atom, useAtom} from 'jotai';
import {Button, Radios, T_RadioOption} from '../components/ButtonComponents.tsx';
import {$author, $config, $store, $uuid} from '../ClientState.ts';
import {HEADLINE_MAX_SIZE, HEADLINE_MIN_SIZE} from '../../../zap-shared/_Dats.ts';
import './HeadlineControls.css';
import {T_Org} from '../configs/BaseGameConfig.ts';

const USE_UUID_INSTEAD_OF_AUTHOR = true;

const $headline = atom('');
const $org = atom('');

const $canSubmit = atom((get) => {
	const headline = get($headline);
	if (!headline || headline.length <= HEADLINE_MIN_SIZE) return false; //>> below min size
	
	const author = USE_UUID_INSTEAD_OF_AUTHOR ? get($uuid) : get($author);
	if (!author || author.length <= 0) return false; //>> missing author
	
	const org = get($org);
	if (!org || org.length <= 0) return false; //>> missing org
	
	return true;
});

export function HeadlineControls() {
	const client = useClient();
	
	const postArticle = () => {
		const headline = $store.get($headline).trim();
		const author = USE_UUID_INSTEAD_OF_AUTHOR ? $store.get($uuid) : $store.get($author);
		const org = $store.get($org);
		
		client.packets.PostArticle.Send({
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
				description={`don't post stupid shit (TODO, maybe have examples)`}
				placeholder={``}
				// placeholder={`X adjectively verbed Y!`}
				maxLength={HEADLINE_MAX_SIZE}
				inputProps={{onKeyDown: checkKeyDown}}
				textArea
			/>
			{!USE_UUID_INSTEAD_OF_AUTHOR && (
				<Input
					label={'Author'}
					$value={$author}
					placeholder={'Jed McJedfry'}
				/>
			)}
			<ThemeControls $org={$org}/>
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

const OnlyIncludeOrgIf = (opt: T_RadioOption | undefined) => (
	opt as T_Org
).showAsRadio;

export function ThemeControls({$org}: { $org: PrimitiveAtom<string> }) {
	const [config] = useAtom($config);
	
	if (!config?.orgs.length) return <div/>;
	
	return (
		<Radios
			$value={$org}
			title={'Type'}
			options={config.orgs}
			filterOption={OnlyIncludeOrgIf}
		/>
	);
}
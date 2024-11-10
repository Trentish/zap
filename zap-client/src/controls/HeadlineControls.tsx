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
const $location = atom('');

const $canSubmit = atom((get) => {
	const config = get($config);

	const headline = get($headline);
	if (!headline || headline.length <= HEADLINE_MIN_SIZE) return false; //>> below min size
	
	const author = USE_UUID_INSTEAD_OF_AUTHOR ? get($uuid) : get($author);
	if (!author || author.length <= 0) return false; //>> missing author
	
	const org = get($org);
	if (!org || org.length <= 0) return false; //>> missing org

	// if (config.showLocationField) {
	// 	const location = get($location);
	// 	if (!location || location.length <= 0) return false; //>> missing location
	// }
	
	return true;
});

export function HeadlineControls() {
	const client = useClient();
	const config = $store.get($config);
	
	const postArticle = () => {
		const headline = $store.get($headline).trim();
		if (headline.length == 0) return; //>> no text

		const author = USE_UUID_INSTEAD_OF_AUTHOR ? $store.get($uuid) : $store.get($author);
		const org = $store.get($org);

		if (org.length == 0) return; //>> no org

		const location = $store.get($location);

		client.packets.PostArticle.Send({
			headline: headline,
			author: author,
			orgIdf: org, // TODO
			location: location,
		});
		
		$store.set($headline, '');
		$store.set($location, '');
	};
	
	const checkKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.key === 'Enter' && evt.ctrlKey) {
			postArticle();
		}
	};
	
	return (
		<div className={'headlineControls'}>
			<Input
				id={'inpHeadline'}
				label={''}
				$value={$headline}
				// description={`don't post stupid shit (TODO, maybe have examples)`}
				// description={'jksldjf'}
				placeholder={`Headline`}
				// placeholder={`X adjectively verbed Y!`}
				maxLength={HEADLINE_MAX_SIZE}
				showCharCount
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
			{config.showLocationField && (
				<Input
					label={'Location'}
					$value={$location}
					description={`AP Style e.g. TOKYO; WASHINGTON; HIGUERAS; TEGUCIGALPA; ST. PAUL, Minn.; etc. `}
				/>
			)}
			<div id={'container_btnPost'}>
				<Button
					id={'btnPost'}
					label={'Post'}
					onClick={postArticle}
					enabledIf={$canSubmit}
				/>
				<p id={'desc_btnPost'}>CTRL+ENTER</p>
			</div>

			{/*<br/><br/><br/><br/>*/}
			{/*<p>TODO: org stuff?</p>*/}
		</div>
	);
}

const OnlyIncludeOrgIf = (opt: T_RadioOption | undefined) => (
	opt as T_Org
).showAsRadio;

export function ThemeControls({$org}: { $org: PrimitiveAtom<string> }) {
	const [config] = useAtom($config);
	if (!config) return <div/>;
	
	const orgs = config.GetAllOrgs();
	if (!orgs?.length) return <div/>;
	
	return (
		<Radios
			id={'radiosTheme'}
			$value={$org}
			title={'Type'}
			options={orgs}
			filterOption={OnlyIncludeOrgIf}
		/>
	);
}
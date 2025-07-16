import React from 'react';
import {Timer} from '../displays/Timer.tsx';
import {HeadlineControls} from '../controls/HeadlineControls.tsx';
import {ArticleSummary} from '../displays/ArticleSummary.tsx';
import {$timer, $uuid, $config} from '../ClientState.ts';
import {useClient} from '../ClientContext.ts';
import {useAtom} from 'jotai';

export function PlayerPage() {
	const client = useClient();
	const [uuid] = useAtom($uuid);	
	const [config] = useAtom($config);
	
	return (
		<div className={`playerPage control-page ${client.gameIdf}`}>
			<h1 style={{
				margin: 0,
			}}>
				<span style={{
					margin: '0 1em 0 0'
				}}>{config.gameDisplayName ?? client.gameIdf}</span>
				<span style={{color: '#d0d0d0'}}>({uuid})</span>
			</h1>
			
			<HeadlineControls/>
			
			<Timer $timer={$timer}/>
			
			<ArticleSummary/>
		</div>
	);
}
import React from 'react';
import {Timer} from '../displays/Timer.tsx';
import {HeadlineControls} from '../controls/HeadlineControls.tsx';
import {ArticleSummary} from '../displays/ArticleSummary.tsx';
import {$timer, $uuid} from '../ClientState.ts';
import {useClient} from '../ClientContext.ts';
import {useAtom} from 'jotai';
import {$gameIdf} from '../ClientState.ts';


export function PlayerPage() {
	const client = useClient();
	const [gameIdf] = useAtom($gameIdf);
	const [uuid] = useAtom($uuid);
	
	
	return (
		<div className={`playerPage control-page ${client.gameIdf}`}>
			<h1>
				<span style={{color: 'blue'}}>{gameIdf}</span>
				player TODO
				<span style={{color: '#d0d0d0'}}>({uuid})</span>
			</h1>
			
			<HeadlineControls/>
			
			<Timer $timer={$timer}/>
			
			<ArticleSummary/>
		</div>
	);
}
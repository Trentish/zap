import React from 'react';
import {Timer} from '../displays/Timer.tsx';
import {HeadlineControls} from '../controls/HeadlineControls.tsx';
import {ArticleSummary} from '../displays/ArticleSummary.tsx';
import {$timer} from '../ClientState.ts';
import {useClient} from '../ClientContext.ts';

export function PlayerPage() {
	const client = useClient();
	
	return (
		<div className={`playerPage control-page ${client.gameIdf}`}>
			<h1>player TODO</h1>
			
			<HeadlineControls/>
			
			<Timer $timer={$timer}/>
			
			<ArticleSummary/>
		</div>
	);
}
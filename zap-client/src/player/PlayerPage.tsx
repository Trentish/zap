import React from 'react';
import {Timer} from '../displays/Timer.tsx';
import {HeadlineControls} from '../controls/HeadlineControls.tsx';
import {ArticleSummary} from '../displays/ArticleSummary.tsx';
import {$timer} from '../ClientState.ts';

export function PlayerPage() {
	return (
		<div className={'playerPage control-page'}>
			<h1>player TODO</h1>
			
			<HeadlineControls/>
			
			<Timer $timer={$timer}/>
			
			<ArticleSummary/>
		</div>
	);
}
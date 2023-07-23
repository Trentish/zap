import React from 'react';
import {Timer} from '../displays/Timer.tsx';
import {$timerMs} from '../ZapClient.ts';
import {HeadlineControls} from '../controls/HeadlineControls.tsx';

export function PlayerPage() {
	return (
		<div>
			<h1>player TODO</h1>
			
			<HeadlineControls/>
			
			<Timer atom={$timerMs}/>
		</div>
	);
}
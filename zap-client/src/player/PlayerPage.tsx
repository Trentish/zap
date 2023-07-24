import React from 'react';
import {Timer} from '../displays/Timer.tsx';
import {$timerLabel, $timerMs} from '../ZapClient.ts';
import {HeadlineControls} from '../controls/HeadlineControls.tsx';
import {ArticleSummary} from '../displays/ArticleSummary.tsx';

export function PlayerPage() {
	return (
		<div>
			<h1>player TODO</h1>
			
			<HeadlineControls/>
			
			<Timer
				$label={$timerLabel}
				$ms={$timerMs}
			/>
			
			<ArticleSummary/>
		</div>
	);
}
import {useClient} from '../ClientContext.ts';
import React from 'react';
import {atom} from 'jotai';
import {Timer} from '../displays/Timer.tsx';
import {$store, $timerMs} from '../ZapClient.ts';
import {NumberInput} from '../components/InputComponents.tsx';
import {Button} from '../components/ButtonComponents.tsx';


const $minutes = atom(5);
const $seconds = atom(0);

export function AdminPage() {
	const client = useClient();
	
	
	return (
		<div>
			<h1>Administrator ONLY!</h1>
			
			<TimerControls/>
			
			<Button
				label={'Do Load Test'}
				onClick={() => client.packets.DbTestLoad.Send('')}
			/>
			<br/>
			<br/>
			<Button
				label={'Do Save Test'}
				onClick={() => client.packets.DbTestSave.Send('')}
			/>
			<br/>
			<br/>
			<Button
				label={'Clear All Articles'}
				onClick={() => client.packets.ClearAllArticles.Send('')}
			/>
		
		</div>
	);
}

const toMilliseconds = (minutes: number, seconds: number) => (
	(
		minutes * 60
	) + seconds
) * 1000;

function TimerControls() {
	const client = useClient();
	
	const submit = () => {
		const minutes = $store.get($minutes);
		const seconds = $store.get($seconds);
		
		const ms = toMilliseconds(minutes, seconds);
		client.packets.SetTimer.Send({ms: ms});
		console.log(`minutesStr: ${minutes}, secondsStr: ${seconds}, ms: ${ms}`);
	};
	
	return (
		<div
			style={{
				margin: 24,
			}}
		>
			<Timer atom={$timerMs}/>
			
			<NumberInput
				label={'Minutes'}
				valueAtom={$minutes}
			/>
			
			<NumberInput
				label={'Seconds'}
				valueAtom={$seconds}
			/>
			
			<button onClick={submit}>Set Timer</button>
		</div>
	);
}
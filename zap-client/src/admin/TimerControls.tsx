import {useClient} from '../ClientContext.ts';
import {Timer} from '../displays/Timer.tsx';
import {Input, NumberInput} from '../components/InputComponents.tsx';
import React from 'react';
import {atom} from 'jotai';
import {Button} from '../components/ButtonComponents.tsx';
import {$store, $timer} from '../ClientState.ts';
import './TimerControls.css';

const $label = atom('');
const $minutes = atom(5);
const $seconds = atom(0);

export function TimerControls() {
	const client = useClient();
	
	const sendTimer = () => {
		const label = $store.get($label);
		const minutes = $store.get($minutes);
		const seconds = $store.get($seconds);
		
		const ms = toMilliseconds(minutes, seconds);
		client.packets.SetTimer.Send({
			label: label,
			ms: ms,
		});
	};
	
	const sendLabelOnly = () => {
		const label = $store.get($label);
		client.packets.SetTimer.Send({
			label: label,
			ms: -1,
		});
	};
	
	// const className = clsx(
	// 	'blah',
	// 	'blah2',
	// 	true ? 'blahtrue' : 'blahfalse',
	// 	true && 'blahajslkd',
	// 	{'class-asdfasdf': true},
	// );
	
	return (
		<div className={'control-group control-group-vertical timerControls'}>
			<Timer
				$timer={$timer}
			/>
			
			<div className={'control-group timerLabelControls'}>
				<Input
					label={'Timer Label'}
					$value={$label}
				/>
				
				<Button
					label={'Set Label Only'}
					onClick={sendLabelOnly}
				/>
			
			</div>
			
			
			<div className={'control-group numberLabelControls'}>
				<NumberInput
					label={'Minutes'}
					$value={$minutes}
				/>
				
				<div style={{width: 16}}/>
				
				<NumberInput
					label={'Seconds'}
					$value={$seconds}
				/>
				
				<Button
					label={'New Timer'}
					onClick={sendTimer}
				/>
			</div>
		</div>
	);
}

const toMilliseconds = (minutes: number, seconds: number) => (
	(
		minutes * 60
	) + seconds
) * 1000;

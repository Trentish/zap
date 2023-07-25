import {useClient} from '../ClientContext.ts';
import {Timer} from '../displays/Timer.tsx';
import {Input, NumberInput} from '../components/InputComponents.tsx';
import React from 'react';
import {atom} from 'jotai';
import {Button} from '../components/ButtonComponents.tsx';
import {$store, $timer} from '../ClientState.ts';

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
	
	return (
		<div
			style={{
				margin: 24,
			}}
		>
			<Timer
				$timer={$timer}
			/>
			
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<Input
					label={'Timer Label'}
					$value={$label}
				/>
				
				<div style={{width: 16}}/>
				
				<Button
					label={'Set Label Only'}
					onClick={sendLabelOnly}
					buttonStyle={{height: 32, backgroundColor: '#fff'}}
				/>
			
			</div>
			
			
			<div
				style={{
					display: 'flex',
				}}
			>
				<NumberInput
					label={'Minutes'}
					$value={$minutes}
				/>
				
				<div style={{width: 16}}/>
				
				<NumberInput
					label={'Seconds'}
					$value={$seconds}
				/>
			</div>
			
			<Button
				label={'New Timer'}
				onClick={sendTimer}
			/>
		</div>
	);
}

const toMilliseconds = (minutes: number, seconds: number) => (
	(
		minutes * 60
	) + seconds
) * 1000;

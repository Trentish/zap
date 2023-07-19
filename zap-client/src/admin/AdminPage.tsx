import {useClient} from '../ClientContext.ts';
import React from 'react';
import {atom, useAtom} from 'jotai';


const inputMinutes = atom('5');
const inputSeconds = atom('0');

export function AdminPage() {
	const client = useClient();
	
	
	return (
		<div>
			<h3>admin TODO</h3>
			
			
			<button onClick={() => client.packets.DbTestLoad.Send('')}>Do Load Test</button>
			<br/>
			<button onClick={() => client.packets.DbTestSave.Send('')}>Do Save Test</button>
			<br/>
			<button onClick={() => client.packets.ClearAllArticles.Send('')}>Clear All Articles</button>
		
		</div>
	);
}

function TimerControls() {
	const client = useClient();
	
	const [minutes, setMinutes] = useAtom(inputMinutes);
	const [seconds, setSeconds] = useAtom(inputSeconds);
	
	const submit = () => {
		const ms = (parseInt(minutes) * 60) + parseInt(seconds) * 1000;
		client.packets.SetTimer.Send({ms: ms});
	}
	
	return (
		<div>
			
			<label>
				Minutes
				<input
					value={minutes}
					onChange={(evt) => setMinutes(evt.target.value)}
					type={'number'}
				/>
			</label>
			
			<label>
				Seconds
				<input
					value={seconds}
					onChange={(evt) => setSeconds(evt.target.value)}
					type={'number'}
				/>
			</label>
			
			<button onClick={submit}>Set Timer</button>
		</div>
	)
}
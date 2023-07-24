import {useClient} from '../ClientContext.ts';
import React from 'react';
import {Button} from '../components/ButtonComponents.tsx';
import {TimerControls} from './TimerControls.tsx';


export function AdminPage() {
	const client = useClient();
	
	return (
		<div>
			<h1>Administrator ONLY!</h1>
			
			<TimerControls/>
			
			<br/>
			<br/>
			<br/>
			<br/>
			<br/>
			<br/>
			<br/>
			<br/>
			<br/>
			<br/>
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

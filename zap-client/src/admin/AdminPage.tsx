import {useClient} from '../ClientContext.ts';
import React from 'react';
import {Button} from '../components/ButtonComponents.tsx';
import {TimerControls} from './TimerControls.tsx';
import {ArticleSummary} from '../displays/ArticleSummary.tsx';


export function AdminPage() {
	const client = useClient();
	
	return (
		<div className={'adminPage'}>
			<h1>Administrator ONLY!</h1>
			
			<TimerControls/>
			
			<br/>
			<br/>
			<ArticleSummary/>
			
			
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
			<div>
				<Button
					label={'FORCE Load'}
					onClick={() => client.packets.DbForceLoad.Send('')}
				/>
				<Button
					label={'FORCE Save'}
					onClick={() => client.packets.DbForceSave.Send('')}
				/>
				<Button
					label={'FORCE Backup'}
					onClick={() => client.packets.DbForceBackup.Send('')}
				/>
				<Button
					className={'dangerButton'}
					label={'Reset Game (backs up first)'}
					onClick={() => client.packets.ResetGame.Send('')}
				/>
			</div>
		
		</div>
	);
}

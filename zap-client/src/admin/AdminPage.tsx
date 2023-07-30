import {useClient} from '../ClientContext.ts';
import React from 'react';
import {Button} from '../components/ButtonComponents.tsx';
import {TimerControls} from './TimerControls.tsx';
import {ArticleSummary} from '../displays/ArticleSummary.tsx';
import './AdminPage.css';
import {useAtom} from 'jotai';
import {$gameIdf} from '../ClientState.ts';


export function AdminPage() {
	const client = useClient();
	const [gameIdf] = useAtom($gameIdf);
	
	return (
		<div className={`control-page adminPage ${client.gameIdf}`}>
			<h1><span style={{color: 'blue'}}>{gameIdf}</span> Administrator ONLY!</h1>
			
			<TimerControls/>
			
			<div className={'control-group button-group'}>
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
			
			<ArticleSummary
                showAdmin
            />
		
		</div>
	);
}

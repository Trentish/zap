import {useClient} from '../ClientContext.ts';
import React from 'react';
import {Button} from '../components/ButtonComponents.tsx';
import {TimerControls} from './TimerControls.tsx';
import {ArticleSummary} from '../displays/ArticleSummary.tsx';
import './AdminPage.css';
import {useAtom} from 'jotai';
import {$gameIdf, $uuid} from '../ClientState.ts';
import {SituationControls} from "./SituationControls.tsx";
import {StatControls} from './StatControls.tsx';

export function AdminPage() {
	const client = useClient();
	const [gameIdf] = useAtom($gameIdf);
	const [uuid] = useAtom($uuid);
	
	return (
		<div className={`control-page adminPage ${client.gameIdf}`}>
			<h1>
				<span style={{color: 'blue'}}>{gameIdf}</span>
				Administrator ONLY!
				<span style={{color: '#9f9f9f'}}>({uuid})</span>
			</h1>
			
			<TimerControls/>

			<SituationControls/>
			
			<StatControls/>
			
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
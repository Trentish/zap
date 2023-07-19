import {HeadlineInput} from '../Fields.tsx';
import React from 'react';
import {useClient} from '../ClientContext.ts';
import {Timer} from '../Timer.tsx';
import {timerMsAtom} from '../ZapClient.ts';

export function PlayerPage() {
	const client = useClient();
	
	const postArticle = () => {
		// TODO
		client.packets.PostArticle.Send({
			headline: `Testy test ${Math.floor(Math.random() * 99999)}`,
		});
	};
	
	return (
		<>
			<div>player TODO</div>
			
			<HeadlineInput/>
			
			<button onClick={postArticle}>Post Article Test</button>
			
			<Timer atom={timerMsAtom}/>
		</>
	);
}
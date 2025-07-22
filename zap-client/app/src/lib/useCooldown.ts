import {useEffect, useState} from 'react';


export function useCooldown(timeMs: number): [isReady: boolean, startCooldown: () => void] {
	const [isReady, setIsReady] = useState(true);
	const startCooldown = () => setIsReady(false);
	
	useEffect(() => {
		let timerId = 0;
		if (!isReady) {
			timerId = window.setTimeout(() => setIsReady(true), timeMs);
		}
		return () => window.clearTimeout(timerId);
	}, [isReady, timeMs]);
	
	return [isReady, startCooldown];
}
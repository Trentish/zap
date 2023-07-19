import {PrimitiveAtom} from 'jotai/vanilla/atom';
import {useAtom} from 'jotai';

// TODO: real timer
export function Timer({atom}: { atom: PrimitiveAtom<number> }) {
	const [timer] = useAtom(atom);
	
	const fullSeconds = Math.floor(timer / 1000);
	const minutes = Math.floor(fullSeconds / 60);
	const seconds = fullSeconds % 60;
	
	const minutesText = minutes < 10 ? `0${minutes}` : `${minutes}`;
	const secondsText = seconds < 10 ? `0${seconds}` : `${seconds}`;
	
	return (
		<p className={'timer'}>{minutesText}:{secondsText}</p>
	);
}
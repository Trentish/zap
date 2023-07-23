import {PrimitiveAtom} from 'jotai/vanilla/atom';
import {useAtom} from 'jotai';
import {clsx} from 'clsx';

/* atom is number (milliseconds) */
export function Timer({atom}: { atom: PrimitiveAtom<number> }) {
	const [timer] = useAtom(atom);
	
	const fullSeconds = Math.floor(timer / 1000);
	const minutes = Math.floor(fullSeconds / 60);
	const seconds = fullSeconds % 60;
	
	const minutesText = minutes < 10 ? `0${minutes}` : `${minutes}`;
	const secondsText = seconds < 10 ? `0${seconds}` : `${seconds}`;
	
	const classNames = clsx(
		'timer', {
			'timer-complete': timer <= 0,
		});
	
	return (
		<p
			className={classNames}
		>{minutesText}:{secondsText}</p>
	);
}
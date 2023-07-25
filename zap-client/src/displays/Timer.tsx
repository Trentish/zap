import {PrimitiveAtom} from 'jotai/vanilla/atom';
import {useAtom} from 'jotai';
import {clsx} from 'clsx';
import {TimerDat} from '../../../zap-shared/_Dats.ts';

export function Timer({$timer}: {
	$timer: PrimitiveAtom<TimerDat>,
}) {
	const [timer] = useAtom($timer);
	
	const label = timer.label;
	const ms = timer.ms;
	
	const fullSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(fullSeconds / 60);
	const seconds = fullSeconds % 60;
	
	const minutesText = minutes < 10 ? `0${minutes}` : `${minutes}`;
	const secondsText = seconds < 10 ? `0${seconds}` : `${seconds}`;
	
	const classNames = clsx(
		'timer', {
			'timer-complete': ms <= 0,
		});
	
	// TODO: better label
	
	return (
		<p
			className={classNames}
		>{minutesText}:{secondsText} {label}</p>
	);
}
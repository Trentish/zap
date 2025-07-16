import {PrimitiveAtom} from 'jotai/vanilla/atom';
import {useAtom} from 'jotai';
import {clsx} from 'clsx';
import {TimerDat} from '../../../zap-shared/_Dats.ts';
import {$config} from "../ClientState.ts";
import {toMinutesSeconds} from "../lib/TimeUtils.ts";


export function Timer({$timer}: {
	$timer: PrimitiveAtom<TimerDat>,
}) {
	const [timer] = useAtom($timer);
	const [config] = useAtom($config);
	
	const label = timer.label;
	const ms = timer.ms > 0 ? timer.ms : 0;

	const [minutes, seconds] = toMinutesSeconds(ms);

	let minutesText = `${minutes}`;

	if (config.showTimerLeadingZero && minutes < 10) {
		minutesText = `0${minutes}`;
	}

	const secondsText = seconds < 10 ? `0${seconds}` : `${seconds}`;
	
	const classNames = clsx(
		'timer', {
			'timer-complete': ms <= 0,
		});
	
	// TODO: better label
	
	return (
		<div className={classNames}>
			<span className="time">
				{minutesText}:{secondsText}
			</span>
			<span className="timer-label">
				&nbsp;{label}
			</span>
		</div>
	);
}
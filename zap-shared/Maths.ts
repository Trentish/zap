
/** (5, [0, 10], [0, 100]) => 50 */
export function RangeToRange(
	value: number,
	from: [number, number],
	to: [number, number],
	clamp: boolean = true,
): number {
	const [fromMin, fromMax] = from;
	const [toMin, toMax] = to;
	let percent = (value - fromMin) / (fromMax - fromMin);
	
	if (clamp) {
		if (percent < 0) percent = 0;
		else if (percent > 1) percent = 1;
	}
	
	return (toMax - toMin) * percent + toMin;
}
import {useClient} from '../ClientContext.ts';
import {$allStats, $config} from '../ClientState.ts';
import {atom, useAtom} from 'jotai';
import {T_StatDef} from '../configs/BaseGameConfig.ts';
import {T_Input} from '../components/InputComponents.tsx';
import './StatControls.css';
import React from "react";

export function StatControls() {
	const client = useClient();
	const [config] = useAtom($config);

	const setStat = (index: number, value: string) => {
		client.packets.SetStat.Send({
			index: index,
			value: value,
		});
	};

	return (
		<div className={'statControls'}>
			{config.statDefs.map((def, index) => (
				<Stat
					key={`stat${index}`}
					index={index}
					def={def}
					setStat={setStat}
				/>
			))}
		</div>
	);
}

function Stat({index, def, setStat}: {
	index: number,
	def: T_StatDef,
	setStat: (index: number, value: string) => void
}) {
	const [allStats, setAllStats] = useAtom($allStats);
	const [stepperValue, setStepperValue] = React.useState('');

	const STEPPER_MIN = 0;
	const STEPPER_MAX = 300;

	const isCorp = def.className && def.className.includes('corp');

	// Only allow numbers and commas in corp stat input
	const filterCorpInput = (input: string) => input.replace(/[^0-9,]/g, '');

	const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		let newValue = evt.target.value;
		if (isCorp) {
			newValue = filterCorpInput(newValue);
		}
		const array = [...allStats.values];
		array[index] = newValue;
		setAllStats({values: array});
		setStat(index, newValue);
	};

	const value = allStats.values[index];

	// Helper to add a new number to the CSV string
	const addStepperValue = () => {
		if (stepperValue.trim() === '') return;
		const num = stepperValue.trim();
		// Only allow valid numbers
		if (isNaN(Number(num))) return;
		let arr: string[] = [];
		if (value && value.trim().length > 0) {
			arr = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
		}
		arr.push(num);
		if (arr.length > 10) arr = arr.slice(arr.length - 10);
		const newCsv = arr.join(',');
		const array = [...allStats.values];
		array[index] = newCsv;
		setAllStats({values: array});
		setStat(index, newCsv);
		setStepperValue('');
	};

	const onStepperKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.key === 'Enter') {
			addStepperValue();
		}
	};

	return (
		<div className={'statValueControl adminStatRow'}>
			<label className={'statInputLabel adminStatLabel'}>
				<div className="adminStatLabelText">{def.label}</div>
				<input
					value={value}
					onChange={onChange}
					className={'statInput adminStatInput'}
					{...(isCorp ? { pattern: '[0-9,]*', inputMode: 'numeric' } : {})}
				/>
			</label>
			{isCorp && (
				<div className="adminStatStepper">
					<input
						type="number"
						min={STEPPER_MIN}
						max={STEPPER_MAX}
						value={stepperValue}
						onChange={e => setStepperValue(e.target.value)}
						onKeyDown={onStepperKeyDown}
						className="adminStatStepperInput"
					/>
					<button type="button" onClick={addStepperValue} className="adminStatAddBtn">Add</button>
				</div>
			)}
		</div>
	);
}


export function StatInput<TVal>(props: T_Input<TVal>) {
	const [value, setValue] = useAtom(props.$value);

	const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		// console.log(`onChange: ${evt.target.value}`);
		const newValue = props.stringToValue
			? props.stringToValue(evt.target.value)
			: evt.target.value;
		if (props.fnOnChange) props.fnOnChange(newValue as TVal);
		setValue(newValue as TVal);
	};

	const valueText = props.valueToString ? props.valueToString(value) : `${value}`;

	console.log(`Input, value: ${value}`);

	return (
		<div
			id={props.id}
			className={props.className}
		>
			<label
				className={props.labelClass}
				style={props.labelStyle}
				{...props.labelProps}
			>
				{props.label}

				<input
					value={valueText}
					onChange={onChange}
					type={props.type}
					placeholder={props.placeholder}
					maxLength={props.maxLength}

					className={props.inputClass}
					style={props.inputStyle}
					{...props.inputProps}
				/>
			</label>

			{props.description && <p>{props.description}</p>}
			{props.showCharCount && <p>{valueText.length}/{props.maxLength}</p>}
		</div>
	);
}
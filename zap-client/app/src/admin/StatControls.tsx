import {useClient} from '../ClientContext.ts';
import {$allStats, $config} from '../ClientState.ts';
import {atom, useAtom} from 'jotai';
import {T_StatDef} from '../configs/BaseGameConfig.ts';
import {Button} from '../components/ButtonComponents.tsx';
import {Input, NumberInput, T_Input} from '../components/InputComponents.tsx';
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

	const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const array = allStats.values;
		array[index] = evt.target.value;
		setAllStats({values: array});
		setStat(index, evt.target.value);
	}

	const value = allStats.values[index];

	return (
		<div className={'statValueControl'}>

			<label className={'statInputLabel'}>
				{def.label}
				<input
					value={value}
					onChange={onChange}
					className={'statInput'}
				/>
			</label>
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
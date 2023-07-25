import React from 'react';
import {PrimitiveAtom} from 'jotai/vanilla/atom';
import {useAtom} from 'jotai';


export type T_Input<TVal> = {
	label: string,
	$value: PrimitiveAtom<TVal>,
	description?: string,
	
	type?: React.HTMLInputTypeAttribute,
	placeholder?: string,
	
	className?: string,
	
	labelClass?: string,
	labelStyle?: React.CSSProperties,
	labelProps?: object,
	
	inputClass?: string,
	inputStyle?: React.CSSProperties,
	inputProps?: object,
	
	/** required if not string */
	stringToValue?: (str: string) => TVal,
	valueToString?: (val: TVal) => string,
	
}

export function Input<TVal>(props: T_Input<TVal>) {
	const [value, setValue] = useAtom(props.$value);
	
	const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = props.stringToValue
			? props.stringToValue(evt.target.value)
			: evt.target.value;
		setValue(newValue as TVal);
	};
	
	return (
		<div className={props.className}>
			<label
				className={props.labelClass}
				style={props.labelStyle}
				{...props.labelProps}
			>
				{props.label}
				
				<input
					value={props.valueToString ? props.valueToString(value) : `${value}`}
					onChange={onChange}
					type={props.type}
					placeholder={props.placeholder}
					
					className={props.inputClass}
					style={props.inputStyle}
					{...props.inputProps}
				/>
			</label>
			
			{props.description && <p>{props.description}</p>}
		</div>
	);
}

export const NumberInput = (props: T_Input<number>) =>
	<Input stringToValue={str => parseInt(str) || 0} {...props}/>;


import React from 'react';
import {PrimitiveAtom} from 'jotai/vanilla/atom';
import {useAtom} from 'jotai';


export type T_Input<TVal> = {
	id?: string,
	label: string,
	$value: PrimitiveAtom<TVal>,
	description?: string,
	
	textArea?: boolean,
	
	type?: React.HTMLInputTypeAttribute,
	placeholder?: string,
	maxLength?: number,
	showCharCount?: boolean,
	
	className?: string,
	
	labelClass?: string,
	labelStyle?: React.CSSProperties,
	labelProps?: object,
	
	inputClass?: string,
	inputStyle?: React.CSSProperties,
	inputProps?: React.InputHTMLAttributes<HTMLInputElement>,
	
	/** required if not string */
	stringToValue?: (str: string) => TVal,
	valueToString?: (val: TVal) => string,
	fnOnChange?: (val: TVal) => void,
}

export function Input<TVal>(props: T_Input<TVal>) {
	const [value, setValue] = useAtom(props.$value);
	
	const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		// console.log(`onChange: ${evt.target.value}`);
		const newValue = props.stringToValue
			? props.stringToValue(evt.target.value)
			: evt.target.value;
		if (props.fnOnChange) props.fnOnChange(newValue as TVal);
		setValue(newValue as TVal);
	};
	
	const InputComp = props.textArea ? HtmlTextArea : HtmlInput;

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
				
				<InputComp
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

export const NumberInput = (props: T_Input<number>) =>
	<Input stringToValue={str => parseInt(str) || 0} {...props}/>;

const HtmlInput = (props: any) => <input {...props}/>;
const HtmlTextArea = (props: any) => <textarea {...props}/>;
import React from 'react';
import {Atom, PrimitiveAtom} from 'jotai/vanilla/atom';
import {atom, useAtom, useAtomValue} from 'jotai';
import {clsx} from 'clsx';

export type T_Button = {
	id?: string,
	label: string,
	onClick: React.MouseEventHandler<HTMLButtonElement>,
	
	className?: string,
	buttonClass?: string,
	buttonStyle?: React.CSSProperties,
	buttonProps?: object,
	
	/** skips if undefined */
	enabledIf?: Atom<boolean>,
}

const $alwaysTrue = atom(() => true);

export function Button(props: T_Button) {
	const enabled = useAtomValue(props.enabledIf || $alwaysTrue);
	
	return (
		<button
			id={props.id}
			onClick={props.onClick}
			disabled={!enabled}
			
			className={clsx(props.className, props.buttonClass)}
			style={props.buttonStyle}
			{...props.buttonProps}
		>
			{props.label}
		</button>
	);
	
}


export type T_RadioOption = {
	id: string,
	label: string,
	data?: string | number | object,
}

export type P_Radios = {
	/** index/id of options */
	id?: string,
	$value: PrimitiveAtom<string>,
	title: string, // legend?
	options: T_RadioOption[],
	filterOption?: (option: T_RadioOption | undefined) => boolean | undefined,
	
	containerClass?: string,
}

export function Radios(props: P_Radios) {
	const options = props.filterOption
		? props.options.filter(props.filterOption)
		: props.options;
	
	return (
		<fieldset
			id={props.id}
			className={clsx('radios', props.containerClass)}
		>
			<legend>{props.title}</legend>
			
			{options.map(option => (
				<RadioOption
					key={option.id}
					$value={props.$value}
					{...option}
				/>
			))}
		</fieldset>
	);
}

function RadioOption(props: T_RadioOption & {
	$value: PrimitiveAtom<string>
}) {
	const [value, setValue] = useAtom(props.$value);
	
	return (
		<label>
			<input
				type={'radio'}
				name={props.label}
				checked={props.id === value}
				onChange={() => setValue(props.id)}
			/>
			{props.label}
		</label>
	);
}
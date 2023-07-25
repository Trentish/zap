import React from 'react';
import {Atom, PrimitiveAtom} from 'jotai/vanilla/atom';
import {atom, useAtom, useAtomValue} from 'jotai';
import {clsx} from 'clsx';

export type T_Button = {
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


export type T_Radios = {
	/** index/id of options */
	$value: PrimitiveAtom<number>,
	title: string, // legend?
	options: T_RadioOption[],
	
	containerClass?: string,
}

export type T_RadioOption = {
	label: string,
	key?: string, // or use label
	data?: string | number | object,
}

export function Radios(props: T_Radios) {
	return (
		<fieldset className={clsx('radios', props.containerClass)}>
			<legend>{props.title}</legend>
			
			{props.options.map((
				(option, index) => (
					<RadioOption
						key={`${index}`}
						id={index}
						$value={props.$value}
						{...option}
					/>
				)
			))}
		</fieldset>
	);
}

function RadioOption(props: T_RadioOption & {
	id: number,
	$value: PrimitiveAtom<number>
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
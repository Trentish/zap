import React from 'react';
import {Atom} from 'jotai/vanilla/atom';
import {atom, useAtomValue} from 'jotai';
import {clsx} from 'clsx';

export type T_Button = {
	label: string,
	onClick: React.MouseEventHandler<HTMLButtonElement>,
	
	class?: string,
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
			
			className={clsx(props.class, props.buttonClass)}
			style={props.buttonStyle}
			{...props.buttonProps}
		>
			{props.label}
		</button>
	);
	
}
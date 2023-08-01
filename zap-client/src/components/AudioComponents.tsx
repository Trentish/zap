import React, {forwardRef} from 'react';

export type P_Audio = {
	src: string,
} & React.AudioHTMLAttributes<HTMLAudioElement>;


export const Audio = forwardRef(
	function Audio(props: P_Audio, ref: React.ForwardedRef<HTMLAudioElement>) {
		return (
			<audio
				autoPlay={false}
				{...props}
				ref={ref}
			>
				<source
					src={props.src}
					type={GetSourceType(props.src)}
				/>
			</audio>
		);
	},
);


function GetSourceType(src: string): string {
	if (!src) return '';
	
	const ext = src.split('.').pop()?.toLowerCase();
	
	switch (ext) {
		case 'mp3':
			return `audio/${ext}`;
		default:
			throw new Error(`handle audio source extension: ${ext} for ${src}`);
	}
}
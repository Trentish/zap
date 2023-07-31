import React, {forwardRef} from 'react';

export type P_Video = {
	src: string,
} & React.VideoHTMLAttributes<HTMLVideoElement>;


export const Video = forwardRef(
	function Video(props: P_Video, ref: React.ForwardedRef<HTMLVideoElement>) {
		return (
			<video
				autoPlay={false}
				{...props}
				ref={ref}
			>
				<source
					src={props.src}
					type={GetSourceType(props.src)}
				/>
			</video>
		);
	},
);

export type P_BackgroundVideo = {
	src: string,
} & React.VideoHTMLAttributes<HTMLVideoElement>;

export const BackgroundVideo = forwardRef(
	function BackgroundVideo(props: P_BackgroundVideo, ref: React.ForwardedRef<HTMLVideoElement>) {
		return (
			<video
				id={props.id}
				autoPlay
				muted
				loop
				{...props}
				ref={ref}
			>
				<source
					src={props.src}
					type={GetSourceType(props.src)}
				/>
			</video>
		);
	},
);


function GetSourceType(src: string): string {
	if (!src) return '';
	
	const ext = src.split('.').pop()?.toLowerCase();
	
	switch (ext) {
		case 'webm':
		case 'mov':
		case 'mp4':
			return `video/${ext}`;
		default:
			throw new Error(`handle video source extension: ${ext} for ${src}`);
	}
}
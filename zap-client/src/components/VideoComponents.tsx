import React from 'react';


export type P_BackgroundVideo = {
	src: string,
	id?: string,
	className?: string,
}

export function BackgroundVideo(props: P_BackgroundVideo) {
	return (
		<video
			id={props.id}
			autoPlay
			muted
			loop
		>
			<source
				src={props.src}
				type={GetSourceType(props.src)}
			/>
		</video>
	);
}


function GetSourceType(src: string): string {
	const ext = src.split('.').pop()?.toLowerCase();
	
	switch (ext) {
		case 'webm':
		case 'mp4':
			return `video/${ext}`;
		default: throw new Error(`handle video source extension: ${ext} for ${src}`);
	}
}
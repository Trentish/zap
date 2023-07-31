import './Crawler.css';
import React, {forwardRef, useEffect, useRef} from 'react';
import {atom, useAtom} from 'jotai';
import {$allArticles, $store} from '../ClientState.ts';
import {ArticleDat} from '../../../zap-shared/_Dats.ts';
import {PrimitiveAtom} from 'jotai/vanilla/atom';

// TODO: cleanup/organize this file

const SHOW_COUNT = 12;
const CRAWL_RATE = 160; // width pixels / CRAWL_RATE

const exampleHeadlines = [
	'Elven King Thranduil denounces trade deal with Dwarf nation',
	'Hobbit Celebrations Abound on Bilbo Baggins\' 111th Birthday',
	'Mayor announces new bridge to be built across Brandywine River',
	'Rohirrim cavalry praised for quick response to Warg attack',
	'Gondorian ambassador calls for peace talks amid rising tensions',
	'Elves of Mirkwood to Host Climate Change Summit',
	'Scientists make breakthrough in understanding of Entish language',
	'Scholars discover lost manuscript detailing First Age battles',
	'Mayor defends decision to cut down Old Forest trees for development',
	'Mordor Army Advances on Gondor',
	'King Theoden of Rohan Dies at Age 71',
	'Saruman the White Expelled from Order of Wizards',
	'Galadriel, Lady of Lothlorien, Announces Retirement from Politics',
	'Dragon Sighting Near Lonely Mountain Sparks Panic Amongst Dwarves',
	'Elrond Appointed as New High King of Elves',
	'DEEP - New shopping center and entertainment complex opens',
	'Dunedain rangers report increased undead activity',
	'Dwarven King Thorin Oakenshield Leads Mining Expansion in Misty Mountains',
	'Gollum Captured by Authorities, to Face Trial for Murder of Deagol',
];

const tempArticles: ArticleDat[] = exampleHeadlines.map((v, i) => (
	{id: i, headline: v, orgIdf: ''}
));

const $testArticles = atom(tempArticles);


type T_CrawlItem = { key: string, index: number };
type T_AnimVars = { duration: number, x: number };

/** important that group width is larger than window width */
const ITEMS_PER_GROUP = 10;

type T_Item = { text: string };

const $tailIndex = atom(-1);
const $groupItems0 = atom<T_Item[]>([]);
const $groupItems1 = atom<T_Item[]>([]);
const groupItems = [$groupItems0, $groupItems1];

const $hasInitialized = atom(false);
const $groupInitial0 = atom(false);
const $groupInitial1 = atom(false);
const groupInitials = [$groupInitial0, $groupInitial1];

const groupKeys = ['0_CrawlGroup', '1_CrawlGroup'];
const groupAnimClasses = ['anim0', 'anim1'];

export function Crawler() {
	const groupRefs = [
		useRef<HTMLDivElement>(null),
		useRef<HTMLDivElement>(null),
	];
	
	useEffect(() => {
		UpdateGroupItems(groupItems[0]);
		UpdateGroupItems(groupItems[1]);
	}, []);
	
	const fnAnimEnded = (groupId: number) => {
		const animDiv = groupRefs[0].current as HTMLDivElement;
		animDiv.classList.remove(groupAnimClasses[groupId]);
		UpdateGroupItems(groupItems[groupId]);
	};
	
	const fnRestartAnim = (groupId: number) => {
		SetAnimVars(groupId, groupRefs);
	};
	
	return (
		<div className={'crawlerContainer'}>
			
			<CrawlGroup
				key={groupKeys[0]}
				groupId={0}
				$items={groupItems[0]}
				ref={groupRefs[0]}
				fnEnded={fnAnimEnded}
				fnRestartAnim={fnRestartAnim}
			/>
			
			<CrawlGroup
				key={groupKeys[1]}
				groupId={1}
				$items={groupItems[1]}
				ref={groupRefs[1]}
				fnEnded={fnAnimEnded}
				fnRestartAnim={fnRestartAnim}
			/>
		
		</div>
	
	);
}

type P_CrawlGroup = {
	groupId: number,
	$items: PrimitiveAtom<T_Item[]>,
	fnEnded: (groupId: number) => void,
	fnRestartAnim: (groupId: number) => void,
}

const CrawlGroup = forwardRef(
	function CrawlGroup(props: P_CrawlGroup, ref: React.ForwardedRef<HTMLDivElement>) {
		const [items] = useAtom(props.$items);
		
		useEffect(() => {
			props.fnRestartAnim(props.groupId);
		}, [items]);
		
		return (
			<div
				className={`crawlGroup`}
				ref={ref}
				onAnimationEnd={() => props.fnEnded(props.groupId)}
			>
				{items.map((item, i) => (
					<div
						key={`${i}crawlItem`}
						className={'crawlerHeadline'}
					>{item.text}</div>
				))}
			</div>
		);
	},
);

function SetAnimVars(
	groupId: number,
	groupRefs: React.RefObject<HTMLDivElement>[],
) {
	let animDiv: HTMLDivElement;
	let divToFollow: HTMLDivElement;
	
	if (groupId === 0) {
		animDiv = groupRefs[0].current as HTMLDivElement;
		divToFollow = groupRefs[1].current as HTMLDivElement;
	}
	else if (groupId === 1) {
		animDiv = groupRefs[1].current as HTMLDivElement;
		divToFollow = groupRefs[0].current as HTMLDivElement;
	}
	else {
		return;
	}
	
	const animDivWidth = animDiv.offsetWidth;
	// if (animDivWidth < 10) animDivWidth = 200; // jdklfjldsjljlf
	
	const followRect = divToFollow.getBoundingClientRect();
	
	// let startX = divToFollow.offsetLeft + divToFollow.offsetWidth;
	let startX = followRect.right;
	
	const hasBeenInitialized = $store.get($hasInitialized);
	if (!hasBeenInitialized) {
		console.log(`------initializing groupId: ${groupId}`);
		if (animDivWidth > 10) $store.set($hasInitialized, true);
		startX = 0;
	}
	
	const endX = -animDivWidth;
	const duration = (
		-endX + startX
	) / CRAWL_RATE;
	
	SetVar(`--crawlDuration${groupId}`, duration + 's');
	SetVar(`--crawlStart${groupId}`, startX + 'px');
	SetVar(`--crawlEnd${groupId}`, endX + 'px');
	
	SetVar(`--crawlWidth${groupId}`, animDivWidth + 'px');
	
	console.log(
		`SetAnimVars: #${groupId}, s${startX} e${endX} d${duration}, w${animDivWidth}`,
		followRect,
	);
	
	animDiv.classList.add(groupAnimClasses[groupId]);
	animDiv.style.animation = 'none';
	animDiv.offsetHeight;
	animDiv.style.animation = '';
}

function UpdateGroupItems($items: PrimitiveAtom<T_Item[]>) {
	const prevIndex = $store.get($tailIndex);
	const [tailIndex, items] = GetNextItems(prevIndex, ITEMS_PER_GROUP);
	$store.set($tailIndex, tailIndex);
	$store.set($items, items);
}


// TODO: put external, pass in
function GetNextItems(prevIndex: number, countToAdd: number): [number, T_Item[]] {
	const allArticles = $store.get($allArticles);
	// let allArticles = $store.get($testArticles);
	
	// if (!allArticles?.length) {
	// 	allArticles = tempArticles;
	// }
	
	if (!allArticles?.length) return [0,[]];
	
	const allArticlesCount = allArticles.length;
	
	let minIndex = allArticlesCount - SHOW_COUNT;
	if (minIndex < 0) minIndex = 0;
	const maxIndex = allArticlesCount - 1;
	
	const items: T_Item[] = [];
	let nextIndex = prevIndex;
	
	while (countToAdd > 0) {
		nextIndex += 1;
		if (nextIndex > maxIndex) nextIndex = minIndex;
		items.push({
			text: allArticles[nextIndex].headline,
		});
		--countToAdd;
	}
	
	console.log(`GetNextItems  last index: ${nextIndex}, all count: ${allArticlesCount} (${minIndex}, ${maxIndex})`);
	
	return [nextIndex, items];
}

const SetVar = (name: string, val: string) => document.documentElement.style.setProperty(name, val);

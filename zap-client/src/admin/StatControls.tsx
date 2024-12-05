import {useClient} from '../ClientContext.ts';
import {$allStats, $config} from '../ClientState.ts';
import {atom, useAtom} from 'jotai';
import {T_StatDef} from '../configs/BaseGameConfig.ts';
import {Button} from '../components/ButtonComponents.tsx';
import {NumberInput} from '../components/InputComponents.tsx';

// HACK for now
const $stat0 = atom(0);
const $stat1 = atom(0);
const $stat2 = atom(0);
const $stat3 = atom(0);
const $stat4 = atom(0);
const $stat5 = atom(0);
const statAtoms = [$stat0, $stat1, $stat2, $stat3, $stat4, $stat5];

/*

NOTE: abandoned this feature but it's very close
- networking stuff is all good
- missing admin front end
- not sure what to do about NumberInput taking an atom


 */


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
	const [allStats] = useAtom($allStats);
	
	const value = allStats.values[index];
	
	const numValue = def.isNumber ? parseInt(value) || 0 : 0;
	
	return (
		<div className={'statValueControl'}>
			index: {index}, value: {value}, label: {def.label}, icon: {def.icon}
			
			{def.isNumber && (
				<>
					<NumberInput label={def.label || `stat ${index}`} $value={statAtoms[index]}/>
					<Button label={'+'} onClick={() => setStat(index, `${numValue + 1}`)}/>
					<Button label={'-'} onClick={() => setStat(index, `${numValue - 1}`)}/>
				</>
			)}
		</div>
	);
}
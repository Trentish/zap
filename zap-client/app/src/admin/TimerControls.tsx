import {useClient} from '../ClientContext.ts';
import {Timer} from '../displays/Timer.tsx';
import {Input, NumberInput} from '../components/InputComponents.tsx';
import React from 'react';
import {atom, useAtom} from 'jotai';
import {Button} from '../components/ButtonComponents.tsx';
import {$config, $store, $timer} from '../ClientState.ts';
import './TimerControls.css';
import {toMilliseconds, toMinutesSeconds} from '../lib/TimeUtils.ts';

const $label = atom('');
const $minutes = atom(5);
const $seconds = atom(0);

export function TimerControls() {
    const client = useClient();
    const [config] = useAtom($config);

    const sendTimer = () => {
        const label = $store.get($label);
        const minutes = $store.get($minutes);
        const seconds = $store.get($seconds);

        const ms = toMilliseconds(minutes, seconds);
        client.packets.SetTimer.Send({
            label: label,
            ms: ms,
        });
    };

    const sendLabelOnly = () => {
        const label = $store.get($label);
        client.packets.SetTimer.Send({
            label: label,
            setLabelOnly: true,
        });
    };

    const clearLabel = () => {
        $store.set($label, "");
        client.packets.SetTimer.Send({
            label: "",
            setLabelOnly: true,
        });
    };

    const sendTimerKeepPhase = () => {
        const timerDat = $store.get($timer);
        const minutes = $store.get($minutes);
        const seconds = $store.get($seconds);

        const ms = toMilliseconds(minutes, seconds);
        client.packets.SetTimer.Send({
            label: timerDat.label,
            ms: ms,
            keepPhase: true,
        });
    }

    return (
        <div className={"control-group control-group-vertical timerControls"}>
            <Timer
                $timer={$timer}
                isAdminPage
            />

            <div className={'control-group timerLabelControls'}>
                <Input
                    label={'Timer Label'}
                    $value={$label}
                />

                <Button
                    label={'Set Label Only'}
                    onClick={sendLabelOnly}
                />

                <Button
                    label={'Clear'}
                    onClick={clearLabel}
                />

            </div>


            <div className={'control-group numberLabelControls'}>
                <NumberInput
                    label={'Minutes'}
                    $value={$minutes}
                />

                <div style={{width: 16}}/>

                <NumberInput
                    label={'Seconds'}
                    $value={$seconds}
                />

                <Button
                    label={'New Timer'}
                    onClick={sendTimer}
                />

                {config.phaseDefs.length > 0 && (
                    <Button
                        label={'Set Time (keep Phase)'}
                        onClick={sendTimerKeepPhase}
                    />
                )}
            </div>

            <TimerDefs/>
            {config.phaseDefs.length > 0 && (
                <PhaseDefs/>
            )}
        </div>
    );
}

export function TimerDefs() {
    const client = useClient();
    const [config] = useAtom($config);

    return (
        <div className={'timer-defs'}>
            {config.timerDefs.map((timerDef, index) => {
                const ms = timerDef.ms;
                const [minutes, seconds] = toMinutesSeconds(ms !== undefined ? ms : 0);

                const timerLabel = timerDef.label || '';
                const buttonLabel = (
                    `${timerLabel}`
                    + ` (`
                    + `${minutes > 0 ? `${minutes}m` : ''}`
                    + `${seconds > 0 ? ` ${seconds}s` : ''}`
                    + `)`
                ).trim();

                const sendTimer = () => {
                    client.packets.SetTimer.Send({
                        label: timerLabel,
                        ms: ms,
                        setLabelOnly: timerDef.setLabelOnly,
                    });

                    $store.set($label, timerLabel);
                    $store.set($minutes, minutes);
                    $store.set($seconds, seconds);
                };

                return (
                    <Button
                        key={`${index}_${timerDef.label}`}
                        label={
                            <span style={{display: "flex", alignItems: "center", gap: 8}}>
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: 14,
                                        height: 14,
                                        borderRadius: "50%",
                                        background: timerDef.color || "#888",
                                        border: "1px solid #444",
                                    }}
                                />
                                {buttonLabel}
                            </span>
                        }
                        onClick={sendTimer}
                        buttonStyle={{backgroundColor: timerDef.color}}
                        className={"timer-def-button"}
                    />
                );
            })}
        </div>
    );
}

export function PhaseDefs() {
    const client = useClient();
    const [config] = useAtom($config);

    return (
        <div className={'phase-defs'}>
            <span className={'phasesRow-label'}>Phases:</span>

            {config.phaseDefs.map((phaseDef, index) => {
                const ms = phaseDef.ms;
                const [minutes, seconds] = toMinutesSeconds(ms !== undefined ? ms : 0);

                const timerLabel = phaseDef.label || '';
                const buttonLabel = (
                    `${index + 1}. ${timerLabel}`
                    + ` (`
                    + `${minutes > 0 ? `${minutes}m` : ''}`
                    + `${seconds > 0 ? ` ${seconds}s` : ''}`
                    + `)`
                ).trim();

                const sendPhaseOptions = () => {
                    client.packets.SetPhaseOptions.Send({
                        phases: config.phaseDefs,
                        index: index,
                    });
                };

                return (
                    <Button
                        key={`${index}_${phaseDef.label}`}
                        label={buttonLabel}
                        onClick={sendPhaseOptions}
                        className={'phase-def-button'}
                    />
                );
            })}
        </div>
    );
}
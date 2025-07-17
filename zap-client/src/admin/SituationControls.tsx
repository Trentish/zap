import {useClient} from "../ClientContext.ts";
import {useAtom} from "jotai/index";
import {$config} from "../ClientState.ts";
import {Button} from "../components/ButtonComponents.tsx";
import React from "react";
import {SituationDat} from "../../zap-shared/_Dats.ts";
import './SituationControls.css';

export function SituationControls() {
    const client = useClient();
    const [config] = useAtom($config);

    const sendSituation = (situation: SituationDat) => {
        client.packets.SetSituation.Send(situation);
    };

    if (!config.situationDefs?.length) return <div/>;

    return (
        <div className={'situation-defs'}>
            <Button
                label={'clear'}
                onClick={() => sendSituation({label: '', cssClass: ''})}
                className={'situation-def-button situation-clear'}
            />

            {config.situationDefs.map((situation, index) => (
                <Button
                    key={`${index}_${situation.label}`}
                    label={situation.label}
                    onClick={() => sendSituation(situation)}
                    className={'situation-def-button'}
                />
            ))}
        </div>
    );
}

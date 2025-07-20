import { useClient } from "../ClientContext.ts";
import { Timer } from "../displays/Timer.tsx";
import { Input, NumberInput } from "../components/InputComponents.tsx";
import React from "react";
import { atom, useAtom } from "jotai";
import { Button } from "../components/ButtonComponents.tsx";
import { $config, $store, $timer } from "../ClientState.ts";
import "./TimerControls.css";
import { toMilliseconds, toMinutesSeconds } from "../lib/TimeUtils.ts";

const $label = atom("");
const $minutes = atom(5);
const $seconds = atom(0);

export function TimerControls() {
  const client = useClient();

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

  return (
    <div className={"control-group control-group-vertical timerControls"}>
      <Timer $timer={$timer} />

      <div className={"control-group timerLabelControls"}>
        <Input label={"Timer Label"} $value={$label} />

        <Button label={"Set Label Only"} onClick={sendLabelOnly} />

        <Button label={"Clear"} onClick={clearLabel} />
      </div>

      <div className={"control-group numberLabelControls"}>
        <NumberInput label={"Minutes"} $value={$minutes} />

        <div style={{ width: 16 }} />

        <NumberInput label={"Seconds"} $value={$seconds} />

        <Button label={"New Timer"} onClick={sendTimer} />
      </div>

      <TimerDefs />
    </div>
  );
}

export function TimerDefs() {
  const client = useClient();
  const [config] = useAtom($config);

  return (
    <div className={"timer-defs"}>
      {config.timerDefs.map((timerDef, index) => {
        const ms = timerDef.ms;
        const [minutes, seconds] = toMinutesSeconds(ms !== undefined ? ms : 0);

        const timerLabel = timerDef.label || "";
        const buttonLabel = (
          `${timerLabel}` +
          ` (` +
          `${minutes > 0 ? `${minutes}m` : ""}` +
          `${seconds > 0 ? ` ${seconds}s` : ""}` +
          `)`
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
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
            className={"timer-def-button"}
          />
        );
      })}
    </div>
  );
}

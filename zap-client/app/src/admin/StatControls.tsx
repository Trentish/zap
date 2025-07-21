import { useClient } from "../ClientContext.ts";
import { $allStats, $config } from "../ClientState.ts";
import { atom, useAtom } from "jotai";
import { T_StatDef } from "../configs/BaseGameConfig.ts";
import { T_Input } from "../components/InputComponents.tsx";
import "./StatControls.css";
import React from "react";

export function StatControls() {
  const client = useClient();
  const [config] = useAtom($config);
  const [allStats, setAllStats] = useAtom($allStats);

  const setStat = (index: number, value: string) => {
    client.packets.SetStat.Send({
      index: index,
      value: value,
    });
  };

  // --- Defcon Table ---
  const defconNations = [
    { name: "Algeria", code: "DZA", flag: "🇩🇿" },
    { name: "Argentina", code: "ARG", flag: "🇦🇷" },
    { name: "Australia", code: "AUS", flag: "🇦🇺" },
    { name: "Brazil", code: "BRA", flag: "🇧🇷" },
    { name: "Canada", code: "CAN", flag: "🇨🇦" },
    { name: "China", code: "CHN", flag: "🇨🇳" },
    { name: "DR Congo", code: "COD", flag: "🇨🇩" },
    { name: "Egypt", code: "EGY", flag: "🇪🇬" },
    { name: "Ethiopia", code: "ETH", flag: "🇪🇹" },
    { name: "France", code: "FRA", flag: "🇫🇷" },
    { name: "Germany", code: "DEU", flag: "🇩🇪" },
    { name: "India", code: "IND", flag: "🇮🇳" },
    { name: "Indonesia", code: "IDN", flag: "🇮🇩" },
    { name: "Iran", code: "IRN", flag: "🇮🇷" },
    { name: "Japan", code: "JPN", flag: "🇯🇵" },
    { name: "Mexico", code: "MEX", flag: "🇲🇽" },
    { name: "Nigeria", code: "NGA", flag: "🇳🇬" },
    { name: "Pakistan", code: "PAK", flag: "🇵🇰" },
    { name: "Poland", code: "POL", flag: "🇵🇱" },
    { name: "Russia", code: "RUS", flag: "🇷🇺" },
    { name: "Saudi Arabia", code: "SAU", flag: "🇸🇦" },
    { name: "South Africa", code: "ZAF", flag: "🇿🇦" },
    { name: "South Korea", code: "KOR", flag: "🇰🇷" },
    { name: "Turkey", code: "TUR", flag: "🇹🇷" },
    { name: "United Kingdom", code: "GBR", flag: "🇬🇧" },
    { name: "United States", code: "USA", flag: "🇺🇸" },
    { name: "Venezuela", code: "VEN", flag: "🇻🇪" },
  ];

  // Find defcon stat indexes
  const defcon1Idx = config.statDefs.findIndex(
    (d) => d.className && d.className.includes("defcon-1")
  );
  const defcon2Idx = config.statDefs.findIndex(
    (d) => d.className && d.className.includes("defcon-2")
  );
  const defcon3Idx = config.statDefs.findIndex(
    (d) => d.className && d.className.includes("defcon-3")
  );

  // Parse CSVs into a map: { [code]: { level, trend } }
  const parseDefconCSV = (csv: string, level: 1 | 2 | 3) => {
    const map: Record<string, { level: 1 | 2 | 3; trend: "" | "▲" | "▼" }> = {};
    csv.split(",").forEach((entry) => {
      const m = entry.match(/^([A-Z]{3})([▲▼]?)$/);
      if (m) {
        map[m[1]] = { level, trend: m[2] as "" | "▲" | "▼" };
      }
    });
    return map;
  };

  const defcon1Map = parseDefconCSV(allStats.values[defcon1Idx] || "", 1);
  const defcon2Map = parseDefconCSV(allStats.values[defcon2Idx] || "", 2);
  const defcon3Map = parseDefconCSV(allStats.values[defcon3Idx] || "", 3);

  // Compose a single map for all nations
  const nationDefcon: Record<
    string,
    { level: 0 | 1 | 2 | 3; trend: "" | "▲" | "▼" }
  > = {};
  for (const n of defconNations) nationDefcon[n.code] = { level: 0, trend: "" };
  for (const code in defcon1Map)
    nationDefcon[code] = { level: 1, trend: defcon1Map[code].trend };
  for (const code in defcon2Map)
    nationDefcon[code] = { level: 2, trend: defcon2Map[code].trend };
  for (const code in defcon3Map)
    nationDefcon[code] = { level: 3, trend: defcon3Map[code].trend };

  // Handler to update a nation's defcon level/trend
  function updateNationDefcon(
    code: string,
    newLevel: 0 | 1 | 2 | 3,
    newTrend: "" | "▲" | "▼"
  ) {
    // Remove from all maps
    const new1: string[] = [];
    const new2: string[] = [];
    const new3: string[] = [];
    for (const n of defconNations) {
      if (n.code === code) {
        if (newLevel === 1) new1.push(`${code}${newTrend}`);
        else if (newLevel === 2) new2.push(`${code}${newTrend}`);
        else if (newLevel === 3) new3.push(`${code}${newTrend}`);
        // else: none
      } else {
        if (defcon1Map[n.code])
          new1.push(`${n.code}${defcon1Map[n.code].trend}`);
        if (defcon2Map[n.code])
          new2.push(`${n.code}${defcon2Map[n.code].trend}`);
        if (defcon3Map[n.code])
          new3.push(`${n.code}${defcon3Map[n.code].trend}`);
      }
    }
    const newValues = [...allStats.values];
    if (defcon1Idx >= 0) newValues[defcon1Idx] = new1.join(",");
    if (defcon2Idx >= 0) newValues[defcon2Idx] = new2.join(",");
    if (defcon3Idx >= 0) newValues[defcon3Idx] = new3.join(",");
    setAllStats({ values: newValues });
    // Also send to server
    if (defcon1Idx >= 0) setStat(defcon1Idx, new1.join(","));
    if (defcon2Idx >= 0) setStat(defcon2Idx, new2.join(","));
    if (defcon3Idx >= 0) setStat(defcon3Idx, new3.join(","));
  }

  // --- END DEFCON ---

  return (
    <div className={"statControls"}>
      <DefconControlTable
        defconNations={defconNations}
        nationDefcon={nationDefcon}
        updateNationDefcon={updateNationDefcon}
      />
      {config.statDefs.map((def, index) =>
        def.className && def.className.includes("defcon") ? null : (
          <Stat
            key={`stat${index}`}
            index={index}
            def={def}
            setStat={setStat}
          />
        )
      )}
    </div>
  );
}

function DefconControlTable({
  defconNations,
  nationDefcon,
  updateNationDefcon,
}: {
  defconNations: { name: string; code: string; flag: string }[];
  nationDefcon: Record<string, { level: 0 | 1 | 2 | 3; trend: "" | "▲" | "▼" }>;
  updateNationDefcon: (
    code: string,
    newLevel: 0 | 1 | 2 | 3,
    newTrend: "" | "▲" | "▼"
  ) => void;
}) {
  return (
    <table className="defconTable" style={{ marginBottom: 24, width: "100%" }}>
      <thead>
        <tr>
          <th rowSpan={2}></th>
          <th colSpan={4} style={{ borderBottom: "1px solid #bbb" }}>
            DEFCON Level
          </th>
          <th colSpan={3} style={{ borderBottom: "1px solid #bbb" }}>
            Trend
          </th>
        </tr>
        <tr>
          <th>NONE</th>
          <th>3</th>
          <th>2</th>
          <th>1</th>
          <th>↓</th>
          <th>-</th>
          <th>↑</th>
        </tr>
      </thead>
      <tbody>
        {defconNations.map((nation, idx) => {
          const { level, trend } = nationDefcon[nation.code] || {
            level: 0,
            trend: "",
          };
          return (
            <tr
              key={nation.code}
              className={(idx + 1) % 2 === 1 ? "zebra" : ""}
            >
              <td className="nation-cell">
                <span className="flag-emoji">{nation.flag}</span> {nation.name}{" "}
                <span className="iso-code">({nation.code})</span>
              </td>
              {[0, 3, 2, 1].map((lvl) => (
                <td key={lvl} style={{ cursor: "pointer", padding: 0 }}>
                  <label
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      padding: "8px 0",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name={`defcon-level-${nation.code}`}
                      id={`defcon-level-${nation.code}-${lvl}`}
                      checked={level === lvl}
                      onChange={() =>
                        updateNationDefcon(
                          nation.code,
                          lvl as 0 | 1 | 2 | 3,
                          trend
                        )
                      }
                      style={{ margin: "0 auto", display: "inline-block" }}
                    />
                  </label>
                </td>
              ))}
              {["▼", "", "▲"].map((tr) => (
                <td key={tr} style={{ cursor: "pointer", padding: 0 }}>
                  <label
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      padding: "8px 0",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name={`defcon-trend-${nation.code}-level${level}`}
                      id={`defcon-trend-${nation.code}-${
                        tr === ""
                          ? "nochange"
                          : tr === "▲"
                          ? "rising"
                          : "falling"
                      }`}
                      checked={trend === tr}
                      onChange={() =>
                        updateNationDefcon(
                          nation.code,
                          level,
                          tr as "" | "▲" | "▼"
                        )
                      }
                      style={{ margin: "0 auto", display: "inline-block" }}
                      disabled={level === 0}
                    />
                  </label>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <th></th>
          <th>NONE</th>
          <th>3</th>
          <th>2</th>
          <th>1</th>
          <th>↓</th>
          <th>-</th>
          <th>↑</th>
        </tr>
        <tr>
          <th></th>
          <th colSpan={4} style={{ borderTop: "1px solid #bbb" }}>
            DEFCON Level
          </th>
          <th colSpan={3} style={{ borderTop: "1px solid #bbb" }}>
            Trend
          </th>
        </tr>
      </tfoot>
    </table>
  );
}

function Stat({
  index,
  def,
  setStat,
}: {
  index: number;
  def: T_StatDef;
  setStat: (index: number, value: string) => void;
}) {
  const [allStats, setAllStats] = useAtom($allStats);
  const [stepperValue, setStepperValue] = React.useState("");

  const STEPPER_MIN = 0;
  const STEPPER_MAX = 300;

  const isCorp = def.className && def.className.includes("corp");

  // Only allow numbers and commas in corp stat input
  const filterCorpInput = (input: string) => input.replace(/[^0-9,]/g, "");

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = evt.target.value;
    if (isCorp) {
      newValue = filterCorpInput(newValue);
    }
    const array = [...allStats.values];
    array[index] = newValue;
    setAllStats({ values: array });
    setStat(index, newValue);
  };

  const value = allStats.values[index];

  // Helper to add a new number to the CSV string
  const addStepperValue = () => {
    if (stepperValue.trim() === "") return;
    const num = stepperValue.trim();
    // Only allow valid numbers
    if (isNaN(Number(num))) return;
    let arr: string[] = [];
    if (value && value.trim().length > 0) {
      arr = value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    arr.push(num);
    if (arr.length > 10) arr = arr.slice(arr.length - 10);
    const newCsv = arr.join(",");
    const array = [...allStats.values];
    array[index] = newCsv;
    setAllStats({ values: array });
    setStat(index, newCsv);
    setStepperValue("");
  };

  const onStepperKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      addStepperValue();
    }
  };

  // Simple sparkline for corp stats
  function CorpSparkline({ csv }: { csv: string }) {
    if (!csv) return null;
    const nums = csv
      .split(",")
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n));
    if (nums.length < 2) return null;
    // Normalize to 0-1 for y, left-to-right for x
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const range = max - min || 1;
    const points = nums.map((n, i) => [
      (i / (nums.length - 1)) * 60, // width 60px
      18 - ((n - min) / range) * 16, // height 18px, invert y
    ]);
    const d = points
      .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
      .join(" ");
    return (
      <svg
        width={64}
        height={20}
        viewBox="0 0 64 20"
        style={{ marginLeft: 8, verticalAlign: "middle" }}
      >
        <polyline
          fill="none"
          stroke="#1976d2"
          strokeWidth={2}
          points={points.map((p) => p.join(",")).join(" ")}
        />
      </svg>
    );
  }

  return (
    <div className={"statValueControl adminStatRow"}>
      <label className={"statInputLabel adminStatLabel"}>
        <div className="adminStatLabelText">{def.label}</div>
        <input
          value={value}
          onChange={onChange}
          className={"statInput adminStatInput"}
          {...(isCorp ? { pattern: "[0-9,]*", inputMode: "numeric" } : {})}
        />
      </label>
      {isCorp && (
        <>
          <div className="adminStatStepper">
            <input
              type="number"
              min={STEPPER_MIN}
              max={STEPPER_MAX}
              value={stepperValue}
              onChange={(e) => setStepperValue(e.target.value)}
              onKeyDown={onStepperKeyDown}
              className="adminStatStepperInput"
            />
            <button
              type="button"
              onClick={addStepperValue}
              className="adminStatAddBtn"
            >
              Add
            </button>
          </div>
          <CorpSparkline csv={value} />
        </>
      )}
    </div>
  );
}

export function StatInput<TVal>(props: T_Input<TVal>) {
  const [value, setValue] = useAtom(props.$value);

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(`onChange: ${evt.target.value}`);
    const newValue = props.stringToValue
      ? props.stringToValue(evt.target.value)
      : evt.target.value;
    if (props.fnOnChange) props.fnOnChange(newValue as TVal);
    setValue(newValue as TVal);
  };

  const valueText = props.valueToString
    ? props.valueToString(value)
    : `${value}`;

  console.log(`Input, value: ${value}`);

  return (
    <div id={props.id} className={props.className}>
      <label
        className={props.labelClass}
        style={props.labelStyle}
        {...props.labelProps}
      >
        {props.label}

        <input
          value={valueText}
          onChange={onChange}
          type={props.type}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          className={props.inputClass}
          style={props.inputStyle}
          {...props.inputProps}
        />
      </label>

      {props.description && <p>{props.description}</p>}
      {props.showCharCount && (
        <p>
          {valueText.length}/{props.maxLength}
        </p>
      )}
    </div>
  );
}

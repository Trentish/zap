import React from "react";
import { useAtom } from "jotai";
import { $allStats, $config } from "../ClientState.ts";
import { T_StatDef } from "../configs/BaseGameConfig.ts";
import { DEFCON_NATIONS } from "../../zap-shared/DEFCON_NATIONS";
import "./DefconBlock.css";

export function DefconBlock() {
  const [config] = useAtom($config);
  const [allStats] = useAtom($allStats);

  // Get defcon stats
  const defconStats: { def: T_StatDef; index: number }[] = [];
  config.statDefs.forEach((def, index) => {
    if (def.className && def.className.includes("defcon")) {
      defconStats.push({ def, index });
    }
  });

  // Only show defcon stats with non-empty values
  const visibleDefconStats = defconStats.filter(({ index }) => {
    const value = allStats.values[index];
    return value !== undefined && value !== null && value !== "";
  });

  if (!visibleDefconStats.length) return null;

  return (
    <div className={"defcon-block"}>
      {visibleDefconStats.map(({ def, index }) => (
        <StatView key={`stat${index}`} index={index} def={def} />
      ))}
    </div>
  );
}

function StatView({ index, def }: { index: number; def: T_StatDef }) {
  const [allStats] = useAtom($allStats);
  const [config] = useAtom($config);

  const value = allStats.values[index];

  // Parse the current data to see which flags should be visible and their trends
  const activeFlags = new Map<string, { trend: "up" | "down" | "neutral" }>();

  if (value !== undefined && value !== null && value !== "") {
    const values = typeof value === "string" ? value.split(",") : [value];
    values.forEach((v) => {
      let str = String(v).trim();
      let trendType: "up" | "down" | "neutral" = "neutral";

      if (str.includes("▼")) {
        str = str.replace("▼", "").trim();
        trendType = "down";
      } else if (str.includes("▲")) {
        str = str.replace("▲", "").trim();
        trendType = "up";
      }

      // Check for country code (3 uppercase letters)
      const codeMatch = str.match(/^[A-Z]{3}$/i);
      if (codeMatch) {
        const code = str.toUpperCase();
        const nation = DEFCON_NATIONS.find((n) => n.code === code);
        if (nation) {
          activeFlags.set(code, { trend: trendType });
        }
      }
    });
  }

  // Create ALL possible flags for each group
  const createAllFlags = (groupType: "up" | "down" | "neutral") => {
    return DEFCON_NATIONS.map((nation) => {
      const code = nation.code;
      const flagImgSrc = `${config.gameImagePath}flags/${code.toLowerCase()}.svg`;
      const flagInfo = activeFlags.get(code);
      
      // Flag is visible if it's active AND in the correct trend group
      const isVisible = flagInfo && flagInfo.trend === groupType;
      
      return (
        <span 
          key={code} 
          className={`individual-stat-block country-code-${code.toLowerCase()} ${isVisible ? 'flag-visible' : 'flag-hidden'}`}
        >
          <img
            src={flagImgSrc}
            alt={code}
            className="flag-img"
          />
        </span>
      );
    });
  };

  // Create flag arrays for each trend group (all flags always present)
  const upFlags = createAllFlags("up");
  const neutralFlags = createAllFlags("neutral");
  const downFlags = createAllFlags("down");

  // Check if any flags are visible in each group to determine if we show the group
  const hasUpFlags = Array.from(activeFlags.values()).some(f => f.trend === "up");
  const hasNeutralFlags = Array.from(activeFlags.values()).some(f => f.trend === "neutral");
  const hasDownFlags = Array.from(activeFlags.values()).some(f => f.trend === "down");

  // Helper to get odd/even and count classes based on visible flags
  function getGroupClass(base: string, groupType: "up" | "down" | "neutral") {
    const visibleCount = Array.from(activeFlags.values()).filter(f => f.trend === groupType).length;
    const oddEven = visibleCount % 2 === 0 ? "contains-even" : "contains-odd";
    const countClass = `contains-${visibleCount}`;
    return `${base} ${oddEven} ${countClass}`;
  }

  return (
    <div className={`statView ${def.className}`}>
      {def.icon && <img className={"statIcon"} src={def.icon} />}
      {def.label && <div className={"statLabel"}>{def.label}</div>}
      <div className={"statValue"}>
        {hasUpFlags && (
          <div className={getGroupClass("stat-group trending-up-group", "up")}>{upFlags}</div>
        )}
        {hasNeutralFlags && (
          <div className={getGroupClass("stat-group neutral-group", "neutral")}>{neutralFlags}</div>
        )}
        {hasDownFlags && (
          <div className={getGroupClass("stat-group trending-down-group", "down")}>{downFlags}</div>
        )}
      </div>
    </div>
  );
}

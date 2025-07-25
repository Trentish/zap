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

  // Group stat elements by trending up, neutral, and trending down
  const trendingUp: JSX.Element[] = [];
  const neutral: JSX.Element[] = [];
  const trendingDown: JSX.Element[] = [];

  if (value !== undefined && value !== null && value !== "") {
    const values = typeof value === "string" ? value.split(",") : [value];
    values.forEach((v, i) => {
      let str = String(v).trim();
      let className = "individual-stat-block";
      let codeClass = "";
      let trendType: "up" | "down" | "neutral" = "neutral";

      if (str.includes("▼")) {
        str = str.replace("▼", "").trim();
        className += " trending-down";
        trendType = "down";
      } else if (str.includes("▲")) {
        str = str.replace("▲", "").trim();
        className += " trending-up";
        trendType = "up";
      }

      // Check for country code (3 uppercase letters)
      const codeMatch = str.match(/^[A-Z]{3}$/i);
      if (codeMatch) {
        const code = str.toUpperCase();
        const nation = DEFCON_NATIONS.find((n) => n.code === code);
        if (nation) {
          codeClass = ` country-code-${code.toLowerCase()}`;
          // Instead of emoji, show flag image
          const flagImgSrc = `${config.gameImagePath}flags/${code.toLowerCase()}.svg`;
          const el = (
            <span key={i} className={className + codeClass}>
              <img
                src={flagImgSrc}
                alt={code}
                className="flag-img"
              />
            </span>
          );
          if (trendType === "up") {
            trendingUp.push(el);
          } else if (trendType === "down") {
            trendingDown.push(el);
          } else {
            neutral.push(el);
          }
          return; // skip emoji rendering
        }
      }
      // Default rendering (no flag image)
      const el = (
        <span key={i} className={className + codeClass}>
          {str}
        </span>
      );
      if (trendType === "up") {
        trendingUp.push(el);
      } else if (trendType === "down") {
        trendingDown.push(el);
      } else {
        neutral.push(el);
      }
    });
  }

  // Helper to get odd/even and count classes
  function getGroupClass(base: string, arr: JSX.Element[]) {
    const count = arr.length;
    const oddEven = count % 2 === 0 ? "contains-even" : "contains-odd";
    const countClass = `contains-${count}`;
    return `${base} ${oddEven} ${countClass}`;
  }

  return (
    <div className={`statView ${def.className}`}>
      {def.icon && <img className={"statIcon"} src={def.icon} />}
      {def.label && <div className={"statLabel"}>{def.label}</div>}
      <div className={"statValue"}>
        {trendingUp.length > 0 && (
          <div className={getGroupClass("stat-group trending-up-group", trendingUp)}>{trendingUp}</div>
        )}
        {neutral.length > 0 && (
          <div className={getGroupClass("stat-group neutral-group", neutral)}>{neutral}</div>
        )}
        {trendingDown.length > 0 && (
          <div className={getGroupClass("stat-group trending-down-group", trendingDown)}>{trendingDown}</div>
        )}
      </div>
    </div>
  );
}

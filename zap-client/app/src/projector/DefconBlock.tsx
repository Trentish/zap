import React from "react";
import { useAtom } from "jotai";
import { $allStats, $config } from "../ClientState.ts";
import { T_StatDef } from "../configs/BaseGameConfig.ts";
import { DEFCON_NATIONS } from "../../zap-shared/DEFCON_NATIONS";
import "./DefconBlock.css";

/**
 * Type definitions for better code clarity and type safety
 */
type TrendType = "up" | "down" | "neutral";
type FlagInfo = { trend: TrendType };

/**
 * Main DEFCON display component that renders all DEFCON alert levels.
 * Automatically finds and displays all stats with "defcon" in their className.
 */
export function DefconBlock() {
  const [config] = useAtom($config);

  // Filter config to find only DEFCON-related stat definitions
  const defconStats = config.statDefs
    .map((def, index) => ({ def, index }))
    .filter(({ def }) => def.className?.includes("defcon"));

  if (!defconStats.length) return null;

  return (
    <div className="defcon-block">
      {defconStats.map(({ def, index }) => (
        <DefconStatView key={`defcon-stat-${index}`} index={index} def={def} />
      ))}
    </div>
  );
}

/**
 * Parses a single value string to extract country code and trend direction.
 * Handles formats like "USA▲", "RUS▼", or "CHN" (neutral).
 */
function parseCountryValue(value: string): { code: string; trend: TrendType } | null {
  let str = value.trim();
  let trend: TrendType = "neutral";

  // Extract trend arrows and determine direction
  if (str.includes("▼")) {
    str = str.replace("▼", "").trim();
    trend = "down";
  } else if (str.includes("▲")) {
    str = str.replace("▲", "").trim();
    trend = "up";
  }

  // Validate country code format (3 uppercase letters)
  const codeMatch = str.match(/^[A-Z]{3}$/i);
  if (!codeMatch) return null;

  const code = str.toUpperCase();
  // Verify it's a real country in our DEFCON nations list
  const nation = DEFCON_NATIONS.find((n) => n.code === code);
  return nation ? { code, trend } : null;
}

/**
 * Parses stat value(s) into a map of active country flags with their trends.
 * Handles both single values and comma-separated lists.
 */
function parseActiveFlags(value: unknown): Map<string, FlagInfo> {
  const activeFlags = new Map<string, FlagInfo>();

  // Handle empty/null values
  if (value === undefined || value === null || value === "") {
    return activeFlags;
  }

  // Convert to array of string values (handles both single values and CSV)
  const values = typeof value === "string" ? value.split(",") : [String(value)];

  values.forEach((v) => {
    const parsed = parseCountryValue(String(v));
    if (parsed) {
      activeFlags.set(parsed.code, { trend: parsed.trend });
    }
  });

  return activeFlags;
}

/**
 * Renders a single DEFCON alert level view with country flags organized by trend.
 * Uses "always-present" architecture - all flags exist in DOM with CSS show/hide.
 */
function DefconStatView({ index, def }: { index: number; def: T_StatDef }) {
  const [allStats] = useAtom($allStats);
  const [config] = useAtom($config);

  // Parse current stat value to determine which flags are active
  const activeFlags = parseActiveFlags(allStats.values[index]);

  /**
   * Creates flag elements for a specific trend group.
   * All flags are always rendered - visibility controlled by CSS classes.
   */
  const createFlagsForGroup = (groupType: TrendType) => {
    return DEFCON_NATIONS.map((nation) => {
      const code = nation.code;
      const flagInfo = activeFlags.get(code);
      const isVisible = flagInfo?.trend === groupType;

      return (
        <span 
          key={code} 
          className={`individual-stat-block country-code-${code.toLowerCase()} ${
            isVisible ? 'flag-visible' : 'flag-hidden'
          }`}
        >
          <img
            src={`${config.gameImagePath}flags/${code.toLowerCase()}.svg`}
            alt={`${nation.name} flag`}
            className="flag-img"
          />
        </span>
      );
    });
  };

  // Pre-generate all flag groups (always-present DOM approach)
  const flagGroups = {
    up: createFlagsForGroup("up"),
    neutral: createFlagsForGroup("neutral"),
    down: createFlagsForGroup("down")
  };

  // Determine group visibility states
  const groupVisibility = {
    up: Array.from(activeFlags.values()).some(f => f.trend === "up"),
    neutral: Array.from(activeFlags.values()).some(f => f.trend === "neutral"),
    down: Array.from(activeFlags.values()).some(f => f.trend === "down")
  };

  // Check if this DEFCON level has any active flags
  const hasAnyFlags = Object.values(groupVisibility).some(Boolean);

  /**
   * Generates CSS classes for a trend group including count and visibility states.
   * Provides styling hooks for even/odd counts and specific numbers.
   */
  const getGroupClasses = (baseClass: string, groupType: TrendType, isVisible: boolean) => {
    const visibleCount = Array.from(activeFlags.values()).filter(f => f.trend === groupType).length;
    const evenOddClass = visibleCount % 2 === 0 ? "contains-even" : "contains-odd";
    const countClass = `contains-${visibleCount}`;
    const visibilityClass = isVisible ? "group-visible" : "group-hidden";
    
    return `${baseClass} ${evenOddClass} ${countClass} ${visibilityClass}`;
  };

  return (
    <div className={`statView ${def.className} ${!hasAnyFlags ? 'defcon-empty' : ''}`}>
      {def.icon && <img className="statIcon" src={def.icon} alt="DEFCON icon" />}
      {def.label && <div className="statLabel">{def.label}</div>}
      <div className="statValue">
        {/* All groups always rendered - CSS controls visibility and animations */}
        <div className={getGroupClasses("stat-group trending-up-group", "up", groupVisibility.up)}>
          {flagGroups.up}
        </div>
        <div className={getGroupClasses("stat-group neutral-group", "neutral", groupVisibility.neutral)}>
          {flagGroups.neutral}
        </div>
        <div className={getGroupClasses("stat-group trending-down-group", "down", groupVisibility.down)}>
          {flagGroups.down}
        </div>
      </div>
    </div>
  );
}

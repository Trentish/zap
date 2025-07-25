import React from "react";
import { useAtom } from "jotai";
import { $allStats, $config } from "../ClientState.ts";
import { T_StatDef } from "../configs/BaseGameConfig.ts";
import "./CorpBlock.css";

// Add realistic random cents to a price for display
function addRandomCents(price: number): string {
  const cents = Math.floor(Math.random() * 100);
  return price.toFixed(0) + "." + cents.toString().padStart(2, "0");
}

export function CorpBlock() {
  const [config] = useAtom($config);
  const [allStats] = useAtom($allStats);

  // Get corp stats
  const corpStats: { def: T_StatDef; index: number }[] = [];
  config.statDefs.forEach((def, index) => {
    if (!def.className || !def.className.includes("defcon")) {
      corpStats.push({ def, index });
    }
  });

  // Filter for corp stats with non-empty values
  const visibleCorpStats = corpStats.filter(({ index }) => {
    const value = allStats.values[index];
    return value !== undefined && value !== null && value !== "";
  });

  if (!visibleCorpStats.length) return null;

  // Ensure we have at least 8 corp stats for the flip animation
  // If we have fewer, we'll cycle through them
  const ensureMinimumStats = (stats: typeof visibleCorpStats) => {
    while (stats.length < 8) {
      stats = [...stats, ...stats.slice(0, Math.min(8 - stats.length, stats.length))];
    }
    return stats.slice(0, 8);
  };

  const paddedStats = ensureMinimumStats(visibleCorpStats);

  return (
    <div className={"corp-block corp-flip-container"}>
      {/* 4 flip cards, each showing 2 corp stats (front/back faces) */}
      {[0, 1, 2, 3].map(boxIndex => (
        <CorpFlipCard
          key={`flip-card-${boxIndex}`}
          boxIndex={boxIndex}
          frontCorpStat={paddedStats[boxIndex]} // Corps 1-4
          backCorpStat={paddedStats[boxIndex + 4]} // Corps 5-8
        />
      ))}
    </div>
  );
}

function CorpFlipCard({ 
  boxIndex, 
  frontCorpStat, 
  backCorpStat 
}: { 
  boxIndex: number; 
  frontCorpStat: { def: T_StatDef; index: number }; 
  backCorpStat: { def: T_StatDef; index: number }; 
}) {
  // Pure CSS animation - no JavaScript state or timing needed!
  return (
    <div className={`corp-flip-card corp-flip-card-${boxIndex}`}>
      <div className="corp-flip-inner">
        {/* Front face (Corps 1-4) */}
        <div className="corp-flip-face corp-flip-front">
          <CorpSparklineView 
            index={frontCorpStat.index} 
            def={frontCorpStat.def} 
          />
        </div>
        
        {/* Back face (Corps 5-8) */}
        <div className="corp-flip-face corp-flip-back">
          <CorpSparklineView 
            index={backCorpStat.index} 
            def={backCorpStat.def} 
          />
        </div>
      </div>
    </div>
  );
}

function CorpSparklineView({ index, def }: { index: number; def: T_StatDef }) {
  const [allStats] = useAtom($allStats);

  const value = allStats.values[index];
  if (!value || typeof value !== "string") return null;

  // Parse CSV to get numeric values
  const nums = value
    .split(",")
    .map((s) => parseFloat(s.trim()))
    .filter((n) => !isNaN(n));

  if (nums.length === 0) return null;

  const latestPrice = nums[nums.length - 1];
  
  // Determine trend
  let trendClass = "no-trend";
  let trendSymbol = "▶"; // Default neutral arrow
  if (nums.length >= 2) {
    const previousPrice = nums[nums.length - 2];
    if (latestPrice > previousPrice) {
      trendClass = "trending-up";
      trendSymbol = "▲";
    } else if (latestPrice < previousPrice) {
      trendClass = "trending-down";
      trendSymbol = "▼";
    }
  }

  // Toggle between spiky and accurate sparklines
  const useSpikySparklines = true; // Set to false for accurate/linear sparklines

  return (
    <div className={`corp-sparkline-stat ${trendClass}`}>
      <div className="corp-label">{def.label}</div>
      <div className="corp-price">{addRandomCents(latestPrice)}</div>
      <div className="corp-trend">{trendSymbol}</div>
      {useSpikySparklines ? (
        <CorpSparklineSpiky csv={value} />
      ) : (
        <CorpSparklineAccurate csv={value} />
      )}
    </div>
  );
}

function CorpSparklineAccurate({ csv }: { csv: string }) {
  if (!csv) return null;
  const nums = csv
    .split(",")
    .map((s) => parseFloat(s))
    .filter((n) => !isNaN(n));
  if (nums.length < 2) return null;
  
  // SVG dimensions - the sparkline will fill this entire area edge-to-edge
  const svgWidth = 192;
  const svgHeight = 20;
  const lineWidth = 3;
  
  // Calculate available drawing area (account for line width to prevent clipping)
  const halfLineWidth = lineWidth / 2;
  const drawWidth = svgWidth - lineWidth; // Leave space for stroke on both edges
  const drawHeight = svgHeight - lineWidth; // Leave space for stroke on top/bottom
  const offsetX = halfLineWidth; // Start drawing offset from left edge
  const offsetY = halfLineWidth; // Start drawing offset from top edge
  
  // Normalize data points to fit the drawing area exactly
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const range = max - min || 1;
  
  const points = nums.map((n, i) => [
    offsetX + (i / (nums.length - 1)) * drawWidth, // X: spread across safe drawing width
    offsetY + drawHeight - ((n - min) / range) * drawHeight, // Y: full safe height, inverted
  ]);
  
  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="corp-sparkline-svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <polyline
        fill="none"
        strokeWidth={lineWidth}
        points={points.map((p) => p.join(",")).join(" ")}
      />
    </svg>
  );
}

function CorpSparklineSpiky({ csv }: { csv: string }) {
  if (!csv) return null;
  const nums = csv
    .split(",")
    .map((s) => parseFloat(s))
    .filter((n) => !isNaN(n));
  if (nums.length < 2) return null;
  
  // SVG dimensions - the sparkline will fill this entire area edge-to-edge
  const svgWidth = 192;
  const svgHeight = 20;
  const lineWidth = 3;
  const intermediateCount = 5; // Number of spiky points between each pair of actual data points
  
  // Generate spiky intermediate points between each pair of actual data points
  const spikyNums: number[] = [];
  
  for (let i = 0; i < nums.length; i++) {
    spikyNums.push(nums[i]); // Add the actual data point
    
    // Add intermediate spiky points (except after the last point)
    if (i < nums.length - 1) {
      const current = nums[i];
      const next = nums[i + 1];
      const trend = next - current; // Overall trend between these points
      const trendStep = trend / (intermediateCount + 1); // How much trend per step
      
      for (let j = 1; j <= intermediateCount; j++) {
        // Calculate base interpolated value following the trend
        const baseValue = current + (trendStep * j);
        
        // Add random spikiness (±20% of the trend magnitude, or ±5% of current value if trend is small)
        const spikeRange = Math.max(Math.abs(trend) * 0.2, Math.abs(current) * 0.05);
        const spike = (Math.random() - 0.5) * 2 * spikeRange;
        
        spikyNums.push(baseValue + spike);
      }
    }
  }
  
  // Calculate available drawing area (account for line width to prevent clipping)
  const halfLineWidth = lineWidth / 2;
  const drawWidth = svgWidth - lineWidth; // Leave space for stroke on both edges
  const drawHeight = svgHeight - lineWidth; // Leave space for stroke on top/bottom
  const offsetX = halfLineWidth; // Start drawing offset from left edge
  const offsetY = halfLineWidth; // Start drawing offset from top edge
  
  // Normalize spiky data points to fit the drawing area exactly
  const min = Math.min(...spikyNums);
  const max = Math.max(...spikyNums);
  const range = max - min || 1;
  
  const points = spikyNums.map((n, i) => [
    offsetX + (i / (spikyNums.length - 1)) * drawWidth, // X: spread across safe drawing width
    offsetY + drawHeight - ((n - min) / range) * drawHeight, // Y: full safe height, inverted
  ]);
  
  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="corp-sparkline-svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <polyline
        fill="none"
        strokeWidth={lineWidth}
        points={points.map((p) => p.join(",")).join(" ")}
      />
    </svg>
  );
}

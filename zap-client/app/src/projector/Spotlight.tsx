import React, { useEffect, useRef, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { atom } from "jotai";
import "./Spotlight.css";
import { $config, $spotlightArticle, $store } from "../ClientState.ts";
import { BackgroundVideo, Video } from "../components/VideoComponents.tsx";
import {
  INTRO_MID_DEFAULT,
  OUTRO_MID_DEFAULT,
  T_Org,
  T_SpotlightRefs,
} from "../configs/BaseGameConfig.ts";
import { Audio } from "../components/AudioComponents.tsx";
import { updateArticleText } from "../lib/textFitting.ts";

const LOG = true;

// TEMPORARY DEBUG FLAG - SET TO TRUE TO KEEP SPOTLIGHT VISIBLE - REMOVE LATER
const DEBUG_KEEP_VISIBLE = false;

// TEMPORARY DEBUG FLAG - SET TO TRUE TO SHOW "BREAKING NEWS" WHEN NO LOCATION - REMOVE LATER
const USE_BREAKING_NEWS_FALLBACK = true;

// Types for spotlight configuration
type SpotlightConfig = {
  "spotlight-carrier-class": string;
  "spotlight-background-video-src": string;
  "left-feature-video-src": string;
  "right-feature": {
    type: "img" | "video";
    source: string;
  };
};

// Types for defaults JSON structure
type DefaultAssets = {
  widescreenBackgrounds: string[];
  talkingHeads: string[];
  listeningHeads: string[];
};

// Types for themed content JSON structure
type ThemedContent = {
  regex: string;
  features: string[];
};

// Load defaults from JSON file
const loadDefaults = async (): Promise<DefaultAssets> => {
  try {
    const response = await fetch('/assets/features/defaults.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch defaults.json: ${response.status} ${response.statusText}`);
    }
    const defaults = await response.json();
    return defaults;
  } catch (error) {
    console.error('🚨 CRITICAL ERROR: Failed to load defaults.json:', error);
    // Show user-facing error message
    alert('SYSTEM ERROR: Could not load spotlight configuration file (defaults.json). Please check that the file exists and is accessible.');
    // Re-throw to stop execution
    throw error;
  }
};

// Load themed content from JSON file
const loadThemedContent = async (): Promise<ThemedContent[]> => {
  try {
    const response = await fetch('/assets/features/themed/themed.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch themed.json: ${response.status} ${response.statusText}`);
    }
    const themed = await response.json();
    return themed;
  } catch (error) {
    console.error('🚨 CRITICAL ERROR: Failed to load themed.json:', error);
    // Show user-facing error message
    alert('SYSTEM ERROR: Could not load themed content configuration file (themed.json). Please check that the file exists and is accessible.');
    // Re-throw to stop execution
    throw error;
  }
};

// Function to analyze headline and return spotlight configuration
const getSpotlightConfig = async (headline: string, location?: string): Promise<SpotlightConfig> => {
  console.log(`🔦 Analyzing headline: "${headline}" with location: "${location}"`);
  
  // Load both JSON files
  const defaults = await loadDefaults();
  const themedContent = await loadThemedContent();
  
  // Base path for assets
  const basePath = "/assets/features/";
  const themedBasePath = "/assets/features/themed/";
  
  // Default background video - only changed if we get talking-background class
  let selectedBackgroundVideo = "/assets/videos/insanity/12676946_3840_2160_30fps.mp4";
  
  // Convert relative paths to full paths
  const widescreenBackgroundSources = defaults.widescreenBackgrounds.map(filename => basePath + filename);
  const talkingHeadVideoSources = defaults.talkingHeads.map(filename => basePath + filename);
  const listeningHeadVideoSources = defaults.listeningHeads.map(filename => basePath + filename);
  
  // Function to determine file type from extension
  const getFileType = (filename: string): "img" | "video" => {
    const extension = filename.toLowerCase().split('.').pop();
    return extension === 'mp4' ? 'video' : 'img';
  };
  
  // Function to find themed content match
  const findThemedMatch = (searchText: string): { type: "img" | "video"; source: string } | null => {
    for (const item of themedContent) {
      const regex = new RegExp(item.regex, 'i'); // Case insensitive
      if (regex.test(searchText)) {
        // Found a match! Randomly select from features
        const selectedFeature = item.features[Math.floor(Math.random() * item.features.length)];
        const fullPath = themedBasePath + selectedFeature;
        console.log(`🎯 THEMED MATCH: "${item.regex}" matched "${searchText}" -> ${selectedFeature}`);
        return {
          type: getFileType(selectedFeature),
          source: fullPath
        };
      }
    }
    return null;
  };
  
  // Try to find themed content match
  let themedMatch: { type: "img" | "video"; source: string } | null = null;
  
  // First try location if it exists
  if (location) {
    console.log(`🔍 Trying location match: "${location}"`);
    themedMatch = findThemedMatch(location);
  }
  
  // If no location match, try headline
  if (!themedMatch) {
    console.log(`🔍 Trying headline match: "${headline}"`);
    themedMatch = findThemedMatch(headline);
  }
  
  // Report feature hit status
  if (themedMatch) {
    console.log(`✅ FEATURE HIT! Found themed content: ${themedMatch.type} - ${themedMatch.source}`);
  } else {
    console.log(`❌ NO FEATURE HIT - Using default content`);
  }
  
  // Determine layout type based on whether we found a themed match
  let carrierClasses: string[];
  let randomLeftFeatureVideo: string;
  let randomRightFeature: { type: "img" | "video"; source: string };
  
  if (themedMatch) {
    // Found themed content - use --feature-- layouts
    console.log(`🎨 Using FEATURE layouts with themed content: ${themedMatch.type} ${themedMatch.source}`);
    carrierClasses = [
      "feature-type--feature--full-background",
      // "feature-type--feature--talking-with-subject-on-right", 
      // "feature-type--feature--above-chyron",
    ];
    
    // Don't set randomRightFeature here - we'll set it based on the selected layout
    
  } else {
    // No themed match - use --default-- layouts
    console.log(`🔄 Using DEFAULT layouts (no themed match found)`);
    carrierClasses = [
      "feature-type--default--talking-background",
      "feature-type--default--two-people-talking",
      // "feature-type--default--above-chyron",
    ];
    
    // Initialize empty right feature for non-themed content
    randomRightFeature = { type: "img" as const, source: "" };
  }
  
  // Random selection of layout class
  const randomCarrierClass = carrierClasses[Math.floor(Math.random() * carrierClasses.length)];
  console.log(`🎨 SELECTED THEME CLASS: "${randomCarrierClass}"`);
  
  // Configure background video and features based on layout type
  if (randomCarrierClass === "feature-type--feature--full-background") {
    // Full background: use themed content as the background video (if video) or keep default background with full-screen image overlay
    if (themedMatch && themedMatch.type === "video") {
      selectedBackgroundVideo = themedMatch.source;
      console.log(`🎬 Using themed video as full background: ${themedMatch.source}`);
      randomRightFeature = { type: "img" as const, source: "" };
    } else if (themedMatch && themedMatch.type === "img") {
      // For images in full-background, keep default background but put image in right-feature for full-screen Ken Burns
      console.log(`🖼️ Using themed image as full-screen overlay: ${themedMatch.source}`);
      randomRightFeature = themedMatch;
    } else {
      randomRightFeature = { type: "img" as const, source: "" };
    }
  } else if (randomCarrierClass === "feature-type--default--talking-background") {
    // Default talking background uses special background videos
    selectedBackgroundVideo = widescreenBackgroundSources[Math.floor(Math.random() * widescreenBackgroundSources.length)];
    // No right feature needed for talking background layout
    randomRightFeature = { type: "img" as const, source: "" };
  } else {
    // For other layouts (feature layouts with right-feature areas), use themed content if available
    if (themedMatch) {
      randomRightFeature = themedMatch;
    } else {
      randomRightFeature = { type: "img" as const, source: "" };
    }
  }
  
  // Configure left feature based on layout type
  if (randomCarrierClass === "feature-type--default--two-people-talking") {
    // Two people talking: talking head on left, listening head on right
    randomLeftFeatureVideo = talkingHeadVideoSources[Math.floor(Math.random() * talkingHeadVideoSources.length)];
    randomRightFeature = {
      type: "video" as const,
      source: listeningHeadVideoSources[Math.floor(Math.random() * listeningHeadVideoSources.length)]
    };
  } else if (randomCarrierClass !== "feature-type--feature--full-background" && randomCarrierClass !== "feature-type--default--talking-background") {
    // Other feature layouts: use talking head on left, themed content on right
    randomLeftFeatureVideo = talkingHeadVideoSources[Math.floor(Math.random() * talkingHeadVideoSources.length)];
    // randomRightFeature is already set above based on themed match or empty default
  } else {
    // For full-background and talking-background, still need left feature for some layouts
    randomLeftFeatureVideo = talkingHeadVideoSources[Math.floor(Math.random() * talkingHeadVideoSources.length)];
  }

  console.log(`🔦 FINAL CONFIG: ${randomCarrierClass} | Right: ${randomRightFeature.type} ${randomRightFeature.source}`);
  console.log(`🔦 BACKGROUND: ${selectedBackgroundVideo}`);
  console.log(`🔦 LEFT: ${randomLeftFeatureVideo}`);

  return {
    "spotlight-carrier-class": randomCarrierClass,
    "spotlight-background-video-src": selectedBackgroundVideo,
    "left-feature-video-src": randomLeftFeatureVideo,
    "right-feature": randomRightFeature
  };
};

const $spotlightOrg = atom<T_Org | null>(null);

const SHOW = (element: HTMLElement | null) => element?.classList.add("show");
const HIDE = (element: HTMLElement | null) => element?.classList.remove("show");
const ADD_CLASS = (element: HTMLElement | null, c: string) =>
  element?.classList.add(c);
const REMOVE_CLASS = (element: HTMLElement | null, c: string) =>
  element?.classList.remove(c);
const PLAY = (mediaEl: HTMLVideoElement | HTMLAudioElement | null) => {
  if (mediaEl && mediaEl.src) mediaEl.play().then().catch(); // TODO: fix error when empty audio
};
const SET_VID = (videoEl: HTMLVideoElement | null, src: string | undefined) => {
  if (videoEl && src) {
    videoEl.src = ""; // Clear first to force restart
    videoEl.src = src;
  }
};
const SET_AUD = (
  audioEl: HTMLAudioElement | null,
  src: string | undefined,
  volume = 1
) => {
  if (audioEl && src) {
    audioEl.src = src;
    audioEl.volume = volume;
  }
};
const SET_TEXT = (element: HTMLDivElement | null, text: string) => {
  if (element) element.innerText = text;
};

export function Spotlight() {
  const [article] = useAtom($spotlightArticle);
  const [config] = useAtom($config);
  const [currentSpotlightConfig, setCurrentSpotlightConfig] = useState<SpotlightConfig | null>(null);

  const spotlightContainerRef = useRef<HTMLDivElement>(null);
  const spotlightBackgroundRef = useRef<HTMLVideoElement>(null);
  // const spotlightOverlayRef = useRef<HTMLVideoElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const introAudioRef = useRef<HTMLAudioElement>(null);
  const outroVideoRef = useRef<HTMLVideoElement>(null);
  const outroAudioRef = useRef<HTMLAudioElement>(null);
  const carrierRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const refs: T_SpotlightRefs = useMemo(
    () => ({
      spotlightContainerRef: spotlightContainerRef,
      spotlightBackgroundRef: spotlightBackgroundRef,
      // spotlightOverlayRef: spotlightOverlayRef,
      introVideoRef: introVideoRef,
      introAudioRef: introAudioRef,
      outroVideoRef: outroVideoRef,
      outroAudioRef: outroAudioRef,
      carrierRef: carrierRef,
      themeRef: themeRef,
      headlineRef: headlineRef,
      locationRef: locationRef,
    }),
    []
  );

  if (LOG) console.log(`🔦 render: Spotlight`, article);

  useEffect(() => {
    const spotlightContainer = spotlightContainerRef.current;
    const background = spotlightBackgroundRef.current;
    // const overlay = spotlightOverlayRef.current;
    const introVideo = introVideoRef.current;
    const introAudio = introAudioRef.current;
    const outroVideo = outroVideoRef.current;
    const outroAudio = outroAudioRef.current;
    const carrier = carrierRef.current;
    const theme = themeRef.current;
    const headline = headlineRef.current;
    const location = locationRef.current;

    if (article) {
      //## article ENTER
      if (LOG) console.log(`🔦 useEffect: Spotlight,  article ENTER`, article);

      // Analyze headline and get spotlight configuration (now async)
      getSpotlightConfig(article.headline, article.location).then(spotlightConfig => {
        console.log(`🔦 SPOTLIGHT CONFIG:`, spotlightConfig);

        const org = config.GetOrg(article);
        $store.set($spotlightOrg, org);

        ADD_CLASS(spotlightContainer, org.cssClass || org.id);
        ADD_CLASS(carrier, spotlightConfig["spotlight-carrier-class"]);

        // Use config-determined sources instead of org defaults
        SET_VID(background, spotlightConfig["spotlight-background-video-src"]);
        SET_VID(introVideo, org.introVideo);
        SET_AUD(introAudio, org.introAudio, org.introVolume);
        SET_VID(outroVideo, org.outroVideo);
        SET_AUD(outroAudio, org.outroAudio, org.outroVolume);
        // SET_VID(overlay, org.overlayVideo);
        SET_TEXT(theme, org.label);
        SET_TEXT(location, article.location || (USE_BREAKING_NEWS_FALLBACK ? "BREAKING NEWS" : ""));

        // Store config for later use in JSX
        setCurrentSpotlightConfig(spotlightConfig);

        SHOW(introVideo);
        PLAY(introVideo);

        const introVideoTimer = setTimeout(() => {
          if (LOG) console.log(`🔦 useEffect: Spotlight,  intro mid`);
          SHOW(introVideo);
          SHOW(background);
          // SHOW(overlay);
          SHOW(carrier);

          // Apply text fitting AFTER carrier is shown and has dimensions
          console.log("🔦 Spotlight headline debug (after carrier shown):", {
            headline,
            headlineExists: !!headline,
          });
          if (headline) {
            const headlineTextElement = headline.querySelector(
              ".chyron-text"
            ) as HTMLElement;
            const headlineContainerElement = headline.querySelector(
              ".chyron-container"
            ) as HTMLElement;
            console.log("🔦 Headline elements debug:", {
              headlineTextElement,
              textElementExists: !!headlineTextElement,
              headlineContainerElement,
              containerElementExists: !!headlineContainerElement,
            });
            if (headlineTextElement && headlineContainerElement) {
              console.log(
                "🔦 About to call updateArticleText with:",
                article.headline
              );
              console.log(
                "🔦 Using container dimensions:",
                headlineContainerElement.offsetWidth,
                "x",
                headlineContainerElement.offsetHeight
              );
              // Small delay to ensure carrier is fully visible and sized
              setTimeout(() => {
                updateArticleText(
                  headlineTextElement,
                  headlineContainerElement,
                  article.headline
                );
              }, 50);
            } else {
              console.error(
                "🔦 ERROR: .chyron-text or .chyron-container not found in headline element"
              );
            }
          } else {
            console.error("🔦 ERROR: headline ref is null");
          }

          config.OnStart_Spotlight(article, refs);
        }, org.introMidMs || INTRO_MID_DEFAULT);

        const introAudioTimer = setTimeout(() => {
          PLAY(introAudio);
        }, org.introAudioDelay || 0);
      });

      return () => {
        if (LOG) console.log(`🔦 useEffect: Spotlight,  ENTER cleanup`);
        // Note: cleanup for timers will need to be handled differently with async
      }; //>> started spotlight
    }

    // not useAtom because we don't want it to trigger a new render
    const prevOrg = $store.get($spotlightOrg);

    if (!prevOrg) {
      if (LOG) console.log(`🔦 useEffect: Spotlight,  no prevOrg`);
      return; //>> was not playing a spotlight
    }

    //## spotlight EXIT
    if (LOG) console.log(`🔦 useEffect: Spotlight,  spotlight EXIT`);

    // TEMPORARY DEBUG - Skip exit if debug flag is set
    if (DEBUG_KEEP_VISIBLE) {
      if (LOG)
        console.log(`🔦 DEBUG: Keeping spotlight visible, skipping exit`);
      return; // Skip the entire exit sequence
    }

    SHOW(outroVideo);
    PLAY(outroVideo);

    const outroVideoTimer = setTimeout(() => {
      if (LOG) console.log(`🔦 useEffect: Spotlight,  outro mid`);

      HIDE(background);
      // HIDE(overlay);
      HIDE(carrier);
    }, prevOrg.outroMidMs || OUTRO_MID_DEFAULT);

    const outroAudioTimer = setTimeout(() => {
      PLAY(outroAudio);
    }, prevOrg.outroAudioDelay || 0);

    return () => {
      if (LOG) console.log(`🔦 useEffect: Spotlight,  EXIT cleanup`);
      clearTimeout(outroVideoTimer);
      clearTimeout(outroAudioTimer);
      REMOVE_CLASS(spotlightContainer, prevOrg.cssClass || prevOrg.id);
      HIDE(background);
      // HIDE(overlay);
      HIDE(introVideo);
      HIDE(outroVideo);
      HIDE(carrier);
    }; //>> triggered outro
  }, [article, config, refs]);

  return (
    <>
      {/* TEMPORARY DEBUG BUTTON - REMOVE LATER */}
      {/* <button
        onClick={handleChyronRecalc}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: "#FFCC00",
          border: "none",
          padding: "10px",
          fontSize: "5vmin",
          fontWeight: "bold",
          cursor: "pointer",
          color: "black",
        }}
      >
        RECALC
      </button> */}

      <div
        ref={spotlightContainerRef}
        className={`spotlight-container`}
        id={"spotlight"}
      >

        <Video src={``} className={"intro"} ref={introVideoRef} />

        <Audio src={``} ref={introAudioRef} />

        <Video src={``} className={"outro"} ref={outroVideoRef} />

        <Audio src={``} ref={outroAudioRef} />

        <div className={`spotlight-carrier ${currentSpotlightConfig?.["spotlight-carrier-class"] || "feature-type--small-left-wide-right"}`} ref={carrierRef}>
          {/* TEMPORARY: Using CNN screenshot instead of background video */}
          {/* <img
            src="../assets/images/insanity/cnn_screengrab.png"
            className="spotlight-background"
            alt="CNN Background"
          /> */}

          {/* COMMENTED OUT: Background video - will restore later */}
          <BackgroundVideo
			src={``}
			className={"spotlight-background"}
			ref={spotlightBackgroundRef}
			/>

          <div className={"left-feature-placeholder"}>
            {/* Left feature video placeholder */}
            <video
              src={currentSpotlightConfig?.["left-feature-video-src"] || "/assets/features/defaultLeft.mp4"}
              autoPlay
              loop
              muted
              className="left-feature-video"
            />
          </div>
          <div className={"right-feature-placeholder"}>
            {/* Right feature video/image placeholder - dynamic based on config */}
            {currentSpotlightConfig?.["right-feature"].source ? (
              currentSpotlightConfig["right-feature"].type === "video" ? (
                <video
                  src={currentSpotlightConfig["right-feature"].source}
                  autoPlay
                  loop
                  muted
                  className="right-feature-video"
                />
              ) : (
                <img
                  src={currentSpotlightConfig["right-feature"].source}
                  className="right-feature-image"
                  alt="Feature content"
                />
              )
            ) : null}
          </div>
          <div className={"chyron-wrapper"}>
            {(article?.location || USE_BREAKING_NEWS_FALLBACK) && (
              <div className={"spotlight-carrier-location"} ref={locationRef}>
                {""}
              </div>
            )}
            <div className="chyron-outer" ref={headlineRef}>
              <div className="chyron-container">
                <div className="chyron-text"></div>
              </div>
            </div>
          </div>
          {/* <div className={"logo-wrapper"}>
            <img src="/assets/images/insanity/logo-gnn-red.svg" alt="GNN" />
          </div> */}
          <div className={"spotlight-carrier-theme"} ref={themeRef}>
            {""}
          </div>
        </div>
      </div>
    </>
  );
}

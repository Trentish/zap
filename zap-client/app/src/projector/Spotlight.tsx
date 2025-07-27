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
  "spotlight-background-src": string;
  "left-feature-video-src": string;
  "right-feature": {
    type: "img" | "video";
    source: string;
  };
};

// Function to analyze headline and return spotlight configuration
const analyzeSpotlightConfig = (headline: string, location?: string): SpotlightConfig => {
  // TODO: Replace with intelligent analysis later
  // For now, randomly select configuration options
  
  // Default background - only changed if we get background-feature class
  let selectedBackground = "/assets/videos/insanity/12676946_3840_2160_30fps.mp4";
  
  const carrierClasses = [
    // "background-feature",
    "left-right-features", 
    // "left-feature-only",
    // "two-features"
  ];
  
  const backgroundFeatureSources = [
    "/assets/videos/insanity/talkingHeads/wide/ronBurgundy.mp4"
  ];
  
  const leftFeatureVideoSources = [
    "/assets/videos/insanity/talkingHeads/square/testHead.mp4",
    "/assets/videos/insanity/talkingHeads/square/ronBurgundy.mp4",
	"/assets/videos/insanity/talkingHeads/square/dude1.mp4",
	"/assets/videos/insanity/talkingHeads/square/jakeTapper.mp4"
  ];
  
  const rightFeatureOptions = [
    { type: "video" as const, source: "/assets/videos/insanity/features/mars.mp4" },
    // { type: "video" as const, source: "/assets/videos/insanity/talkingHeads/square/testHead.mp4" },
    // { type: "img" as const, source: "/assets/images/insanity/cnn_screengrab.png" }
  ];
  
  // Random selection for now
  const randomCarrierClass = carrierClasses[Math.floor(Math.random() * carrierClasses.length)];
  
  // Only change background if we got background-feature class
  if (randomCarrierClass === "background-feature") {
    selectedBackground = backgroundFeatureSources[Math.floor(Math.random() * backgroundFeatureSources.length)];
  }
  
  const randomLeftFeatureVideo = leftFeatureVideoSources[Math.floor(Math.random() * leftFeatureVideoSources.length)];
  const randomRightFeature = rightFeatureOptions[Math.floor(Math.random() * rightFeatureOptions.length)];
  
  console.log(`🔦 SPOTLIGHT CONFIG: Analyzed "${headline}" -> ${randomCarrierClass}`);
  
  return {
    "spotlight-carrier-class": randomCarrierClass,
    "spotlight-background-src": selectedBackground,
    "left-feature-video-src": randomLeftFeatureVideo,
    "right-feature": randomRightFeature
  };
};

// TEMPORARY TEST HEADLINES FOR DEBUGGING - REMOVE LATER
const testHeadlines = [
  "BREAKING: Markets crash today", // ~30 chars
  "URGENT: President announces new economic policy", // ~50 chars  
  "DEVELOPING: Major earthquake strikes coastal region, evacuations underway", // ~70 chars
  "EXCLUSIVE: Investigation reveals corruption scandal involving multiple government officials nationwide", // ~100 chars
  "LIVE: International summit begins as world leaders gather to discuss climate change and economic cooperation agreements", // ~120 chars
  "ALERT: Massive cyberattack targets critical infrastructure across multiple countries, causing widespread disruptions to power grids and communication networks", // ~150 chars
  "UNPRECEDENTED: Global health emergency declared as new pandemic strain emerges, prompting immediate lockdown measures and international travel restrictions while scientists race to develop updated vaccines", // ~200 chars
];

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
  if (videoEl && src) videoEl.src = src;
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




  // TEMPORARY DEBUG FUNCTION - REMOVE LATER
  const handleChyronRecalc = () => {
    const headline = headlineRef.current;
    if (headline) {
      const headlineTextElement = headline.querySelector(
        ".chyron-text"
      ) as HTMLElement;
      const headlineContainerElement = headline.querySelector(
        ".chyron-container"
      ) as HTMLElement;

      if (headlineTextElement && headlineContainerElement) {
        // Cycle through test headlines - shift one off and push to end
        const testText = testHeadlines.shift() || "DEFAULT TEST TEXT";
        testHeadlines.push(testText);
        
        console.log(
          "🔦 DEBUG: Force recalculating chyron text fitting with:",
          testText,
          `(${testText.length} chars)`
        );

        // Trigger the text fitting algorithm
        updateArticleText(
          headlineTextElement,
          headlineContainerElement,
          testText
        );
      } else {
        console.error(
          "🔦 DEBUG ERROR: .chyron-text or .chyron-container not found"
        );
      }
    } else {
      console.error("🔦 DEBUG ERROR: headline ref is null");
    }
  };

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

      // Analyze headline and get spotlight configuration
      const spotlightConfig = analyzeSpotlightConfig(article.headline, article.location);
      console.log(`🔦 SPOTLIGHT CONFIG:`, spotlightConfig);

      const org = config.GetOrg(article);
      $store.set($spotlightOrg, org);

      ADD_CLASS(spotlightContainer, org.cssClass || org.id);
      ADD_CLASS(carrier, spotlightConfig["spotlight-carrier-class"]);

      // Use config-determined sources instead of org defaults
      SET_VID(background, spotlightConfig["spotlight-background-src"]);
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

      return () => {
        if (LOG) console.log(`🔦 useEffect: Spotlight,  ENTER cleanup`);
        clearTimeout(introVideoTimer);
        clearTimeout(introAudioTimer);
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

        <div className={`spotlight-carrier ${currentSpotlightConfig?.["spotlight-carrier-class"] || "left-right-features"}`} ref={carrierRef}>
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
              src={currentSpotlightConfig?.["left-feature-video-src"] || "/assets/videos/insanity/talkingHeads/square/ronBurgundy.mp4"}
              autoPlay
              loop
              muted
              className="left-feature-video"
            />
          </div>
          <div className={"right-feature-placeholder"}>
            {/* Right feature video/image placeholder - dynamic based on config */}
            {currentSpotlightConfig?.["right-feature"].type === "video" ? (
              <video
                src={currentSpotlightConfig["right-feature"].source}
                autoPlay
                loop
                muted
                className="right-feature-video"
              />
            ) : (
              <img
                src={currentSpotlightConfig?.["right-feature"].source || "/assets/videos/insanity/features/mars.mp4"}
                className="right-feature-image"
                alt="Feature content"
              />
            )}
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

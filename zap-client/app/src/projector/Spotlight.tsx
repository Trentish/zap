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
import {
  generateSpotlightConfig,
  SpotlightConfig,
  SpotlightLayoutType,
} from "../lib/spotlightConfig.ts";

const LOG = true;

// TEMPORARY DEBUG FLAG - SET TO TRUE TO KEEP SPOTLIGHT VISIBLE - REMOVE LATER
const DEBUG_KEEP_VISIBLE = true;

// TEMPORARY DEBUG FLAG - SET TO TRUE TO SHOW "BREAKING NEWS" WHEN NO LOCATION - REMOVE LATER
const USE_BREAKING_NEWS_FALLBACK = true;

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

// Function to convert layout type enum to CSS class
const getCarrierCSSClass = (layoutType: SpotlightLayoutType): string => {
  switch (layoutType) {
    case SpotlightLayoutType.FEATURE_FULL_BACKGROUND:
      return "feature-type--feature--full-background";
    case SpotlightLayoutType.FEATURE_TALKING_WITH_SUBJECT_ON_RIGHT:
      return "feature-type--feature--talking-with-subject-on-right";
    case SpotlightLayoutType.FEATURE_ABOVE_CHYRON:
      return "feature-type--feature--above-chyron";
    case SpotlightLayoutType.DEFAULT_TWO_PEOPLE_TALKING:
      return "feature-type--default--two-people-talking";
    case SpotlightLayoutType.DEFAULT_ABOVE_CHYRON:
      return "feature-type--default--above-chyron";
    case SpotlightLayoutType.DEFAULT_TALKING_BACKGROUND:
    default:
      return "feature-type--default--talking-background";
  }
};

export function Spotlight() {
  const [article] = useAtom($spotlightArticle);
  const [config] = useAtom($config);
  const [currentSpotlightConfig, setCurrentSpotlightConfig] =
    useState<SpotlightConfig | null>(null);

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
      generateSpotlightConfig(article.headline, article.location).then(
        (spotlightConfig: SpotlightConfig) => {
          console.log(`🔦 SPOTLIGHT CONFIG:`, spotlightConfig);

          const org = config.GetOrg(article);
          $store.set($spotlightOrg, org);

          ADD_CLASS(spotlightContainer, org.cssClass || org.id);
          ADD_CLASS(carrier, getCarrierCSSClass(spotlightConfig.layoutType));

          // Use config-determined sources instead of org defaults
          SET_VID(
            background,
            spotlightConfig["spotlight-background-video-src"]
          );
          SET_VID(introVideo, org.introVideo);
          SET_AUD(introAudio, org.introAudio, org.introVolume);
          SET_VID(outroVideo, org.outroVideo);
          SET_AUD(outroAudio, org.outroAudio, org.outroVolume);
          // SET_VID(overlay, org.overlayVideo);
          SET_TEXT(theme, org.label);
          SET_TEXT(
            location,
            article.location ||
              (USE_BREAKING_NEWS_FALLBACK ? "BREAKING NEWS" : "")
          );

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
        }
      );

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

        <div
          className={`spotlight-carrier ${
            currentSpotlightConfig
              ? getCarrierCSSClass(currentSpotlightConfig.layoutType)
              : "feature-type--small-left-wide-right"
          }`}
          ref={carrierRef}
        >
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
              src={
                currentSpotlightConfig?.["left-feature-video-src"] ||
                "/assets/features/defaultLeft.mp4"
              }
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

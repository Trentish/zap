import { ArticleDat } from "../../zap-shared/_Dats.ts";
import { Timer } from "../displays/Timer.tsx";
import { atom, useAtom } from "jotai";
import "./ProjectorPage.css";
import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  $config,
  $situation,
  $splitArticles,
  $spotlight,
  $spotlightArticle,
  $store,
  $timer,
  $timerAudioRef,
} from "../ClientState.ts";
import { Atom } from "jotai/vanilla/atom";
import { clsx } from "clsx";
import { Crawler } from "./Crawler.tsx";
import { useClient } from "../ClientContext.ts";
import { BackgroundVideo, Video } from "../components/VideoComponents.tsx";
import {
  INTRO_MID_DEFAULT,
  OUTRO_MID_DEFAULT,
  T_Org,
  T_SpotlightRefs,
} from "../configs/BaseGameConfig.ts";
import { Audio } from "../components/AudioComponents.tsx";
import { TopStories } from "./TopStories.tsx";
import { CorpBlock } from "./CorpBlock.tsx";
import { DefconBlock } from "./DefconBlock.tsx";
import { updateArticleText } from "../lib/textFitting.ts";

const SHOW_LAST_COUNT = 7;
const LOG = true;

const $spotlightOrg = atom<T_Org | null>(null);

export function ProjectorPage() {
  console.log(`rerender ProjectorPage`);
  const client = useClient();
  const [config] = useAtom($config);
  const [situation] = useAtom($situation);

  const timerAudioRef = useRef<HTMLAudioElement>(null);
  $store.set($timerAudioRef, timerAudioRef);

  return (
    <div
      id={"projectorPage"}
      className={`projector-page ${client.gameIdf} ${situation.cssClass}`}
    >
      <InitialClickMe />

      {config.bgVideo && (
        <BackgroundVideo src={config.bgVideo} id={"backgroundVideoLoop"} />
      )}

      <BgOverlay />

      {config.overlayVideo && (
        <BackgroundVideo
          src={config.overlayVideo}
          className={"projector-overlay"}
          // ref={spotlightOverlayRef}
        />
      )}

      <Timer $timer={$timer} />

      <Audio src={``} ref={timerAudioRef} />

      <Headlines />

      {/* {config.showCrawler && <Crawler />}

      {config.showTopStories && <TopStories />} */}

      {/*<CompaniesCrawler/>*/}

      {/* {config.logo && <img className={"logo"} src={config.logo} />} */}

      {config.showCrawler && config.crawlerLogo && (
        <img className={"crawler-logo"} src={config.crawlerLogo} />
      )}

      {!!config.statDefs.length && <DefconBlock />}

      {!!config.statDefs.length && <CorpBlock />}

      <Spotlight />
    </div>
  );
}

function Headlines() {
  const [articles] = useAtom($splitArticles);

  return (
    <div className={"articles"}>
      {/* <div className={"articles-header"}>
        {config.logo && <img className={"logo"} src={config.logo} />}
        <div className={"top-stories-label"}>TOP STORIES THIS HOUR</div>
      </div> */}
      <div className={"articles-content"}>
        {articles
          .slice(-SHOW_LAST_COUNT)
          .reverse()
          .map(($article) => (
            <Headline key={`${$article}`} $article={$article} />
          ))}
      </div>
    </div>
  );
}

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



function Spotlight() {
  const [article] = useAtom($spotlightArticle);
  const [config] = useAtom($config);

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

  const refs: T_SpotlightRefs = useMemo(() => ({
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
  }), []);

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

      const org = config.GetOrg(article);
      $store.set($spotlightOrg, org);

      ADD_CLASS(spotlightContainer, org.cssClass || org.id);

      SET_VID(background, org.bgVideo);
      SET_VID(introVideo, org.introVideo);
      SET_AUD(introAudio, org.introAudio, org.introVolume);
      SET_VID(outroVideo, org.outroVideo);
      SET_AUD(outroAudio, org.outroAudio, org.outroVolume);
      // SET_VID(overlay, org.overlayVideo);
      SET_TEXT(theme, org.label);
      SET_TEXT(location, article.location || "");

      SHOW(introVideo);
      PLAY(introVideo);

      const introVideoTimer = setTimeout(() => {
        if (LOG) console.log(`🔦 useEffect: Spotlight,  intro mid`);
        SHOW(introVideo);
        SHOW(background);
        // SHOW(overlay);
        SHOW(carrier);

        // Apply text fitting AFTER carrier is shown and has dimensions
        console.log('🔦 Spotlight headline debug (after carrier shown):', { headline, headlineExists: !!headline });
        if (headline) {
          const headlineTextElement = headline.querySelector('.spotlight-carrier-headline-text') as HTMLElement;
          console.log('🔦 Headline text element debug (after carrier shown):', { headlineTextElement, textElementExists: !!headlineTextElement });
          if (headlineTextElement) {
            console.log('🔦 About to call updateArticleText with:', article.headline);
            // Small delay to ensure carrier is fully visible and sized
            setTimeout(() => {
              updateArticleText(headlineTextElement, headline, article.headline);
            }, 50);
          } else {
            console.error('🔦 ERROR: .spotlight-carrier-headline-text not found in headline element');
          }
        } else {
          console.error('🔦 ERROR: headline ref is null');
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
    <div
      ref={spotlightContainerRef}
      className={`spotlight-container`}
      id={"spotlight"}
    >
      <BackgroundVideo
        src={``}
        className={"spotlight-background"}
        ref={spotlightBackgroundRef}
      />

      {/*<BackgroundVideo*/}
      {/*	src={``}*/}
      {/*	className={'spotlight-overlay'}*/}
      {/*	ref={spotlightOverlayRef}*/}
      {/*/>*/}

      <Video src={``} className={"intro"} ref={introVideoRef} />

      <Audio src={``} ref={introAudioRef} />

      <Video src={``} className={"outro"} ref={outroVideoRef} />

      <Audio src={``} ref={outroAudioRef} />

      <div className={"spotlight-carrier"} ref={carrierRef}>
        <div className={"spotlight-carrier-theme"} ref={themeRef}>
          {""}
        </div>
        <div className={"spotlight-carrier-location"} ref={locationRef}>
          {""}
        </div>
        <div className={"spotlight-carrier-headline"} ref={headlineRef}>
          <div className={"spotlight-carrier-headline-text"}>
            {""}
          </div>
        </div>
      </div>
    </div>
  );
}

function Headline({ $article }: { $article: Atom<ArticleDat> }) {
  const [article] = useAtom($article);
  const [spotlight] = useAtom($spotlight);

  const className = clsx(
    "article",
    article.orgIdf,
    { spotlight: spotlight.spotlightId === article.id },
    { pending: article.id > spotlight.pendingAboveId }
  );

  if (
    article.id > spotlight.pendingAboveId ||
    spotlight.spotlightId === article.id
  ) {
    return (
      <span
        className={className}
        data-article-id={article.id}
        data-spotlight-id={spotlight.spotlightId}
        data-pending-above-id={spotlight.pendingAboveId}
      >
        {article.headline}
      </span>
    );
  }

  return (
    <div
      className={className}
      data-article-id={article.id}
      data-spotlight-id={spotlight.spotlightId}
      data-pending-above-id={spotlight.pendingAboveId}
    >
      {article.headline}
    </div>
  );
}

function InitialClickMe() {
  const [needClick, setNeedClick] = useState(true);
  if (!needClick) return <div />;

  return (
    <div className={"initial-click-me"} onClick={() => setNeedClick(false)}>
      Click Me
    </div>
  );
}



function BgOverlay() {
  return <div id={"bgOverlay"}></div>;
}

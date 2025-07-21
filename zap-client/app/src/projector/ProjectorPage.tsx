import { ArticleDat } from "../../zap-shared/_Dats.ts";
import { Timer } from "../displays/Timer.tsx";
import { atom, useAtom } from "jotai";
import "./ProjectorPage.css";
import { DEFCON_NATIONS } from "../../zap-shared/DEFCON_NATIONS";
import React, { useEffect, useRef, useState } from "react";
import {
  $allStats,
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
import { CompaniesCrawler } from "./CompaniesCrawler.tsx";
import { Crawler } from "./Crawler.tsx";
import { useClient } from "../ClientContext.ts";
import { BackgroundVideo, Video } from "../components/VideoComponents.tsx";
import {
  INTRO_MID_DEFAULT,
  OUTRO_MID_DEFAULT,
  T_Org,
  T_SpotlightRefs,
  T_StatDef,
} from "../configs/BaseGameConfig.ts";
import { Audio } from "../components/AudioComponents.tsx";
import { Button } from "../components/ButtonComponents.tsx";
import { TopStories } from "./TopStories.tsx";

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

      {config.showCrawler && <Crawler />}

      {config.showTopStories && <TopStories />}

      {/*<CompaniesCrawler/>*/}

      {config.logo && <img className={"logo"} src={config.logo} />}

      {config.showCrawler && config.crawlerLogo && (
        <img className={"crawler-logo"} src={config.crawlerLogo} />
      )}

      {!!config.statDefs.length && <AllStats />}

      <Spotlight />
    </div>
  );
}

function Headlines() {
  const [articles] = useAtom($splitArticles);

  return (
    <div className={"articles"}>
      {articles
        .slice(-SHOW_LAST_COUNT)
        .reverse()
        .map(($article) => (
          <Headline key={`${$article}`} $article={$article} />
        ))}
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

  const refs: T_SpotlightRefs = {
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
  };

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
      SET_TEXT(headline, article.headline);
      SET_TEXT(location, article.location || "");

      SHOW(introVideo);
      PLAY(introVideo);

      const introVideoTimer = setTimeout(() => {
        if (LOG) console.log(`🔦 useEffect: Spotlight,  intro mid`);
        SHOW(introVideo);
        SHOW(background);
        // SHOW(overlay);
        SHOW(carrier);

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
  }, [article]);

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
        <div className={"location"} ref={locationRef}>
          {""}
        </div>
        <div className={"headline"} ref={headlineRef}>
          {""}
        </div>
      </div>
    </div>
  );
}

function Headline({ $article }: { $article: Atom<ArticleDat> }) {
  const [article] = useAtom($article);
  const [spotlight] = useAtom($spotlight);

  const headlineLength = article.headline.length;

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

function AllStats() {
  const [config] = useAtom($config);

  // Separate statDefs into defcon and corp
  const defconStats: { def: T_StatDef; index: number }[] = [];
  const corpStats: { def: T_StatDef; index: number }[] = [];
  config.statDefs.forEach((def, index) => {
    if (def.className && def.className.includes("defcon")) {
      defconStats.push({ def, index });
    } else {
      corpStats.push({ def, index });
    }
  });

  const [allStats] = useAtom($allStats);

  // Only show defcon stats with non-empty values
  const visibleDefconStats = defconStats.filter(({ index }) => {
    const value = allStats.values[index];
    return value !== undefined && value !== null && value !== "";
  });

  return (
    <div className={"allStats"}>
      {!!visibleDefconStats.length && (
        <div className={"defcon-block"}>
          {visibleDefconStats.map(({ def, index }) => (
            <StatView key={`stat${index}`} index={index} def={def} />
          ))}
        </div>
      )}
      {!!corpStats.length && (
        <div className={"corp-block"}>
          {corpStats.map(({ def, index }) => (
            <StatView key={`stat${index}`} index={index} def={def} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatView({ index, def }: { index: number; def: T_StatDef }) {
  const [allStats] = useAtom($allStats);

  const value = allStats.values[index];

  let statContent = null;

  if (value !== undefined && value !== null && value !== "") {
    const values = typeof value === "string" ? value.split(",") : [value];
    statContent = values.map((v, i) => {
      let str = String(v).trim();
      let className = "individual-stat-block";
      let codeClass = "";

      if (str.includes("▼")) {
        str = str.replace("▼", "").trim();
        className += " trending-down";
      } else if (str.includes("▲")) {
        str = str.replace("▲", "").trim();
        className += " trending-up";
      }

      // Check for country code (3 uppercase letters)
      const codeMatch = str.match(/^[A-Z]{3}$/i);
      if (codeMatch) {
        const code = str.toUpperCase();
        const nation = DEFCON_NATIONS.find(n => n.code === code);
        if (nation) {
          codeClass = ` country-code-${code.toLowerCase()}`;
          str = nation.flag;
        }
      }
      return (
        <span key={i} className={className + codeClass}>{str}</span>
      );
    });
  }

  return (
    <div className={`statView ${def.className}`}>
      {def.icon && <img className={"statIcon"} src={def.icon} />}
      {def.label && <div className={"statLabel"}>{def.label}</div>}
      <div className={"statValue"}>{statContent}</div>
    </div>
  );
}

function BgOverlay() {
  return <div id={"bgOverlay"}></div>;
}

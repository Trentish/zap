import { ArticleDat } from "../../zap-shared/_Dats.ts";
import { Timer } from "../displays/Timer.tsx";
import { useAtom } from "jotai";
import "./ProjectorPage.css";
import React, { useRef, useState } from "react";
import {
  $config,
  $situation,
  $splitArticles,
  $spotlight,
  $store,
  $timer,
  $timerAudioRef,
} from "../ClientState.ts";
import { Atom } from "jotai/vanilla/atom";
import { clsx } from "clsx";
import { useClient } from "../ClientContext.ts";
import { BackgroundVideo } from "../components/VideoComponents.tsx";
import { Audio } from "../components/AudioComponents.tsx";
import { CorpBlock } from "./CorpBlock.tsx";
import { DefconBlock } from "./DefconBlock.tsx";
import { Spotlight } from "./Spotlight.tsx";

const SHOW_LAST_COUNT = 7;

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
            <Article key={`${$article}`} $article={$article} />
          ))}
      </div>
    </div>
  );
}

function Article({ $article }: { $article: Atom<ArticleDat> }) {
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

import {
  BaseGameConfig,
  T_Org,
  T_StatDef,
  T_SpotlightRefs,
  T_TimerDef,
} from "./BaseGameConfig.ts";
import { ArticleDat, SituationDat } from "../../zap-shared/_Dats.ts";
import "./insanity.css"; //## NOTE: will always load (regardless of gameIdf)

const J_VIDS = "../assets/videos/insanity/";
const J_AUDIO = "../assets/audio/";
const MINUTES = 60 * 1000;

class InsanityConfig extends BaseGameConfig {
  gameIdf = "insanity";

  bgVideo = `${J_VIDS}blue2.mp4`;
  // overlayVideo = `${J_VIDS}vhs.mp4`;

  showCrawler = false;
  showLocationField = true;
  logo = "../assets/images/insanity/logo-gnn.svg";
  crawlerLogo = "";

  orgs: T_Org[] = [GNN];

  timerEndSound = `${J_AUDIO}insanity_end_turn_1.mp3`;
  timerEndSoundStartMs = 1100;
  timerEndSoundVolume = 1;
  timerDefs: T_TimerDef[] = [
    {
      label: "Team",
      ms: 10 * MINUTES,
      color: "red",
    },
    {
      label: "Action",
      ms: 15 * MINUTES,
      color: "green",
    },
    {
      label: "Diplomacy",
      ms: 10 * MINUTES,
      color: "blue",
    },
    {
      label: "End of Turn",
      ms: 5 * MINUTES,
      color: "#FFCC00", // yellow
    },
  ];

  statDefs: T_StatDef[] = [
    { label: "DEFCON 1", className: "defcon defcon-1" },
    { label: "DEFCON 2", className: "defcon defcon-2" },
    { label: "DEFCON 3", className: "defcon defcon-3" },

    { label: "AFC", className: "corp corp-AFC" },
    { label: "ANE", className: "corp corp-ANE" },
    { label: "AST", className: "corp corp-AST" },
    { label: "CH", className: "corp corp-CH" },
    { label: "GRO", className: "corp corp-GRO" },
    { label: "KAS", className: "corp corp-KAS" },
    { label: "KC", className: "corp corp-KC" },
    { label: "WUB", className: "corp corp-WUB" },
  ];
  // situationDefs: SituationDat[] = [
  //     {label: 'Test Situation', cssClass: 'test-situation'}
  // ];

  constructor() {
    super();
    for (const org of this.orgs) {
      this.orgLup.set(org.id, org);
    }
  }

  override GetOrg(article: ArticleDat | undefined): T_Org {
    if (!article) return this.fallbackOrg;

    // could do random Org here
    // if (article.orgIdf === 'GNN') {
    // 	return random from here MULTI_GNN_THING etc.
    // }

    return super.GetOrg(article);
  }

  override OnStart_Spotlight(
    article: ArticleDat | undefined,
    refs: T_SpotlightRefs
  ) {
    console.log(`OnStart_Spotlight insanity`);
    if (!refs.spotlightBackgroundRef.current) return;

    // TODO: special case scrubbing
    // TODO: special 'Reagan' shit :)
    const headlineLower = article?.headline.toLowerCase() || "";

    // if (headlineLower.includes('reagan')) return REAGAN;

    if (headlineLower.includes("carter")) {
      refs.spotlightBackgroundRef.current.currentTime = 270;
      return;
    }

    if (
      headlineLower.includes("reagan") ||
      headlineLower.includes("us president") ||
      headlineLower.includes("u.s. president")
    ) {
      refs.spotlightBackgroundRef.current.currentTime = 300;
      return;
    }

    if (
      headlineLower.includes("white house") ||
      headlineLower.includes("us government") ||
      headlineLower.includes("u.s. government") ||
      headlineLower.includes("united states government") ||
      headlineLower.includes("washington")
    ) {
      refs.spotlightBackgroundRef.current.currentTime = 240;
      return;
    }

    const timeArray = [
      0, 30, 60, 90, 120, 150, 180, 210, 330, 360, 390, 420, 450, 480, 510,
    ];
    const randomIndex = Math.floor(Math.random() * timeArray.length);

    refs.spotlightBackgroundRef.current.currentTime = timeArray[randomIndex];
  }
}

const GNN: T_Org = {
  id: "gnn",
  label: "GNN",
  bgVideo: `${J_VIDS}insanity_1.mp4`,
  // overlayVideo: `${J_VIDS}vhs.mp4`,
  introVideo: `${J_VIDS}yellowarrow.webm`,
  introAudio: `${J_AUDIO}news3.mp3`, // TODO
  outroVideo: `${J_VIDS}yellowarrow.webm`,
  outroAudio: `${J_AUDIO}news_outro_1.mp3`, // TODO
  showAsRadio: true,
  introMidMs: 1400,
};

export default new InsanityConfig();

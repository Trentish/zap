// Enum for spotlight layout types
export enum SpotlightLayoutType {
  FEATURE_FULL_BACKGROUND = "FEATURE_FULL_BACKGROUND",
  FEATURE_TALKING_WITH_SUBJECT_ON_RIGHT = "FEATURE_TALKING_WITH_SUBJECT_ON_RIGHT",
  FEATURE_ABOVE_CHYRON = "FEATURE_ABOVE_CHYRON",
  DEFAULT_TALKING_BACKGROUND = "DEFAULT_TALKING_BACKGROUND",
  DEFAULT_TWO_PEOPLE_TALKING = "DEFAULT_TWO_PEOPLE_TALKING",
  DEFAULT_ABOVE_CHYRON = "DEFAULT_ABOVE_CHYRON"
}

// Types for spotlight configuration
export type SpotlightConfig = {
  layoutType: SpotlightLayoutType;
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
export const generateSpotlightConfig = async (headline: string, location?: string): Promise<SpotlightConfig> => {
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
  
  // Determine layout type and configure assets based on whether we found themed content
  let selectedLayoutType: SpotlightLayoutType;
  let randomLeftFeatureVideo: string;
  let randomRightFeature: { type: "img" | "video"; source: string };
  
  if (themedMatch) {
    // Found themed content - use --feature-- layouts
    console.log(`🎨 Using FEATURE layouts with themed content: ${themedMatch.type} ${themedMatch.source}`);
    
    // Different layout options based on content type
    let featureLayoutOptions: SpotlightLayoutType[];
    if (themedMatch.type === "video") {
      // Video content: limit to layouts that work well with video
      featureLayoutOptions = [
        SpotlightLayoutType.FEATURE_FULL_BACKGROUND,
        SpotlightLayoutType.FEATURE_TALKING_WITH_SUBJECT_ON_RIGHT,
      ];
      console.log(`📹 Video content: using video-optimized layouts`);
    } else {
      // Image content: can use all feature layouts
      featureLayoutOptions = [
        SpotlightLayoutType.FEATURE_FULL_BACKGROUND,
        SpotlightLayoutType.FEATURE_TALKING_WITH_SUBJECT_ON_RIGHT, 
        SpotlightLayoutType.FEATURE_ABOVE_CHYRON,
      ];
      console.log(`🖼️ Image content: using all feature layouts`);
    }
    
    selectedLayoutType = featureLayoutOptions[Math.floor(Math.random() * featureLayoutOptions.length)];
    
    // For feature layouts: always use talking head on left, themed content on right
    randomLeftFeatureVideo = talkingHeadVideoSources[Math.floor(Math.random() * talkingHeadVideoSources.length)];
    randomRightFeature = themedMatch;
    
    // Exception: FEATURE_FULL_BACKGROUND with video uses themed video as background
    if (selectedLayoutType === SpotlightLayoutType.FEATURE_FULL_BACKGROUND && themedMatch.type === "video") {
      selectedBackgroundVideo = themedMatch.source;
      console.log(`🎬 Using themed video as full background: ${themedMatch.source}`);
      // Still keep the themed content in right feature for component to know about it
    }
    
  } else {
    // No themed match - use --default-- layouts
    console.log(`� Using DEFAULT layouts (no themed match found)`);
    const defaultLayoutOptions = [
      SpotlightLayoutType.DEFAULT_TALKING_BACKGROUND,
      SpotlightLayoutType.DEFAULT_TWO_PEOPLE_TALKING,
    ];
    selectedLayoutType = defaultLayoutOptions[Math.floor(Math.random() * defaultLayoutOptions.length)];
    
    if (selectedLayoutType === SpotlightLayoutType.DEFAULT_TALKING_BACKGROUND) {
      // Talking background: special background video, talking head on left, no right feature
      selectedBackgroundVideo = widescreenBackgroundSources[Math.floor(Math.random() * widescreenBackgroundSources.length)];
      randomLeftFeatureVideo = talkingHeadVideoSources[Math.floor(Math.random() * talkingHeadVideoSources.length)];
      randomRightFeature = { type: "img" as const, source: "" };
    } else {
      // Two people talking: talking head on left, listening head on right
      randomLeftFeatureVideo = talkingHeadVideoSources[Math.floor(Math.random() * talkingHeadVideoSources.length)];
      randomRightFeature = {
        type: "video" as const,
        source: listeningHeadVideoSources[Math.floor(Math.random() * listeningHeadVideoSources.length)]
      };
    }
  }

  console.log(`🔦 FINAL CONFIG: ${selectedLayoutType} | Right: ${randomRightFeature.type} ${randomRightFeature.source}`);
  console.log(`🔦 BACKGROUND: ${selectedBackgroundVideo}`);
  console.log(`🔦 LEFT: ${randomLeftFeatureVideo}`);

  return {
    layoutType: selectedLayoutType,
    "spotlight-background-video-src": selectedBackgroundVideo,
    "left-feature-video-src": randomLeftFeatureVideo,
    "right-feature": randomRightFeature
  };
};

export type ContentType = "long_video" | "shorts";

export interface GeneratorInput {
  contentType: ContentType;
  topic: string;
  niche: string;
  audience: string;
  language: string;
  tone: string;
  videoGoal: string;
  videoLength: string;
  contentStyle: string;
  brandDescription?: string;
}

export interface ContentIdea {
  title: string;
  hook: string;
  angle: string;
  whyItWorks: string;
}

export interface ScriptSection {
  title: string;
  content: string;
}

export interface ScriptResult {
  openingHook: string;
  intro: string;
  mainContent: ScriptSection[];
  cta: string;
  closing: string;
}

export interface StoryboardScene {
  sceneNumber: number;
  duration: string;
  visual: string;
  cameraShot: string;
  cameraMovement: string;
  voiceover: string;
  textOnScreen: string;
  soundDirection: string;
}

export interface PromptItem {
  sceneNumber: number;
  aspectRatio: string;
  prompt: string;
  negativePrompt: string;
}

export interface MetadataResult {
  titleOptions: string[];
  bestTitle: string;
  description: string;
  shortDescription: string;
  hashtags: string[];
  tags: string[];
  pinnedComment: string;
  thumbnailTextIdeas: string[];
}

export interface UploadPlannerResult {
  recommendedUploadDate: string;
  recommendedUploadTime: string;
  weeklyPlan: string[];
  category: string;
  priorityScore: string;
  productionChecklist: string[];
}

export interface GeneratedContent extends GeneratorInput {
  id: string;
  createdAt: string;
  updatedAt: string;
  ideas: ContentIdea[];
  script: ScriptResult;
  storyboard: StoryboardScene[];
  imagePrompts: PromptItem[];
  videoPrompts: PromptItem[];
  metadata: MetadataResult;
  uploadPlanner: UploadPlannerResult;
}

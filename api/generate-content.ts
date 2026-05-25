import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

function safeJsonParse(raw: string) {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("Gemini response was not valid JSON.");
  }
}

function buildPrompt(input: any) {
  const contentTypeInstruction = input.contentType === "shorts"
    ? "Create a fast-paced YouTube Shorts package with 5 to 7 short scenes. Keep hooks strong and visual instructions quick."
    : "Create a detailed YouTube long-form video package with 8 to 12 scenes. Make the script deeper and structured.";

  return `
You are an expert YouTube content strategist, scriptwriter, storyboard planner, and AI prompt engineer.

Create a complete YouTube content package based on this user input:

Content type: ${input.contentType}
Main topic: ${input.topic}
Niche: ${input.niche}
Target audience: ${input.audience}
Language: ${input.language}
Tone: ${input.tone}
Video goal: ${input.videoGoal}
Video length: ${input.videoLength}
Content style: ${input.contentStyle}
Brand or character description: ${input.brandDescription || "none"}

${contentTypeInstruction}

Return ONLY valid JSON. Do not include markdown. Do not include explanation outside JSON.

Use this exact JSON structure:

{
  "ideas": [
    {
      "title": "",
      "hook": "",
      "angle": "",
      "whyItWorks": ""
    }
  ],
  "script": {
    "openingHook": "",
    "intro": "",
    "mainContent": [
      {
        "title": "",
        "content": ""
      }
    ],
    "cta": "",
    "closing": ""
  },
  "storyboard": [
    {
      "sceneNumber": 1,
      "duration": "",
      "visual": "",
      "cameraShot": "",
      "cameraMovement": "",
      "voiceover": "",
      "textOnScreen": "",
      "soundDirection": ""
    }
  ],
  "imagePrompts": [
    {
      "sceneNumber": 1,
      "prompt": "",
      "negativePrompt": ""
    }
  ],
  "videoPrompts": [
    {
      "sceneNumber": 1,
      "prompt": "",
      "negativePrompt": ""
    }
  ],
  "metadata": {
    "titleOptions": [],
    "bestTitle": "",
    "description": "",
    "shortDescription": "",
    "hashtags": [],
    "tags": [],
    "pinnedComment": "",
    "thumbnailTextIdeas": []
  },
  "uploadPlanner": {
    "recommendedUploadDate": "",
    "recommendedUploadTime": "",
    "weeklyPlan": [],
    "category": "",
    "priorityScore": "",
    "productionChecklist": []
  }
}

Rules:
- Generate exactly 10 content ideas.
- Make everything specific to the topic, niche, audience, and content type.
- Do not use generic filler.
- Do not repeat the same idea using different wording.
- Every storyboard scene must connect to the script.
- Every image prompt and video prompt must connect to the matching storyboard scene.
- Titles must be clickable, clear, and not misleading.
- Description must sound natural.
- Hashtags must be relevant.
- The result must be in the requested language.
`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing. Add it in Vercel Environment Variables." });
  }

  const input = req.body;
  const required = ["contentType", "topic", "niche", "audience", "language", "tone", "videoGoal", "videoLength", "contentStyle"];
  const missing = required.filter((key) => !input?.[key]);

  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: buildPrompt(input),
      config: {
        responseMimeType: "application/json",
        temperature: 0.9
      }
    });

    const raw = response.text || "";
    const parsed = safeJsonParse(raw);
    const now = new Date().toISOString();

    return res.status(200).json({
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...input,
      ...parsed
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Failed to generate content."
    });
  }
}

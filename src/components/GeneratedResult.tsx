import { Clipboard, Download, Save } from "lucide-react";
import { useEffect, useState } from "react";
import type { ContentIdea, GeneratedContent } from "../types";

interface Props {
  content: GeneratedContent | null;
  defaultTab?: Tab;
  onSave: () => void;
  onUseIdea?: (idea: ContentIdea) => void;
}

type Tab = "overview" | "script" | "storyboard" | "image" | "video" | "metadata" | "planner";

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

function getContentAspectRatio(contentType: GeneratedContent["contentType"]) {
  return contentType === "shorts" ? "9:16" : "16:9";
}

function ensureAspectRatioInPrompt(prompt: string, aspectRatio: string) {
  if (!prompt) return "";
  return /aspect\s*ratio/i.test(prompt)
    ? prompt
    : `${prompt} Aspect ratio: ${aspectRatio}.`;
}

function getPromptForScene(
  items: GeneratedContent["imagePrompts"],
  sceneNumber: number,
  fallbackAspectRatio: string
) {
  const item = items.find((item) => Number(item.sceneNumber) === Number(sceneNumber));
  const aspectRatio = item?.aspectRatio || fallbackAspectRatio;
  return ensureAspectRatioInPrompt(item?.prompt || "", aspectRatio);
}

function getStoryboardTableText(content: GeneratedContent) {
  const aspectRatio = getContentAspectRatio(content.contentType);
  const header = ["Scene", "Duration", "Visual", "Voice Over", "Visual Prompt", "Camera Shot"].join("\t");
  const rows = content.storyboard.map((scene) => [
    `Scene ${scene.sceneNumber}`,
    scene.duration,
    scene.visual,
    scene.voiceover,
    getPromptForScene(content.imagePrompts, scene.sceneNumber, aspectRatio),
    [scene.cameraShot, scene.cameraMovement].filter(Boolean).join(", ")
  ].join("\t"));

  return [header, ...rows].join("\n");
}

function downloadJson(content: GeneratedContent) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${content.topic.replace(/\s+/g, "-").toLowerCase()}-${content.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function SectionCopy({ text }: { text: string }) {
  return (
    <div className="copy-row">
      <button className="btn secondary" onClick={() => copyText(text)}><Clipboard size={16} /> Copy</button>
    </div>
  );
}

export default function GeneratedResult({ content, defaultTab = "overview", onSave, onUseIdea }: Props) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  if (!content) {
    return <div className="empty">Belum ada hasil. Isi form lalu klik Generate Complete Content.</div>;
  }

  const aspectRatio = getContentAspectRatio(content.contentType);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "script", label: "Script" },
    { id: "storyboard", label: "Storyboard" },
    { id: "image", label: "Image Prompts" },
    { id: "video", label: "Video Prompts" },
    { id: "metadata", label: "Metadata" },
    { id: "planner", label: "Upload Plan" }
  ];

  return (
    <div className="card">
      <div className="section-title">
        <div>
          <h2>{content.topic}</h2>
          <p className="muted">
            {content.contentType === "shorts" ? "YouTube Shorts" : "YouTube Long Video"} • {content.niche} • {content.videoLength} • Aspect Ratio {aspectRatio}
          </p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={onSave}><Save size={17} /> Save</button>
          <button className="btn secondary" onClick={() => downloadJson(content)}><Download size={17} /> Export JSON</button>
        </div>
      </div>

      <div className="tabs">
        {tabs.map((item) => (
          <button key={item.id} className={`tab ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <Overview content={content} onUseIdea={onUseIdea} />}
      {tab === "script" && <Script content={content} />}
      {tab === "storyboard" && <Storyboard content={content} />}
      {tab === "image" && <Prompts title="AI Image Prompts" items={content.imagePrompts} fallbackAspectRatio={aspectRatio} />}
      {tab === "video" && <Prompts title="AI Video Prompts" items={content.videoPrompts} fallbackAspectRatio={aspectRatio} />}
      {tab === "metadata" && <Metadata content={content} />}
      {tab === "planner" && <Planner content={content} />}
    </div>
  );
}

function Overview({ content, onUseIdea }: { content: GeneratedContent; onUseIdea?: (idea: ContentIdea) => void }) {
  return (
    <div className="list">
      <div className="grid three">
        <div className="stat"><strong>{content.ideas.length}</strong><span>Content ideas</span></div>
        <div className="stat"><strong>{content.storyboard.length}</strong><span>Storyboard scenes</span></div>
        <div className="stat"><strong>{content.metadata.titleOptions.length}</strong><span>Title options</span></div>
      </div>
      <div className="item">
        <h3>Best Title</h3>
        <p>{content.metadata.bestTitle}</p>
        <SectionCopy text={content.metadata.bestTitle} />
      </div>
      <div className="item">
        <h3>Content Ideas</h3>
        <div className="list">
          {content.ideas.map((idea, idx) => (
            <button
              type="button"
              className="item idea-card"
              key={idx}
              onClick={() => onUseIdea?.(idea)}
              title="Klik untuk memasukkan ide ini ke Content Generator"
            >
              <div className="idea-card-head">
                <h3>{idx + 1}. {idea.title}</h3>
                <span className="use-idea">Use idea</span>
              </div>
              <p><span className="badge">Hook</span> {idea.hook}</p>
              <p><span className="badge">Angle</span> {idea.angle}</p>
              <p><span className="badge">Why</span> {idea.whyItWorks}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Script({ content }: { content: GeneratedContent }) {
  const fullScript = [
    `Opening Hook:\n${content.script.openingHook}`,
    `Intro:\n${content.script.intro}`,
    ...content.script.mainContent.map((s) => `${s.title}:\n${s.content}`),
    `CTA:\n${content.script.cta}`,
    `Closing:\n${content.script.closing}`
  ].join("\n\n");

  return (
    <div className="list">
      <div className="item"><h3>Opening Hook</h3><p className="preline">{content.script.openingHook}</p></div>
      <div className="item"><h3>Intro</h3><p className="preline">{content.script.intro}</p></div>
      {content.script.mainContent.map((section, idx) => (
        <div className="item" key={idx}><h3>{section.title}</h3><p className="preline">{section.content}</p></div>
      ))}
      <div className="item"><h3>CTA</h3><p className="preline">{content.script.cta}</p></div>
      <div className="item"><h3>Closing</h3><p className="preline">{content.script.closing}</p></div>
      <SectionCopy text={fullScript} />
    </div>
  );
}

function Storyboard({ content }: { content: GeneratedContent }) {
  const aspectRatio = getContentAspectRatio(content.contentType);

  return (
    <div className="list">
      <div className="table-toolbar">
        <div>
          <h3>Storyboard Table</h3>
          <p className="muted">Format ini siap dicopy ke Google Sheets, Excel, Notion, atau langsung dipakai untuk produksi video.</p>
        </div>
        <button className="btn secondary" onClick={() => copyText(getStoryboardTableText(content))}>
          <Clipboard size={16} /> Copy Table
        </button>
      </div>

      <div className="storyboard-table-wrap">
        <table className="storyboard-table">
          <thead>
            <tr>
              <th>Scene</th>
              <th>Duration</th>
              <th>Visual</th>
              <th>Voice Over</th>
              <th>Visual Prompt</th>
              <th>Camera Shot</th>
              <th>Copy</th>
            </tr>
          </thead>
          <tbody>
            {content.storyboard.map((scene) => {
              const visualPrompt = getPromptForScene(content.imagePrompts, scene.sceneNumber, aspectRatio);
              const cameraText = [scene.cameraShot, scene.cameraMovement].filter(Boolean).join(", ");
              const rowText = [
                `Scene ${scene.sceneNumber}`,
                scene.duration,
                scene.visual,
                scene.voiceover,
                visualPrompt,
                cameraText
              ].join("\n\n");

              return (
                <tr key={scene.sceneNumber}>
                  <td>Scene {scene.sceneNumber}</td>
                  <td>{scene.duration}</td>
                  <td>{scene.visual}</td>
                  <td>{scene.voiceover}</td>
                  <td>{visualPrompt}</td>
                  <td>{cameraText}</td>
                  <td>
                    <button className="mini-copy" onClick={() => copyText(rowText)}>
                      <Clipboard size={14} />
                      Copy
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Prompts({
  title,
  items,
  fallbackAspectRatio
}: {
  title: string;
  items: GeneratedContent["imagePrompts"];
  fallbackAspectRatio: string;
}) {
  return (
    <div className="list">
      <h3>{title}</h3>

      {items.map((item) => {
        const aspectRatio = item.aspectRatio || fallbackAspectRatio;
        const promptText = ensureAspectRatioInPrompt(item.prompt, aspectRatio);

        const copyValue = [
          `Scene ${item.sceneNumber}`,
          `Aspect Ratio: ${aspectRatio}`,
          "",
          "Prompt:",
          promptText,
          "",
          "Negative Prompt:",
          item.negativePrompt
        ].join("\n");

        return (
          <div className="item" key={item.sceneNumber}>
            <div className="prompt-head">
              <h3>Scene {item.sceneNumber}</h3>
              <span className="badge">Aspect Ratio: {aspectRatio}</span>
            </div>

            <p className="preline">{promptText}</p>

            <p><span className="badge">Negative</span> {item.negativePrompt}</p>

            <SectionCopy text={copyValue} />
          </div>
        );
      })}
    </div>
  );
}

function Metadata({ content }: { content: GeneratedContent }) {
  const metadataText = `Best title:\n${content.metadata.bestTitle}\n\nDescription:\n${content.metadata.description}\n\nHashtags:\n${content.metadata.hashtags.join(" ")}`;
  return (
    <div className="list">
      <div className="item"><h3>Recommended Title</h3><p>{content.metadata.bestTitle}</p></div>
      <div className="item"><h3>Title Options</h3>{content.metadata.titleOptions.map((t, i) => <p key={i}>{i + 1}. {t}</p>)}</div>
      <div className="item"><h3>Description</h3><p className="preline">{content.metadata.description}</p></div>
      <div className="item"><h3>Short Description</h3><p>{content.metadata.shortDescription}</p></div>
      <div className="item"><h3>Hashtags</h3><p>{content.metadata.hashtags.join(" ")}</p></div>
      <div className="item"><h3>Tags / Keywords</h3><p>{content.metadata.tags.join(", ")}</p></div>
      <div className="item"><h3>Pinned Comment</h3><p>{content.metadata.pinnedComment}</p></div>
      <div className="item"><h3>Thumbnail Text Ideas</h3>{content.metadata.thumbnailTextIdeas.map((t, i) => <p key={i}>{i + 1}. {t}</p>)}</div>
      <SectionCopy text={metadataText} />
    </div>
  );
}

function Planner({ content }: { content: GeneratedContent }) {
  return (
    <div className="list">
      <div className="grid three">
        <div className="stat"><strong>{content.uploadPlanner.recommendedUploadDate}</strong><span>Recommended date</span></div>
        <div className="stat"><strong>{content.uploadPlanner.recommendedUploadTime}</strong><span>Recommended time</span></div>
        <div className="stat"><strong>{content.uploadPlanner.priorityScore}</strong><span>Priority score</span></div>
      </div>
      <div className="item"><h3>Category</h3><p>{content.uploadPlanner.category}</p></div>
      <div className="item"><h3>Weekly Upload Plan</h3>{content.uploadPlanner.weeklyPlan.map((x, i) => <p key={i}>{i + 1}. {x}</p>)}</div>
      <div className="item"><h3>Production Checklist</h3>{content.uploadPlanner.productionChecklist.map((x, i) => <p key={i}>☐ {x}</p>)}</div>
    </div>
  );
}

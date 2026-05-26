import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import GeneratorForm from "./components/GeneratorForm";
import GeneratedResult from "./components/GeneratedResult";
import SavedLibrary from "./components/SavedLibrary";
import Settings from "./components/Settings";
import { generateContent } from "./lib/api";
import { clearAllStorage, clearGeneratedCache, loadGeneratedContent, loadLibrary, saveGeneratedContent, saveLibrary } from "./lib/storage";
import type { ContentIdea, GeneratedContent, GeneratorInput } from "./types";

type Page = "dashboard" | "generator" | "storyboard" | "prompts" | "metadata" | "planner" | "library" | "settings";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [library, setLibrary] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [generatorPrefill, setGeneratorPrefill] = useState<GeneratorInput | null>(null);

  useEffect(() => {
    setGenerated(loadGeneratedContent());
    setLibrary(loadLibrary());
  }, []);

  useEffect(() => {
    saveGeneratedContent(generated);
  }, [generated]);

  useEffect(() => {
    saveLibrary(library);
  }, [library]);

  const stats = useMemo(() => {
    return {
      total: library.length,
      shorts: library.filter((x) => x.contentType === "shorts").length,
      long: library.filter((x) => x.contentType === "long_video").length
    };
  }, [library]);

  const handleGenerate = async (input: GeneratorInput) => {
    setLoading(true);
    setError("");
    setMessage("");
    setGenerated(null);

    try {
      const result = await generateContent(input);
      setGenerated(result);
      setPage("generator");
      setMessage("Konten berhasil dibuat. Semua section sudah tersambung dari satu hasil generate.");
    } catch (err: any) {
      setError(err?.message || "Generate gagal. Coba cek koneksi atau API key.");
    } finally {
      setLoading(false);
    }
  };


  const handleUseIdea = (idea: ContentIdea) => {
    if (!generated) return;
    const nextInput: GeneratorInput = {
      contentType: generated.contentType,
      topic: idea.title,
      niche: generated.niche,
      audience: generated.audience,
      language: generated.language,
      tone: generated.tone,
      videoGoal: generated.videoGoal,
      videoLength: generated.videoLength,
      contentStyle: generated.contentStyle,
      brandDescription: [generated.brandDescription, `Selected idea hook: ${idea.hook}`, `Selected idea angle: ${idea.angle}`]
        .filter(Boolean)
        .join("\n")
    };

    setGeneratorPrefill(nextInput);
    setPage("generator");
    setMessage("Ide sudah masuk ke Content Generator. Kamu bisa edit dulu atau langsung klik Generate.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = () => {
    if (!generated) return;
    setLibrary((prev) => {
      const exists = prev.some((item) => item.id === generated.id);
      if (exists) return prev.map((item) => item.id === generated.id ? generated : item);
      return [generated, ...prev];
    });
    setMessage("Konten berhasil disimpan ke library.");
  };

  const handleOpen = (item: GeneratedContent) => {
    setGenerated(item);
    setPage("generator");
    setMessage("Saved content dibuka kembali.");
  };

  const handleDuplicate = (item: GeneratedContent) => {
    const now = new Date().toISOString();
    const copy = { ...item, id: crypto.randomUUID(), createdAt: now, updatedAt: now, topic: `${item.topic} (Copy)` };
    setLibrary((prev) => [copy, ...prev]);
    setMessage("Konten berhasil diduplikasi.");
  };

  const handleDelete = (id: string) => {
    setLibrary((prev) => prev.filter((item) => item.id !== id));
    setMessage("Konten berhasil dihapus.");
  };

  const clearGenerated = () => {
    setGenerated(null);
    clearGeneratedCache();
    setMessage("Generated result berhasil dibersihkan.");
  };

  const clearEverything = () => {
    if (!confirm("Hapus semua data lokal?")) return;
    setGenerated(null);
    setLibrary([]);
    clearAllStorage();
    setMessage("Semua data lokal berhasil dihapus.");
  };

  return (
    <div className="app-shell">
      <Sidebar page={page} onChange={setPage} />
      <main className="main">
        <div className="header">
          <div>
            <h1>YouTube Content Studio Pro</h1>
            <p>Bikin ide, script, storyboard, prompt, metadata, jadwal upload, lalu simpan ke library.</p>
          </div>
          <span className="badge">Gemini + Vercel ready</span>
        </div>

        {message && <div className="toast">{message}</div>}
        {error && <div className="error">{error}</div>}

        {page === "dashboard" && (
          <div className="grid">
            <div className="grid three">
              <div className="stat"><strong>{stats.total}</strong><span>Total saved content</span></div>
              <div className="stat"><strong>{stats.shorts}</strong><span>YouTube Shorts</span></div>
              <div className="stat"><strong>{stats.long}</strong><span>Long videos</span></div>
            </div>
            <GeneratorForm loading={loading} onGenerate={handleGenerate} onClear={clearGenerated} initialInput={generatorPrefill} />
            <GeneratedResult content={generated} onSave={handleSave} onUseIdea={handleUseIdea} />
          </div>
        )}

        {page === "generator" && (
          <div className="grid">
            <GeneratorForm loading={loading} onGenerate={handleGenerate} onClear={clearGenerated} initialInput={generatorPrefill} />
            <GeneratedResult content={generated} onSave={handleSave} onUseIdea={handleUseIdea} />
          </div>
        )}

        {page === "storyboard" && <GeneratedResult content={generated} defaultTab="storyboard" onSave={handleSave} onUseIdea={handleUseIdea} />}
        {page === "prompts" && <GeneratedResult content={generated} defaultTab="image" onSave={handleSave} onUseIdea={handleUseIdea} />}
        {page === "metadata" && <GeneratedResult content={generated} defaultTab="metadata" onSave={handleSave} onUseIdea={handleUseIdea} />}
        {page === "planner" && <GeneratedResult content={generated} defaultTab="planner" onSave={handleSave} onUseIdea={handleUseIdea} />}
        {page === "library" && <SavedLibrary items={library} onOpen={handleOpen} onDelete={handleDelete} onDuplicate={handleDuplicate} />}
        {page === "settings" && <Settings onClearGenerated={clearGenerated} onClearAll={clearEverything} />}
      </main>
    </div>
  );
}

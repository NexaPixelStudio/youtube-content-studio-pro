import { Loader2, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { ContentType, GeneratorInput } from "../types";

interface Props {
  loading: boolean;
  onGenerate: (input: GeneratorInput) => void;
  onClear: () => void;
  initialInput?: GeneratorInput | null;
}

const baseInput: GeneratorInput = {
  contentType: "shorts",
  topic: "",
  niche: "",
  audience: "",
  language: "Indonesian",
  tone: "fun storytelling",
  videoGoal: "entertain",
  videoLength: "60 seconds",
  contentStyle: "faceless",
  brandDescription: ""
};

export default function GeneratorForm({ loading, onGenerate, onClear, initialInput }: Props) {
  const [form, setForm] = useState<GeneratorInput>(initialInput || baseInput);

  useEffect(() => {
    if (initialInput) setForm(initialInput);
  }, [initialInput]);

  const update = (key: keyof GeneratorInput, value: string) => {
    const next = { ...form, [key]: value } as GeneratorInput;

    if (key === "contentType") {
      const contentType = value as ContentType;
      next.videoLength = contentType === "shorts" ? "60 seconds" : "8 minutes";
    }

    setForm(next);
  };

  const submit = () => {
    if (!form.topic.trim() || !form.niche.trim() || !form.audience.trim()) {
      alert("Isi dulu topic, niche, dan target audience.");
      return;
    }
    onGenerate(form);
  };

  const lengthOptions = form.contentType === "shorts"
    ? ["15 seconds", "30 seconds", "45 seconds", "60 seconds"]
    : ["5 minutes", "8 minutes", "10 minutes", "15 minutes"];

  return (
    <div className="card">
      <div className="section-title">
        <div>
          <h2>Generate Konten Baru</h2>
          <p className="muted">Isi detail konten, lalu app akan membuat satu paket lengkap yang saling terhubung.</p>
        </div>
      </div>

      <div className="grid two">
        <div className="field">
          <label>Jenis Konten</label>
          <select className="select" value={form.contentType} onChange={(e) => update("contentType", e.target.value)}>
            <option value="shorts">YouTube Shorts</option>
            <option value="long_video">YouTube Long Video</option>
          </select>
          <small>Pilih Shorts untuk video pendek, Long Video untuk konten panjang.</small>
        </div>

        <div className="field">
          <label>Durasi Video</label>
          <select className="select" value={form.videoLength} onChange={(e) => update("videoLength", e.target.value)}>
            {lengthOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Topik Utama</label>
          <input className="input" value={form.topic} onChange={(e) => update("topic", e.target.value)} placeholder="Contoh: cara hemat uang untuk pemula" />
        </div>

        <div className="field">
          <label>Niche</label>
          <input className="input" value={form.niche} onChange={(e) => update("niche", e.target.value)} placeholder="Contoh: personal finance, kids animation, affiliate product" />
        </div>

        <div className="field">
          <label>Target Audience</label>
          <input className="input" value={form.audience} onChange={(e) => update("audience", e.target.value)} placeholder="Contoh: pemula usia 18-30 tahun" />
        </div>

        <div className="field">
          <label>Bahasa Output</label>
          <select className="select" value={form.language} onChange={(e) => update("language", e.target.value)}>
            <option>Indonesian</option>
            <option>English</option>
            <option>Indonesian casual</option>
            <option>English simple</option>
          </select>
        </div>

        <div className="field">
          <label>Tone</label>
          <select className="select" value={form.tone} onChange={(e) => update("tone", e.target.value)}>
            <option>fun storytelling</option>
            <option>educational</option>
            <option>dramatic</option>
            <option>funny</option>
            <option>cinematic</option>
            <option>professional</option>
          </select>
        </div>

        <div className="field">
          <label>Goal Video</label>
          <select className="select" value={form.videoGoal} onChange={(e) => update("videoGoal", e.target.value)}>
            <option>entertain</option>
            <option>educate</option>
            <option>sell</option>
            <option>build audience</option>
            <option>storytelling</option>
          </select>
        </div>

        <div className="field">
          <label>Style Konten</label>
          <select className="select" value={form.contentStyle} onChange={(e) => update("contentStyle", e.target.value)}>
            <option>faceless</option>
            <option>talking head</option>
            <option>animation</option>
            <option>kids content</option>
            <option>product review</option>
            <option>storytelling</option>
            <option>documentary</option>
            <option>tutorial</option>
          </select>
        </div>

        <div className="field">
          <label>Brand / Karakter Opsional</label>
          <textarea className="textarea" value={form.brandDescription} onChange={(e) => update("brandDescription", e.target.value)} placeholder="Contoh: karakter kelinci lucu warna biru, target anak-anak internasional" />
        </div>
      </div>

      <div className="actions">
        <button className="btn primary" disabled={loading} onClick={submit}>
          {loading ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
          {loading ? "Generating..." : "Generate Complete Content"}
        </button>
        <button className="btn secondary" disabled={loading} onClick={onClear}>
          <Trash2 size={18} /> Clear Result
        </button>
      </div>
    </div>
  );
}

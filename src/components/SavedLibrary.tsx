import { Copy, FolderOpen, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { GeneratedContent } from "../types";

interface Props {
  items: GeneratedContent[];
  onOpen: (item: GeneratedContent) => void;
  onDelete: (id: string) => void;
  onDuplicate: (item: GeneratedContent) => void;
}

export default function SavedLibrary({ items, onOpen, onDelete, onDuplicate }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesType = filter === "all" || item.contentType === filter;
      const keyword = `${item.topic} ${item.niche} ${item.audience}`.toLowerCase();
      return matchesType && keyword.includes(query.toLowerCase());
    });
  }, [items, query, filter]);

  return (
    <div className="card">
      <div className="section-title">
        <div>
          <h2>Saved Library</h2>
          <p className="muted">Semua konten yang kamu simpan akan muncul di sini.</p>
        </div>
      </div>

      <div className="library-toolbar">
        <div className="field" style={{ flex: 1, minWidth: 220 }}>
          <label>Search</label>
          <div style={{ position: "relative" }}>
            <Search size={17} style={{ position: "absolute", top: 13, left: 12, color: "#6b7280" }} />
            <input className="input" style={{ paddingLeft: 38 }} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari topic atau niche" />
          </div>
        </div>
        <div className="field" style={{ minWidth: 220 }}>
          <label>Filter</label>
          <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All content</option>
            <option value="shorts">YouTube Shorts</option>
            <option value="long_video">YouTube Long Video</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">Belum ada konten tersimpan atau hasil pencarian kosong.</div>
      ) : (
        <div className="list">
          {filtered.map((item) => (
            <div className="item" key={item.id}>
              <div className="section-title">
                <div>
                  <h3>{item.topic}</h3>
                  <p className="muted">{item.contentType === "shorts" ? "YouTube Shorts" : "YouTube Long Video"} • {item.niche} • {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="badge">{item.videoLength}</span>
              </div>
              <p><span className="badge">Best title</span> {item.metadata.bestTitle}</p>
              <div className="actions">
                <button className="btn primary" onClick={() => onOpen(item)}><FolderOpen size={16} /> Open</button>
                <button className="btn secondary" onClick={() => onDuplicate(item)}><Copy size={16} /> Duplicate</button>
                <button className="btn danger" onClick={() => onDelete(item.id)}><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

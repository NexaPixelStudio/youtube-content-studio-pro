import { Trash2 } from "lucide-react";

interface Props {
  onClearGenerated: () => void;
  onClearAll: () => void;
}

export default function Settings({ onClearGenerated, onClearAll }: Props) {
  return (
    <div className="card">
      <div className="section-title">
        <div>
          <h2>Settings</h2>
          <p className="muted">Pengaturan dasar untuk cache dan penyimpanan lokal.</p>
        </div>
      </div>

      <div className="list">
        <div className="item">
          <h3>Clear Generated Result</h3>
          <p>Hapus hasil generate yang sedang tampil. Saved Library tidak ikut terhapus.</p>
          <button className="btn secondary" onClick={onClearGenerated}><Trash2 size={16} /> Clear Generated Result</button>
        </div>
        <div className="item">
          <h3>Delete All Local Data</h3>
          <p>Hapus hasil generate dan semua Saved Library dari browser ini.</p>
          <button className="btn danger" onClick={onClearAll}><Trash2 size={16} /> Delete All Data</button>
        </div>
        <div className="item">
          <h3>API Key</h3>
          <p>API key Gemini tidak disimpan di website. Simpan di Vercel Environment Variables dengan nama GEMINI_API_KEY.</p>
        </div>
      </div>
    </div>
  );
}

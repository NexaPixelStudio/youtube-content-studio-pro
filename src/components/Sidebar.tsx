import { CalendarClock, Clapperboard, Home, Library, Settings, Sparkles, Tags, Video } from "lucide-react";

type Page = "dashboard" | "generator" | "storyboard" | "prompts" | "metadata" | "planner" | "library" | "settings";

interface SidebarProps {
  page: Page;
  onChange: (page: Page) => void;
}

const items: { id: Page; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "generator", label: "Content Generator", icon: Sparkles },
  { id: "storyboard", label: "Storyboard", icon: Clapperboard },
  { id: "prompts", label: "Image & Video Prompts", icon: Video },
  { id: "metadata", label: "YouTube Metadata", icon: Tags },
  { id: "planner", label: "Upload Planner", icon: CalendarClock },
  { id: "library", label: "Saved Library", icon: Library },
  { id: "settings", label: "Settings", icon: Settings }
];

export default function Sidebar({ page, onChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">▶</div>
        <div>
          YouTube<br />Content Studio
        </div>
      </div>
      <nav>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => onChange(item.id)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

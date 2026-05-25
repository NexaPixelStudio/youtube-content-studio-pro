import type { GeneratedContent } from "../types";

const GENERATED_KEY = "ytcs_generated_content";
const LIBRARY_KEY = "ytcs_saved_library";

export function loadGeneratedContent(): GeneratedContent | null {
  try {
    const raw = localStorage.getItem(GENERATED_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveGeneratedContent(content: GeneratedContent | null) {
  if (!content) {
    localStorage.removeItem(GENERATED_KEY);
    return;
  }
  localStorage.setItem(GENERATED_KEY, JSON.stringify(content));
}

export function loadLibrary(): GeneratedContent[] {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLibrary(items: GeneratedContent[]) {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(items));
}

export function clearGeneratedCache() {
  localStorage.removeItem(GENERATED_KEY);
}

export function clearAllStorage() {
  localStorage.removeItem(GENERATED_KEY);
  localStorage.removeItem(LIBRARY_KEY);
}

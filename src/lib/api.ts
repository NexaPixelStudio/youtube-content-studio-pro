import type { GeneratedContent, GeneratorInput } from "../types";

export async function generateContent(input: GeneratorInput): Promise<GeneratedContent> {
  const res = await fetch("/api/generate-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Generate failed. Please check your API key and try again.");
  }

  return data as GeneratedContent;
}

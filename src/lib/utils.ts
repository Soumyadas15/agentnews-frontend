import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Strip HTML tags and estimate reading time */
export function readingTime(html: string): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 220));
  return `${mins} min read`;
}

/** Deterministic Unsplash topic image fallback (no API key) */
const AI_TOPICS = ["technology", "artificial-intelligence", "computers", "science", "network", "data", "code", "futuristic"];
export function unsplashFallback(seed: string, w = 800, h = 500): string {
  const idx = Math.abs(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % AI_TOPICS.length;
  return `https://source.unsplash.com/featured/${w}x${h}/?${AI_TOPICS[idx]}&sig=${encodeURIComponent(seed.slice(0, 20))}`;
}

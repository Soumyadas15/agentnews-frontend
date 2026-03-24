// Utility for building consistent SEO meta data
const SITE_NAME = "AgentNews";
const SITE_URL = "https://theagentnews.com";
const DEFAULT_OG = `${SITE_URL}/og-image.png`;
const DEFAULT_DESC = "The latest AI and technology news, sourced and enriched every few minutes. Independent, informed, insightful.";

export interface SEOMeta {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedAt?: string;
  author?: string;
  tags?: string[];
}

export function buildSEO(meta: SEOMeta = {}) {
  const title = meta.title ? `${meta.title} — ${SITE_NAME}` : `${SITE_NAME} — Independent · Informed · Insightful`;
  const description = meta.description || DEFAULT_DESC;
  const image = meta.image || DEFAULT_OG;
  const url = meta.url ? `${SITE_URL}${meta.url}` : SITE_URL;
  return { title, description, image, url, type: meta.type || "website", publishedAt: meta.publishedAt, author: meta.author, tags: meta.tags };
}

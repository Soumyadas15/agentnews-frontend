import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Bot } from "lucide-react";
import type { Article } from "@/types";
import { readingTime, unsplashFallback } from "@/lib/utils";

interface Props { article: Article; variant?: "hero" | "vertical" | "horizontal" | "minimal"; }

const isBot = (name: string) => name.toLowerCase().includes("agent") || name.toLowerCase().includes("bot");

function AiBadge() {
  return (
    <span className="ai-badge">
      <Bot size={9} />
      AI Sourced
    </span>
  );
}

function CoverImg({ src, alt, className, style }: { src?: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const fallback = unsplashFallback(alt);
  return (
    <img
      src={src || fallback}
      alt={alt}
      className={className}
      style={style}
      onError={e => { (e.currentTarget as HTMLImageElement).src = fallback; }}
      loading="lazy"
    />
  );
}

export default function ArticleCard({ article, variant = "horizontal" }: Props) {
  const date = article.publishedAt || article.createdAt;
  const href = `/articles/${article.slug}`;
  const rt = readingTime(article.content || article.excerpt);
  const aiSourced = isBot(article.author.name);

  if (variant === "hero") return (
    <Link to={href} className="group block">
      <div className="relative overflow-hidden" style={{ borderRadius: "3px" }}>
        <CoverImg
          src={article.coverImage}
          alt={article.title}
          className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          style={{ height: "clamp(300px,44vw,540px)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,14,12,0.95) 0%, rgba(15,14,12,0.3) 55%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="category-tag">{article.category.name}</span>
            {aiSourced && <AiBadge />}
          </div>
          <h2 className="headline mt-1 text-white group-hover:opacity-85 transition-opacity" style={{ fontSize: "clamp(1.5rem,3.5vw,2.5rem)", lineHeight: 1.1, letterSpacing: "-0.025em", maxWidth: "32ch" }}>
            {article.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: "rgba(255,255,255,0.65)", maxWidth: "54ch" }}>{article.excerpt}</p>
          <p className="mt-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{article.author.name}</span>
            <span className="mx-1.5" style={{ opacity: 0.4 }}>·</span>
            {format(new Date(date), "MMM d, yyyy")}
            <span className="mx-1.5" style={{ opacity: 0.4 }}>·</span>
            {rt}
          </p>
        </div>
      </div>
    </Link>
  );

  if (variant === "vertical") return (
    <Link to={href} className="group block">
      <div className="overflow-hidden mb-3" style={{ borderRadius: "3px" }}>
        <CoverImg
          src={article.coverImage}
          alt={article.title}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-center gap-1.5 flex-wrap mb-1">
        <span className="category-tag">{article.category.name}</span>
        {aiSourced && <AiBadge />}
      </div>
      <h3 className="headline mt-2 text-lg leading-snug line-clamp-2 transition-colors group-hover:opacity-70" style={{ letterSpacing: "-0.01em", color: "var(--ink)" }}>{article.title}</h3>
      <p className="mt-1 text-sm line-clamp-2 leading-relaxed" style={{ color: "var(--ink-muted)" }}>{article.excerpt}</p>
      <p className="mt-2 text-[11px]" style={{ color: "var(--ink-faint)" }}>
        {article.author.name} · {format(new Date(date), "MMM d, yyyy")} · {rt}
      </p>
    </Link>
  );

  if (variant === "minimal") return (
    <Link to={href} className="group flex gap-3 items-start py-4" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="category-tag">{article.category.name}</span>
          {aiSourced && <AiBadge />}
        </div>
        <h3 className="headline mt-1.5 text-base leading-snug line-clamp-2 transition-opacity group-hover:opacity-60" style={{ letterSpacing: "-0.01em", color: "var(--ink)" }}>{article.title}</h3>
        <p className="mt-1 text-[11px]" style={{ color: "var(--ink-faint)" }}>{article.author.name} · {format(new Date(date), "MMM d")}</p>
      </div>
      <div className="shrink-0 overflow-hidden" style={{ borderRadius: "2px" }}>
        <CoverImg src={article.coverImage} alt={article.title} className="w-20 h-[54px] object-cover" />
      </div>
    </Link>
  );

  // horizontal (default)
  return (
    <Link to={href} className="group flex gap-5 items-start py-5" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="category-tag">{article.category.name}</span>
          {aiSourced && <AiBadge />}
        </div>
        <h3 className="headline mt-2 text-xl leading-snug line-clamp-2 transition-opacity group-hover:opacity-70" style={{ letterSpacing: "-0.015em", color: "var(--ink)" }}>{article.title}</h3>
        <p className="mt-1 text-sm line-clamp-2 leading-relaxed hidden sm:block" style={{ color: "var(--ink-muted)" }}>{article.excerpt}</p>
        <p className="mt-2 text-[11px]" style={{ color: "var(--ink-muted)" }}>
          <span style={{ fontWeight: 500, color: "var(--ink)", opacity: 0.7 }}>{article.author.name}</span>
          <span className="mx-1.5" style={{ opacity: 0.4 }}>·</span>
          {format(new Date(date), "MMM d, yyyy")}
          <span className="mx-1.5" style={{ opacity: 0.4 }}>·</span>
          {article.views.toLocaleString()} views
          <span className="mx-1.5" style={{ opacity: 0.4 }}>·</span>
          {rt}
        </p>
      </div>
      <div className="shrink-0 overflow-hidden" style={{ borderRadius: "3px" }}>
        <CoverImg
          src={article.coverImage}
          alt={article.title}
          className="w-28 h-20 sm:w-36 sm:h-24 object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
    </Link>
  );
}

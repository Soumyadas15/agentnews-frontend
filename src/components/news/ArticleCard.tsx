import { Link } from "react-router-dom";
import { format } from "date-fns";
import type { Article } from "@/types";

interface Props { article: Article; variant?: "hero"|"vertical"|"horizontal"|"minimal"; }

export default function ArticleCard({ article, variant = "horizontal" }: Props) {
  const date = article.publishedAt || article.createdAt;
  const href = `/articles/${article.slug}`;

  if (variant === "hero") return (
    <Link to={href} className="group block">
      <div className="relative overflow-hidden" style={{borderRadius:"3px"}}>
        {article.coverImage
          ? <img src={article.coverImage} alt={article.title} className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" style={{height:"clamp(300px,44vw,540px)"}} />
          : <div className="w-full bg-surface-alt flex items-center justify-center" style={{height:"clamp(300px,44vw,540px)"}}><span className="headline text-9xl text-ink-faint opacity-10">AN</span></div>
        }
        <div className="absolute inset-0" style={{background:"linear-gradient(to top, rgba(20,18,14,0.93) 0%, rgba(20,18,14,0.35) 55%, transparent 100%)"}} />
        <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10">
          <span className="category-tag">{article.category.name}</span>
          <h2 className="headline mt-3 text-white group-hover:opacity-85 transition-opacity" style={{fontSize:"clamp(1.5rem,3.5vw,2.5rem)",lineHeight:1.12,letterSpacing:"-0.02em",maxWidth:"32ch"}}>
            {article.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed line-clamp-2 text-white/70" style={{maxWidth:"54ch"}}>{article.excerpt}</p>
          <p className="mt-3 text-xs text-white/55">
            <span className="font-medium text-white/80">{article.author.name}</span>
            <span className="mx-1.5 opacity-50">·</span>
            {format(new Date(date),"MMM d, yyyy")}
          </p>
        </div>
      </div>
    </Link>
  );

  if (variant === "vertical") return (
    <Link to={href} className="group block">
      {article.coverImage
        ? <div className="overflow-hidden mb-3" style={{borderRadius:"3px"}}><img src={article.coverImage} alt={article.title} className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-[1.03]" /></div>
        : <div className="w-full h-44 bg-surface-alt mb-3 flex items-center justify-center" style={{borderRadius:"3px"}}><span className="headline text-4xl opacity-10">AN</span></div>
      }
      <span className="category-tag">{article.category.name}</span>
      <h3 className="headline mt-2 text-lg leading-snug group-hover:text-amber transition-colors line-clamp-2" style={{letterSpacing:"-0.01em"}}>{article.title}</h3>
      <p className="mt-1 text-sm text-ink-muted line-clamp-2 leading-relaxed">{article.excerpt}</p>
      <p className="mt-2 text-[11px] text-ink-faint">{article.author.name} · {format(new Date(date),"MMM d, yyyy")}</p>
    </Link>
  );

  if (variant === "minimal") return (
    <Link to={href} className="group flex gap-3 items-start py-4 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <span className="category-tag">{article.category.name}</span>
        <h3 className="headline mt-1.5 text-base leading-snug group-hover:text-amber transition-colors line-clamp-2" style={{letterSpacing:"-0.01em"}}>{article.title}</h3>
        <p className="mt-1 text-[11px] text-ink-faint">{article.author.name} · {format(new Date(date),"MMM d")}</p>
      </div>
      {article.coverImage && <img src={article.coverImage} alt="" className="w-20 h-[54px] object-cover shrink-0" style={{borderRadius:"2px"}} />}
    </Link>
  );

  // horizontal (default)
  return (
    <Link to={href} className="group flex gap-5 items-start py-5 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <span className="category-tag">{article.category.name}</span>
        <h3 className="headline mt-2 text-xl leading-snug group-hover:text-amber transition-colors line-clamp-2" style={{letterSpacing:"-0.015em"}}>{article.title}</h3>
        <p className="mt-1 text-sm text-ink-muted line-clamp-2 leading-relaxed hidden sm:block">{article.excerpt}</p>
        <p className="mt-2 text-[11px] text-ink-muted">
          <span className="font-medium text-ink/70">{article.author.name}</span>
          <span className="mx-1.5 opacity-40">·</span>
          {format(new Date(date),"MMM d, yyyy")}
          <span className="mx-1.5 opacity-40">·</span>
          {article.views.toLocaleString()} views
        </p>
      </div>
      {article.coverImage && (
        <div className="shrink-0 overflow-hidden" style={{borderRadius:"3px"}}>
          <img src={article.coverImage} alt="" className="w-28 h-20 sm:w-36 sm:h-24 object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        </div>
      )}
    </Link>
  );
}

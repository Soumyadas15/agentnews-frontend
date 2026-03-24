import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";
import { format } from "date-fns";

export default function TrendingWidget() {
  // Sort by views — backend supports this via the default ordering, we just grab top 5
  const { data } = useArticles({ limit: 5, published: "true" });
  const articles = (data?.articles ?? [])
    .slice()
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  if (!articles.length) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-5" style={{ borderBottom: "2px solid var(--amber)", paddingBottom: "10px" }}>
        <TrendingUp size={14} style={{ color: "var(--amber)" }} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-muted)" }}>
          Most Read
        </span>
      </div>
      <div className="space-y-0">
        {articles.map((a, i) => (
          <Link
            key={a.id}
            to={`/articles/${a.slug}`}
            className="group flex gap-4 items-start py-4 transition-opacity hover:opacity-75"
            style={{ borderBottom: i < articles.length - 1 ? "1px solid var(--border)" : "none" }}
          >
            <span
              className="headline shrink-0 leading-none mt-0.5"
              style={{ fontSize: "1.75rem", color: "var(--border-strong)", minWidth: "2rem", textAlign: "right" }}
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <span className="category-tag" style={{ fontSize: "9px", padding: "1px 5px" }}>{a.category.name}</span>
              <h4
                className="headline mt-1.5 leading-snug line-clamp-2 group-hover:opacity-75 transition-opacity"
                style={{ fontSize: "0.95rem", letterSpacing: "-0.01em", color: "var(--ink)" }}
              >
                {a.title}
              </h4>
              <p className="mt-1 text-[11px]" style={{ color: "var(--ink-faint)" }}>
                {a.views.toLocaleString()} views
                <span style={{ margin: "0 6px", opacity: 0.4 }}>·</span>
                {format(new Date(a.publishedAt || a.createdAt), "MMM d")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

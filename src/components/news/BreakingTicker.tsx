import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import { Zap } from "lucide-react";

export default function BreakingTicker() {
  const { data } = useArticles({ limit: 12, published: "true" });
  const articles = data?.articles ?? [];
  if (articles.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...articles, ...articles];

  return (
    <div
      className="overflow-hidden border-b"
      style={{
        background: "var(--ticker-bg)",
        borderColor: "var(--ticker-bg)",
        height: "36px",
      }}
    >
      <div className="flex items-center h-full">
        {/* Label */}
        <div
          className="shrink-0 flex items-center gap-2 px-4 h-full z-10"
          style={{ background: "var(--amber)", minWidth: "fit-content" }}
        >
          <Zap size={12} fill="white" color="white" />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "white",
              whiteSpace: "nowrap",
            }}
          >
            Latest
          </span>
        </div>

        {/* Scrolling track */}
        <div className="flex-1 overflow-hidden relative">
          <div className="ticker-track">
            {items.map((a, i) => (
              <Link
                key={`${a.id}-${i}`}
                to={`/articles/${a.slug}`}
                className="inline-flex items-center gap-3 px-6 shrink-0 group"
                style={{ color: "var(--ticker-text)" }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                    opacity: 0.9,
                    transition: "opacity 0.15s",
                  }}
                  className="group-hover:opacity-100 group-hover:underline underline-offset-2"
                >
                  {a.title}
                </span>
                <span style={{ opacity: 0.3, fontSize: "14px" }}>·</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useArticles, useCategories } from "@/hooks/useArticles";
import ArticleCard from "@/components/news/ArticleCard";
import TrendingWidget from "@/components/news/TrendingWidget";
import NewsletterBox from "@/components/news/NewsletterBox";
import SEO from "@/components/SEO";

function SectionRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6" style={{ borderBottom: "2px solid var(--border)", paddingBottom: "10px" }}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] shrink-0" style={{ color: "var(--ink-muted)" }}>{label}</span>
    </div>
  );
}

export default function Home() {
  const { data: featured } = useArticles({ featured: "true", limit: 4 });
  const { data: latest }   = useArticles({ limit: 10 });
  const { data: cats }     = useCategories();

  const [hero, ...sub] = featured?.articles ?? [];
  const articles = latest?.articles ?? [];

  return (
    <>
      <SEO />

      {/* Hero grid */}
      {hero && (
        <section className="mb-12">
          <div
            className="grid grid-cols-1 lg:grid-cols-3"
            style={{ gap: "1px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}
          >
            <div className="lg:col-span-2" style={{ background: "var(--bg)" }}>
              <ArticleCard article={hero} variant="hero" />
            </div>
            <div style={{ background: "var(--bg)" }} className="flex flex-col divide-y" >
              {(sub.length ? sub : articles).slice(0, 3).map(a => (
                <div key={a.id} className="p-5 flex-1" style={{ borderColor: "var(--border)" }}>
                  <ArticleCard article={a} variant="minimal" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        <section>
          <SectionRule label="Latest Stories" />
          <div>
            {articles.length === 0
              ? <p className="py-16 text-center text-sm" style={{ color: "var(--ink-muted)" }}>Stories loading…</p>
              : articles.map(a => <ArticleCard key={a.id} article={a} variant="horizontal" />)
            }
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/articles"
              className="text-[11px] font-semibold uppercase tracking-[0.12em] pb-0.5 hover:opacity-50 transition-opacity"
              style={{ borderBottom: "1px solid var(--ink)", color: "var(--ink)" }}
            >
              All stories →
            </Link>
          </div>
        </section>

        <aside className="space-y-10">
          {/* Trending */}
          <TrendingWidget />

          {/* Topics */}
          <div>
            <div style={{ borderBottom: "2px solid var(--border)", paddingBottom: "10px", marginBottom: "16px" }}>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-muted)" }}>Topics</span>
            </div>
            <div>
              {cats?.map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  className="flex items-center justify-between py-3 group transition-opacity hover:opacity-70"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold w-5 text-right tabular-nums" style={{ color: "var(--ink-faint)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="headline text-base" style={{ color: "var(--ink)" }}>{cat.name}</span>
                  </div>
                  <span className="text-[11px] tabular-nums" style={{ color: "var(--ink-faint)" }}>
                    {cat._count?.articles ?? 0}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <NewsletterBox />
        </aside>
      </div>
    </>
  );
}

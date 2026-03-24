import { Link } from "react-router-dom";
import { useArticles, useCategories } from "@/hooks/useArticles";
import ArticleCard from "@/components/news/ArticleCard";

function SectionRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted shrink-0">{label}</span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}

export default function Home() {
  const { data: featured } = useArticles({ featured: "true", limit: 4 });
  const { data: latest } = useArticles({ limit: 10 });
  const { data: cats } = useCategories();
  const [hero, ...sub] = featured?.articles ?? [];
  const articles = latest?.articles ?? [];

  return (
    <div>
      {/* Hero grid */}
      {hero && (
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
            <div className="lg:col-span-2 bg-background"><ArticleCard article={hero} variant="hero" /></div>
            <div className="bg-background flex flex-col divide-y divide-border">
              {(sub.length ? sub : articles).slice(0,3).map(a => (
                <div key={a.id} className="p-5 flex-1"><ArticleCard article={a} variant="minimal" /></div>
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
              ? <p className="py-16 text-center text-ink-muted text-sm">No stories yet.</p>
              : articles.map(a => <ArticleCard key={a.id} article={a} variant="horizontal" />)
            }
          </div>
          <div className="mt-8 text-center">
            <Link to="/articles" className="text-[11px] font-semibold uppercase tracking-[0.12em] border-b border-ink pb-0.5 hover:opacity-50 transition-opacity">
              All stories →
            </Link>
          </div>
        </section>

        <aside className="space-y-10">
          {/* Topics */}
          <div>
            <SectionRule label="Topics" />
            <div className="divide-y divide-border">
              {cats?.map((cat, i) => (
                <Link key={cat.id} to={`/categories/${cat.slug}`} className="flex items-center justify-between py-3 group">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold text-ink-faint w-5 text-right tabular-nums">{String(i+1).padStart(2,"0")}</span>
                    <span className="headline text-base group-hover:text-amber transition-colors">{cat.name}</span>
                  </div>
                  <span className="text-[11px] text-ink-faint tabular-nums">{cat._count?.articles ?? 0}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="border border-border p-6" style={{borderRadius:"3px"}}>
            <h3 className="headline text-xl mb-1" style={{letterSpacing:"-0.01em"}}>Stay informed</h3>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">The day's most important stories, every morning.</p>
            <input type="email" placeholder="your@email.com" className="input-field mb-2" />
            <button className="btn-primary w-full text-center">Subscribe</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

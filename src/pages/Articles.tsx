import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useArticles, useCategories } from "@/hooks/useArticles";
import ArticleCard from "@/components/news/ArticleCard";

export default function Articles() {
  const [sp, setSp] = useSearchParams();
  const [search, setSearch] = useState(sp.get("search") || "");
  const page = parseInt(sp.get("page") || "1");
  const cat = sp.get("category") || undefined;

  const { data, isLoading } = useArticles({ page, limit: 16, ...(cat && { category: cat }), ...(sp.get("search") && { search: sp.get("search")! }) });
  const { data: cats } = useCategories();

  const setFilter = (key: string, val?: string) => setSp(p => { val ? p.set(key, val) : p.delete(key); p.set("page","1"); return p; });

  return (
    <div>
      <div className="mb-10 pb-6 border-b border-border">
        <h1 className="headline text-4xl leading-tight" style={{letterSpacing:"-0.02em"}}>All Stories</h1>
        <p className="text-sm text-ink-muted mt-1">The complete AgentNews archive</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12">
        <div>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[{ slug: "", name: "All" }, ...(cats ?? [])].map(c => (
              <button key={c.slug} onClick={() => setFilter("category", c.slug || undefined)}
                className="text-[11px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 border transition-colors"
                style={{ borderRadius:"2px", background: (!cat && !c.slug) || cat===c.slug ? "#1A1814" : "transparent", borderColor: (!cat && !c.slug) || cat===c.slug ? "#1A1814" : "#E8E4DC", color: (!cat && !c.slug) || cat===c.slug ? "#fff" : "#706B61" }}>
                {c.name}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="divide-y divide-border">
              {[...Array(6)].map((_,i) => (
                <div key={i} className="flex gap-5 py-5 animate-pulse">
                  <div className="flex-1 space-y-2"><div className="h-3 bg-surface-alt rounded w-16" /><div className="h-5 bg-surface-alt rounded w-3/4" /><div className="h-3 bg-surface-alt rounded w-32" /></div>
                  <div className="w-32 h-20 bg-surface-alt rounded shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div>{data?.articles.map(a => <ArticleCard key={a.id} article={a} variant="horizontal" />)}</div>
              {data?.articles.length === 0 && <p className="py-16 text-center text-ink-muted text-sm">No stories found.</p>}
              {data?.meta && data.meta.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  {data.meta.hasPrevPage && <button onClick={() => setSp(p => { p.set("page",String(page-1)); return p; })} className="text-[11px] font-semibold uppercase tracking-[0.1em] border border-border px-4 py-2 hover:border-ink transition-colors" style={{borderRadius:"2px"}}>← Previous</button>}
                  <span className="text-xs text-ink-muted tabular-nums">{data.meta.page} / {data.meta.totalPages}</span>
                  {data.meta.hasNextPage && <button onClick={() => setSp(p => { p.set("page",String(page+1)); return p; })} className="text-[11px] font-semibold uppercase tracking-[0.1em] border border-border px-4 py-2 hover:border-ink transition-colors" style={{borderRadius:"2px"}}>Next →</button>}
                </div>
              )}
            </>
          )}
        </div>

        <aside>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted mb-3">Search</p>
          <form onSubmit={e => { e.preventDefault(); setFilter("search", search || undefined); }} className="flex gap-2">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="input-field flex-1" />
            <button type="submit" className="btn-primary px-4 py-2">Go</button>
          </form>
        </aside>
      </div>
    </div>
  );
}

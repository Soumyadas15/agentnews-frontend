import { useParams, Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import ArticleCard from "@/components/news/ArticleCard";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useArticles({ category: slug!, limit: 20 });
  const name = slug?.replace(/-/g," ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div>
      <div className="mb-10 pb-6 border-b border-border">
        <p className="text-xs text-ink-muted mb-2"><Link to="/categories" className="hover:text-ink">Topics</Link> / {name}</p>
        <h1 className="headline text-4xl leading-tight" style={{letterSpacing:"-0.02em"}}>{name}</h1>
        {data && <p className="text-sm text-ink-muted mt-1">{data.meta.total} stories</p>}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[...Array(6)].map((_,i) => <div key={i} className="animate-pulse"><div className="h-44 bg-surface-alt rounded mb-3" /><div className="h-4 bg-surface-alt rounded w-3/4 mb-2" /><div className="h-3 bg-surface-alt rounded w-1/2" /></div>)}
        </div>
      ) : (
        <>
          {data?.articles[0] && <div className="mb-10"><ArticleCard article={data.articles[0]} variant="hero" /></div>}
          {data && data.articles.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-2">
              {data.articles.slice(1).map(a => <ArticleCard key={a.id} article={a} variant="vertical" />)}
            </div>
          )}
          {data?.articles.length === 0 && <p className="py-16 text-center text-ink-muted text-sm">No stories in this topic yet.</p>}
        </>
      )}
    </div>
  );
}

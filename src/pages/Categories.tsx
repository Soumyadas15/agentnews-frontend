import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useArticles";

export default function Categories() {
  const { data: cats, isLoading } = useCategories();
  return (
    <div>
      <div className="mb-10 pb-6 border-b border-border">
        <h1 className="headline text-4xl leading-tight" style={{letterSpacing:"-0.02em"}}>Topics</h1>
        <p className="text-sm text-ink-muted mt-1">Browse stories by subject</p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">{[...Array(8)].map((_,i)=><div key={i} className="h-36 bg-background animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {cats?.map((cat,i) => (
            <Link key={cat.id} to={`/categories/${cat.slug}`} className="group bg-background p-8 flex flex-col justify-between hover:bg-surface-alt transition-colors" style={{minHeight:"160px"}}>
              <span className="headline text-3xl text-ink-faint/20 tabular-nums">{String(i+1).padStart(2,"0")}</span>
              <div>
                <h2 className="headline text-xl group-hover:text-amber transition-colors leading-snug" style={{letterSpacing:"-0.01em"}}>{cat.name}</h2>
                <p className="text-xs text-ink-muted mt-1">{cat._count?.articles ?? 0} {cat._count?.articles===1?"story":"stories"}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

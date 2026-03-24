import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { useArticle, useArticles } from "@/hooks/useArticles";
import { useAuth } from "@/store/auth";
import ArticleCard from "@/components/news/ArticleCard";
import api from "@/lib/api";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error, refetch } = useArticle(slug!);
  const { isAuth } = useAuth();
  const { data: more } = useArticles({ limit: 3, ...(article?.category.slug ? { category: article.category.slug } : {}) });
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!comment.trim()) return;
    setSubmitting(true);
    try { await api.post(`/articles/${article!.id}/comments`, { content: comment }); setComment(""); setSubmitted(true); refetch(); }
    catch {} finally { setSubmitting(false); }
  };

  if (isLoading) return (
    <div className="max-w-2xl mx-auto py-16 space-y-5 animate-pulse">
      {[24,48,32,16,16,16,16,16,16].map((w,i) => <div key={i} className="bg-surface-alt rounded" style={{height:i===1?64:16,width:`${w+Math.random()*30}%`}} />)}
    </div>
  );

  if (error || !article) return (
    <div className="py-32 text-center">
      <p className="headline text-8xl opacity-[0.05] leading-none mb-0">404</p>
      <h1 className="headline text-2xl mt-0 mb-3" style={{marginTop:"-1.5rem"}}>Story not found</h1>
      <Link to="/articles" className="text-[11px] font-semibold uppercase tracking-[0.12em] border-b border-ink pb-0.5 hover:opacity-50 transition-opacity">Browse all stories</Link>
    </div>
  );

  const date = article.publishedAt || article.createdAt;
  const related = more?.articles.filter(a => a.id !== article.id).slice(0,3) ?? [];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] text-ink-muted mb-5">
        <Link to="/" className="hover:text-ink transition-colors">Home</Link>
        <span className="opacity-40">/</span>
        <Link to={`/categories/${article.category.slug}`} className="hover:text-ink transition-colors">{article.category.name}</Link>
      </div>

      <span className="category-tag">{article.category.name}</span>

      <h1 className="headline mt-4 mb-5 leading-[1.1]" style={{fontSize:"clamp(1.9rem,4vw,2.85rem)",letterSpacing:"-0.025em"}}>
        {article.title}
      </h1>

      <p className="text-lg text-ink-muted leading-relaxed mb-6 pl-4 border-l-2 border-border-strong italic">
        {article.excerpt}
      </p>

      {/* Byline */}
      <div className="flex items-center gap-3 py-4 border-y border-border mb-8">
        <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center text-sm font-semibold text-white shrink-0">
          {article.author.name[0]}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">{article.author.name}</p>
          <p className="text-[11px] text-ink-muted">
            {format(new Date(date),"MMMM d, yyyy")}
            <span className="mx-1.5 opacity-40">·</span>{article.views.toLocaleString()} views
            <span className="mx-1.5 opacity-40">·</span>{article._count?.comments ?? 0} comments
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map(t => <span key={t.id} className="text-[10px] text-ink-muted bg-surface-alt px-2 py-0.5" style={{borderRadius:"2px"}}>#{t.name}</span>)}
        </div>
      </div>

      {article.coverImage && (
        <figure className="mb-8 -mx-6">
          <img src={article.coverImage} alt={article.title} className="w-full object-cover" style={{maxHeight:"500px"}} />
        </figure>
      )}

      <div className="prose-article text-[1.0625rem]" dangerouslySetInnerHTML={{ __html: article.content }} />

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
          {article.tags.map(t => <span key={t.id} className="text-xs border border-border px-3 py-1 text-ink-muted hover:border-ink hover:text-ink transition-colors cursor-pointer" style={{borderRadius:"2px"}}>{t.name}</span>)}
        </div>
      )}

      {/* Comments */}
      <section className="mt-12 pt-8 border-t border-border">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted shrink-0">Discussion</span>
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-ink-faint">{article.comments?.length ?? 0} comments</span>
        </div>

        {isAuth() ? (
          <form onSubmit={submit} className="mb-8">
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4} placeholder="Share your thoughts…"
              className="input-field resize-none leading-relaxed mb-2" />
            {submitted && <p className="text-xs mb-2" style={{color:"#437A22"}}>Your comment has been submitted.</p>}
            <div className="flex justify-end">
              <button type="submit" disabled={submitting || !comment.trim()} className="btn-primary">
                {submitting ? "Posting…" : "Post comment"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 border border-border p-5 text-sm text-ink-muted" style={{borderRadius:"2px"}}>
            <Link to="/login" className="font-semibold text-ink hover:opacity-70 transition-opacity">Sign in</Link> to join the discussion.
          </div>
        )}

        <div>
          {article.comments?.map(c => (
            <div key={c.id} className="py-5 border-b border-border last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-ink-muted flex items-center justify-center text-xs font-semibold text-white">{c.author.name[0]}</div>
                <span className="text-sm font-semibold">{c.author.name}</span>
                <span className="text-xs text-ink-faint opacity-60">{formatDistanceToNow(new Date(c.createdAt), { addSuffix:true })}</span>
              </div>
              <p className="text-sm leading-relaxed text-ink-muted pl-9">{c.content}</p>
            </div>
          ))}
          {(!article.comments || article.comments.length === 0) && <p className="text-sm text-ink-muted py-4">No comments yet.</p>}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14 pt-8 border-t border-border">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted shrink-0">More from {article.category.name}</span>
            <div className="flex-1 border-t border-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {related.map(a => <ArticleCard key={a.id} article={a} variant="vertical" />)}
          </div>
        </section>
      )}
    </div>
  );
}

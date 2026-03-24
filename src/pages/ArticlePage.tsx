import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { Link2, Check, Bot, Clock } from "lucide-react";

const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
import { useArticle, useArticles } from "@/hooks/useArticles";
import { useAuth } from "@/store/auth";
import ArticleCard from "@/components/news/ArticleCard";
import SEO from "@/components/SEO";
import api from "@/lib/api";
import { readingTime, unsplashFallback } from "@/lib/utils";

const isBot = (name: string) => name.toLowerCase().includes("agent") || name.toLowerCase().includes("bot");

function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] mr-1" style={{ color: "var(--ink-muted)" }}>Share</span>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="share-btn">
        <XIcon />
        X / Twitter
      </a>
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="share-btn">
        <LinkedInIcon />
        LinkedIn
      </a>
      <button onClick={copy} className={`share-btn ${copied ? "copied" : ""}`}>
        {copied ? <Check size={12} /> : <Link2 size={12} />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error, refetch } = useArticle(slug!);
  const { isAuth } = useAuth();
  const { data: more } = useArticles({
    limit: 4,
    ...(article?.category.slug ? { category: article.category.slug } : {}),
  });
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/articles/${article!.id}/comments`, { content: comment });
      setComment(""); setSubmitted(true); refetch();
    } catch {} finally { setSubmitting(false); }
  };

  if (isLoading) return (
    <div className="max-w-2xl mx-auto py-16 space-y-5 animate-pulse">
      {[24, 48, 32, 16, 16, 16, 16, 16, 16].map((w, i) => (
        <div key={i} style={{ background: "var(--bg-alt)", borderRadius: "2px", height: i === 1 ? 64 : 16, width: `${w + Math.random() * 30}%` }} />
      ))}
    </div>
  );

  if (error || !article) return (
    <div className="py-32 text-center">
      <p className="headline text-8xl leading-none select-none" style={{ opacity: 0.04, color: "var(--ink)" }}>404</p>
      <h1 className="headline text-2xl mb-3" style={{ marginTop: "-1.5rem", color: "var(--ink)" }}>Story not found</h1>
      <Link to="/articles" className="text-[11px] font-semibold uppercase tracking-[0.12em] pb-0.5 hover:opacity-50 transition-opacity" style={{ borderBottom: "1px solid var(--ink)" }}>Browse all stories</Link>
    </div>
  );

  const date = article.publishedAt || article.createdAt;
  const related = more?.articles.filter(a => a.id !== article.id).slice(0, 3) ?? [];
  const rt = readingTime(article.content || article.excerpt);
  const aiSourced = isBot(article.author.name);
  const pageUrl = `https://theagentnews.com/articles/${article.slug}`;
  const coverImg = article.coverImage || unsplashFallback(article.title);

  return (
    <>
      <SEO
        title={article.title}
        description={article.excerpt}
        image={coverImg}
        url={`/articles/${article.slug}`}
        type="article"
        publishedAt={date}
        author={article.author.name}
        tags={article.tags.map(t => t.name)}
      />

      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] mb-6" style={{ color: "var(--ink-muted)" }}>
          <Link to="/" className="hover:opacity-70 transition-opacity">Home</Link>
          <span style={{ opacity: 0.4 }}>/</span>
          <Link to={`/categories/${article.category.slug}`} className="hover:opacity-70 transition-opacity">{article.category.name}</Link>
        </div>

        {/* Category + AI badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="category-tag">{article.category.name}</span>
          {aiSourced && (
            <span className="ai-badge">
              <Bot size={9} />
              AI Sourced
            </span>
          )}
        </div>

        {/* Headline */}
        <h1 className="headline mt-4 mb-5 leading-[1.08]" style={{ fontSize: "clamp(1.9rem, 4vw, 2.85rem)", letterSpacing: "-0.025em", color: "var(--ink)" }}>
          {article.title}
        </h1>

        {/* Excerpt pull-quote */}
        <p className="text-lg leading-relaxed mb-6 pl-4 italic" style={{ color: "var(--ink-muted)", borderLeft: "2px solid var(--border-strong)" }}>
          {article.excerpt}
        </p>

        {/* Byline */}
        <div className="flex items-center gap-3 py-4" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: "2rem" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style={{ background: "var(--ink)", color: "var(--bg)" }}>
            {aiSourced ? <Bot size={16} /> : article.author.name[0]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{article.author.name}</p>
            <div className="flex items-center gap-2 flex-wrap" style={{ color: "var(--ink-faint)", fontSize: "11px" }}>
              <span>{format(new Date(date), "MMMM d, yyyy")}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span className="flex items-center gap-1"><Clock size={10} /> {rt}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{article.views.toLocaleString()} views</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{article._count?.comments ?? 0} comments</span>
            </div>
          </div>
          <div className="flex-wrap gap-1.5 hidden sm:flex">
            {article.tags.slice(0, 3).map(t => (
              <span key={t.id} className="text-[10px] px-2 py-0.5" style={{ borderRadius: "2px", background: "var(--bg-alt)", color: "var(--ink-muted)", border: "1px solid var(--border)" }}>
                #{t.name}
              </span>
            ))}
          </div>
        </div>

        {/* Cover image */}
        <figure className="mb-10 -mx-4 sm:-mx-6">
          <img
            src={coverImg}
            alt={article.title}
            className="w-full object-cover"
            style={{ maxHeight: "520px" }}
            onError={e => { (e.currentTarget as HTMLImageElement).src = unsplashFallback(article.title); }}
          />
        </figure>

        {/* Article body */}
        <div className="prose-article text-[1.0625rem]" dangerouslySetInnerHTML={{ __html: article.content }} />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
            {article.tags.map(t => (
              <Link
                key={t.id}
                to={`/articles?search=${encodeURIComponent(t.name)}`}
                className="text-xs px-3 py-1 transition-colors"
                style={{ borderRadius: "2px", border: "1px solid var(--border)", color: "var(--ink-muted)" }}
              >
                {t.name}
              </Link>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <ShareButtons title={article.title} url={pageUrl} />
        </div>

        {/* Comments */}
        <section className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] shrink-0" style={{ color: "var(--ink-muted)" }}>Discussion</span>
            <div className="flex-1" style={{ borderTop: "1px solid var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--ink-faint)" }}>{article.comments?.length ?? 0} comments</span>
          </div>

          {isAuth() ? (
            <form onSubmit={submit} className="mb-8">
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                placeholder="Share your thoughts…"
                className="input-field resize-none leading-relaxed mb-2"
              />
              {submitted && <p className="text-xs mb-2" style={{ color: "#437A22" }}>Comment submitted for review.</p>}
              <div className="flex justify-end">
                <button type="submit" disabled={submitting || !comment.trim()} className="btn-primary">
                  {submitting ? "Posting…" : "Post comment"}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-5 text-sm" style={{ borderRadius: "2px", border: "1px solid var(--border)", color: "var(--ink-muted)" }}>
              <button onClick={() => {}} className="font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--ink)" }}>Sign in</button> to join the discussion.
            </div>
          )}

          <div>
            {article.comments?.map(c => (
              <div key={c.id} className="py-5" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: "var(--ink-muted)", color: "var(--bg)" }}>
                    {c.author.name[0]}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{c.author.name}</span>
                  <span className="text-xs" style={{ color: "var(--ink-faint)", opacity: 0.6 }}>
                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed pl-9" style={{ color: "var(--ink-muted)" }}>{c.content}</p>
              </div>
            ))}
            {(!article.comments || article.comments.length === 0) && (
              <p className="text-sm py-4" style={{ color: "var(--ink-muted)" }}>No comments yet. Be the first.</p>
            )}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-14 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] shrink-0" style={{ color: "var(--ink-muted)" }}>More from {article.category.name}</span>
              <div className="flex-1" style={{ borderTop: "1px solid var(--border)" }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {related.map(a => <ArticleCard key={a.id} article={a} variant="vertical" />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

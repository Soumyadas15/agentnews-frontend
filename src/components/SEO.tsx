import { Helmet } from "react-helmet-async";
import { buildSEO, SEOMeta } from "@/hooks/useSEO";

export default function SEO(props: SEOMeta) {
  const s = buildSEO(props);
  return (
    <Helmet>
      <title>{s.title}</title>
      <meta name="description" content={s.description} />
      {s.tags && <meta name="keywords" content={s.tags.join(", ")} />}
      <link rel="canonical" href={s.url} />

      {/* Open Graph */}
      <meta property="og:type" content={s.type} />
      <meta property="og:site_name" content="AgentNews" />
      <meta property="og:title" content={s.title} />
      <meta property="og:description" content={s.description} />
      <meta property="og:image" content={s.image} />
      <meta property="og:url" content={s.url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@theagentnews" />
      <meta name="twitter:title" content={s.title} />
      <meta name="twitter:description" content={s.description} />
      <meta name="twitter:image" content={s.image} />

      {/* Article-specific */}
      {s.type === "article" && s.publishedAt && (
        <meta property="article:published_time" content={s.publishedAt} />
      )}
      {s.type === "article" && s.author && (
        <meta property="article:author" content={s.author} />
      )}
    </Helmet>
  );
}

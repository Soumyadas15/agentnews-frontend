import { Link } from "react-router-dom";
import { Rss } from "lucide-react";

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const SECTIONS = [
  {
    title: "Coverage",
    links: [
      { label: "Artificial Intelligence", to: "/categories/artificial-intelligence" },
      { label: "Research", to: "/categories/research" },
      { label: "Industry", to: "/categories/industry" },
      { label: "Products", to: "/categories/products" },
      { label: "Policy", to: "/categories/policy" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "All Stories", to: "/articles" },
      { label: "Topics", to: "/categories" },
      { label: "RSS Feed", to: "/api/rss", external: true },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", to: "#signin" },
      { label: "Subscribe", to: "#subscribe" },
      { label: "Dashboard", to: "/dashboard" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ marginTop: "6rem", borderTop: "1px solid var(--border)", background: "var(--bg-surface)" }}>
      {/* Main footer grid */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
          {/* Brand column */}
          <div>
            <Link to="/">
              <span className="headline text-[1.75rem] leading-none" style={{ letterSpacing: "-0.02em", color: "var(--ink)" }}>
                Agent<span style={{ color: "var(--amber)" }}>News</span>
              </span>
            </Link>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mt-2" style={{ color: "var(--ink-faint)" }}>
              Independent · Informed · Insightful
            </p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--ink-muted)", maxWidth: "28ch" }}>
              AI-powered news coverage of artificial intelligence and its impact on the world — updated every few minutes.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-5">
              <a href="https://twitter.com/theagentnews" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-[2px] transition-colors"
                style={{ border: "1px solid var(--border)", color: "var(--ink-muted)" }}>
                <XIcon />
              </a>
              <a href="https://linkedin.com/company/agentnews" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-[2px] transition-colors"
                style={{ border: "1px solid var(--border)", color: "var(--ink-muted)" }}>
                <LinkedInIcon />
              </a>
              <a href="/api/rss" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-[2px] transition-colors"
                style={{ border: "1px solid var(--border)", color: "var(--ink-muted)" }}
                title="RSS Feed">
                <Rss size={14} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {SECTIONS.map(s => (
            <div key={s.title}>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: "var(--ink-faint)" }}>
                {s.title}
              </h4>
              <ul className="space-y-3">
                {s.links.map(l => (
                  <li key={l.label}>
                    {(l as any).external ? (
                      <a href={l.to} target="_blank" rel="noopener noreferrer"
                        className="text-sm transition-opacity hover:opacity-60" style={{ color: "var(--ink-muted)" }}>
                        {l.label}
                      </a>
                    ) : (
                      <Link to={l.to} className="text-sm transition-opacity hover:opacity-60" style={{ color: "var(--ink-muted)" }}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "var(--ink-faint)" }}>
            © {new Date().getFullYear()} AgentNews. All rights reserved.
          </p>
          <p className="text-[11px] flex items-center gap-1.5" style={{ color: "var(--ink-faint)" }}>
            Powered by AI · Updated every 3 minutes
            <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#437A22" }} />
          </p>
        </div>
      </div>
    </footer>
  );
}

import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Sun, Moon, Menu, X } from "lucide-react";
import { useAuth } from "@/store/auth";
import { useTheme } from "@/store/theme";
import { useCategories } from "@/hooks/useArticles";
import AuthDialog from "@/components/auth/AuthDialog";
import BreakingTicker from "@/components/news/BreakingTicker";

export default function Navbar() {
  const { user, logout, isAuth } = useAuth();
  const { dark, toggle } = useTheme();
  const { data: cats } = useCategories();
  const loc = useLocation();
  const nav = useNavigate();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const [authOpen, setAuthOpen]   = useState(false);
  const [authTab, setAuthTab]     = useState<"login" | "register">("login");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ]     = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const openLogin    = () => { setAuthTab("login");    setAuthOpen(true); setMobileOpen(false); };
  const openRegister = () => { setAuthTab("register"); setAuthOpen(true); setMobileOpen(false); };

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [loc.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    nav(`/articles?search=${encodeURIComponent(searchQ.trim())}`);
    setSearchQ(""); setSearchOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/articles", label: "All Stories" },
    ...(cats?.slice(0, 6).map(c => ({ to: `/categories/${c.slug}`, label: c.name })) ?? []),
  ];

  return (
    <>
      {/* ── Breaking ticker ───────────────────────────────────── */}
      <BreakingTicker />

      <header style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>

        {/* ── Utility bar ──────────────────────────────────────── */}
        <div style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
            <span className="text-[11px] hidden sm:block" style={{ color: "var(--ink-faint)" }}>{today}</span>

            <div className="flex items-center gap-4 ml-auto">
              {/* Dark mode toggle */}
              <button
                onClick={toggle}
                aria-label="Toggle dark mode"
                className="flex items-center justify-center w-7 h-7 rounded transition-colors"
                style={{ color: "var(--ink-muted)" }}
              >
                {dark ? <Sun size={14} strokeWidth={1.5} /> : <Moon size={14} strokeWidth={1.5} />}
              </button>

              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(o => !o)}
                aria-label="Search"
                className="flex items-center justify-center w-7 h-7 rounded transition-colors"
                style={{ color: "var(--ink-muted)" }}
              >
                <Search size={14} strokeWidth={1.5} />
              </button>

              <span style={{ width: "1px", height: "16px", background: "var(--border)" }} />

              {isAuth() ? (
                <>
                  <span className="text-[11px]" style={{ color: "var(--ink-muted)" }}>
                    {user?.name}
                    <span className="opacity-40 uppercase tracking-widest text-[9px] ml-1">{user?.role}</span>
                  </span>
                  {(user?.role === "ADMIN" || user?.role === "AUTHOR") && (
                    <Link to="/dashboard" className="text-[11px] font-semibold" style={{ color: "var(--amber)" }}>Dashboard</Link>
                  )}
                  <button onClick={() => { logout(); nav("/"); }} className="text-[11px] transition-colors" style={{ color: "var(--ink-muted)" }}>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={openLogin} className="text-[11px] transition-colors" style={{ color: "var(--ink-muted)" }}>Sign in</button>
                  <button onClick={openRegister} className="text-[11px] font-semibold" style={{ color: "var(--amber)" }}>Subscribe</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Search bar (expandable) ────────────────────────── */}
        {searchOpen && (
          <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search size={16} style={{ color: "var(--ink-faint)" }} className="shrink-0" />
                <input
                  ref={searchRef}
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search AgentNews…"
                  className="flex-1 bg-transparent outline-none text-[15px]"
                  style={{ color: "var(--ink)", fontFamily: "Inter, sans-serif" }}
                />
                <button type="submit" className="text-[11px] font-semibold uppercase tracking-wider px-4 py-1.5 rounded-[2px]" style={{ background: "var(--ink)", color: "var(--bg)" }}>
                  Search
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} style={{ color: "var(--ink-faint)" }}>
                  <X size={16} strokeWidth={1.5} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Masthead ──────────────────────────────────────────── */}
        <div className="py-6 sm:py-8 text-center" style={{ borderBottom: "1px solid var(--border)" }}>
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <span
              className="headline leading-none"
              style={{ fontSize: "clamp(2.2rem, 6vw, 3.75rem)", letterSpacing: "-0.03em", color: "var(--ink)" }}
            >
              Agent<span style={{ color: "var(--amber)" }}>News</span>
            </span>
            <span
              className="font-semibold uppercase"
              style={{ fontSize: "9px", letterSpacing: "0.22em", color: "var(--ink-faint)" }}
            >
              Independent · Informed · Insightful
            </span>
          </Link>
        </div>

        {/* ── Category nav — sticky ─────────────────────────────── */}
        <nav className="sticky top-0 z-40" style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)", boxShadow: "0 1px 0 var(--border)" }}>
          <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
            {/* Desktop nav links */}
            <div className="hidden md:flex overflow-x-auto">
              {navLinks.map(({ to, label }) => {
                const active = loc.pathname === to || (to !== "/" && loc.pathname.startsWith(to));
                return (
                  <Link
                    key={to}
                    to={to}
                    className="shrink-0 px-3.5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] border-b-2 transition-all whitespace-nowrap"
                    style={{
                      borderColor: active ? "var(--amber)" : "transparent",
                      color: active ? "var(--ink)" : "var(--ink-muted)",
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* RSS link (desktop) */}
            <a
              href="/api/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider py-3.5 px-2 transition-colors"
              style={{ color: "var(--ink-faint)" }}
              title="RSS Feed"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--amber)">
                <circle cx="5" cy="19" r="3"/><path d="M4 4a16 16 0 0 1 16 16"/><path d="M4 11a9 9 0 0 1 9 9"/>
              </svg>
              RSS
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden ml-auto p-3 transition-colors"
              style={{ color: "var(--ink-muted)" }}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>

          {/* Mobile menu drawer */}
          {mobileOpen && (
            <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg-surface)" }} className="md:hidden">
              <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col gap-0.5">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 px-2 text-[13px] font-semibold uppercase tracking-wider transition-colors"
                    style={{
                      color: loc.pathname === to ? "var(--amber)" : "var(--ink-muted)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {label}
                  </Link>
                ))}
                <div className="pt-4 flex gap-3">
                  {isAuth() ? (
                    <button onClick={() => { logout(); nav("/"); setMobileOpen(false); }} className="btn-ghost text-[11px]">Sign out</button>
                  ) : (
                    <>
                      <button onClick={openLogin} className="btn-ghost">Sign in</button>
                      <button onClick={openRegister} className="btn-primary">Subscribe</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
    </>
  );
}

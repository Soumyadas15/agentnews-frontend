import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useCategories } from "@/hooks/useArticles";
import AuthDialog from "@/components/auth/AuthDialog";

export default function Navbar() {
  const { user, logout, isAuth } = useAuth();
  const { data: cats } = useCategories();
  const loc = useLocation();
  const nav = useNavigate();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  const openLogin = () => { setAuthTab("login"); setAuthOpen(true); };
  const openRegister = () => { setAuthTab("register"); setAuthOpen(true); };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/articles", label: "All Stories" },
    ...(cats?.slice(0, 7).map(c => ({ to: `/categories/${c.slug}`, label: c.name })) ?? []),
  ];

  return (
    <>
      <header>
        {/* Utility bar */}
        <div className="border-b border-border bg-background">
          <div className="max-w-screen-xl mx-auto px-6 h-9 flex items-center justify-between">
            <span className="text-[11px] text-ink-muted hidden sm:block">{today}</span>
            <div className="flex items-center gap-5 ml-auto text-[11px]">
              {isAuth() ? (
                <>
                  <span className="text-ink-muted">
                    {user?.name}{" "}
                    <span className="opacity-40 uppercase tracking-widest text-[9px]">{user?.role}</span>
                  </span>
                  {(user?.role === "ADMIN" || user?.role === "AUTHOR") && (
                    <Link to="/dashboard" className="text-amber font-semibold hover:opacity-75">Dashboard</Link>
                  )}
                  <button onClick={() => { logout(); nav("/"); }} className="text-ink-muted hover:text-ink transition-colors">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={openLogin} className="text-ink-muted hover:text-ink transition-colors">
                    Sign in
                  </button>
                  <button onClick={openRegister} className="text-amber font-semibold hover:opacity-75">
                    Subscribe
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Masthead */}
        <div className="bg-background py-7 text-center border-b border-border">
          <Link to="/">
            <h1 className="headline text-[3rem] md:text-[3.75rem] leading-none tracking-tight" style={{ letterSpacing: "-0.03em" }}>
              Agent<span className="text-amber">News</span>
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-faint mt-2">
              Independent · Informed · Insightful
            </p>
          </Link>
        </div>

        {/* Category nav — sticky */}
        <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
          <div className="max-w-screen-xl mx-auto px-4 flex overflow-x-auto">
            {navLinks.map(({ to, label }) => {
              const active = loc.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className="shrink-0 px-3.5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] border-b-2 transition-all whitespace-nowrap"
                  style={{ borderColor: active ? "#1A1814" : "transparent", color: active ? "#1A1814" : "#706B61" }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
    </>
  );
}

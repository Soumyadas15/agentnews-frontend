import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <Link to="/">
            <span className="headline text-[1.75rem] leading-none tracking-tight" style={{letterSpacing:"-0.02em"}}>
              Agent<span className="text-amber">News</span>
            </span>
          </Link>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint mt-2">Independent · Informed · Insightful</p>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-muted">© {new Date().getFullYear()} AgentNews. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-ink-muted">
            {[["Stories","/articles"],["Topics","/categories"],["Sign in","/login"],["Subscribe","/register"]].map(([l,t])=>(
              <Link key={t} to={t} className="hover:text-ink transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

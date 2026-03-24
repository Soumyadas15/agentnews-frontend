import { useState } from "react";
import { Mail } from "lucide-react";
import api from "@/lib/api";

export default function NewsletterBox() {
  const [email, setEmail]   = useState("");
  const [state, setState]   = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      await api.post("/newsletter/subscribe", { email });
      setState("ok");
      setEmail("");
    } catch (err: any) {
      setErrMsg(err.response?.data?.message || "Something went wrong.");
      setState("err");
    }
  };

  return (
    <div className="p-6" style={{ border: "1px solid var(--border)", borderRadius: "3px", background: "var(--bg-surface)" }}>
      <div className="flex items-center gap-2 mb-3">
        <Mail size={14} style={{ color: "var(--amber)" }} />
        <h3 className="headline text-xl" style={{ letterSpacing: "-0.01em", color: "var(--ink)" }}>Stay informed</h3>
      </div>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ink-muted)" }}>
        The latest AI breakthroughs, every morning. No noise.
      </p>

      {state === "ok" ? (
        <div className="py-3 px-4 text-sm text-center font-medium" style={{ borderRadius: "2px", background: "rgba(67,122,34,0.08)", border: "1px solid rgba(67,122,34,0.3)", color: "#437A22" }}>
          ✓ You're subscribed. Welcome aboard!
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="input-field"
          />
          {state === "err" && (
            <p className="text-[11px]" style={{ color: "#dc2626" }}>{errMsg}</p>
          )}
          <button type="submit" disabled={state === "loading"} className="btn-primary w-full text-center">
            {state === "loading" ? "Subscribing…" : "Subscribe free"}
          </button>
        </form>
      )}
    </div>
  );
}

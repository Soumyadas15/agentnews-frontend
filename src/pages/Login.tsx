import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import api from "@/lib/api";

export default function Login() {
  const nav = useNavigate(); const { setAuth } = useAuth();
  const [form, setForm] = useState({ email:"", password:"" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { const { data } = await api.post("/auth/login", form); setAuth(data.data.user, data.data.token); nav("/"); }
    catch (err: any) { setError(err.response?.data?.message || "Invalid credentials."); }
    finally { setLoading(false); }
  };
  return (
    <div className="max-w-sm mx-auto py-16">
      <div className="text-center mb-10">
        <Link to="/"><span className="headline text-[2rem] leading-none" style={{letterSpacing:"-0.02em"}}>Agent<span className="text-amber">News</span></span></Link>
        <h1 className="headline text-xl mt-4">Welcome back</h1>
        <p className="text-sm text-ink-muted mt-1">Sign in to your account</p>
      </div>
      {error && <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" style={{borderRadius:"2px"}}>{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div><label className="input-label">Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required className="input-field" placeholder="you@example.com" /></div>
        <div><label className="input-label">Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required className="input-field" placeholder="••••••••" /></div>
        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">{loading?"Signing in…":"Sign in"}</button>
      </form>
      <p className="text-center text-sm text-ink-muted mt-8">New here? <Link to="/register" className="font-semibold text-ink hover:opacity-70">Create account</Link></p>
    </div>
  );
}

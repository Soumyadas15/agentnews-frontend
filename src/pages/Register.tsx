import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import api from "@/lib/api";

export default function Register() {
  const nav = useNavigate(); const { setAuth } = useAuth();
  const [form, setForm] = useState({ name:"", username:"", email:"", password:"" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { const { data } = await api.post("/auth/register", form); setAuth(data.data.user, data.data.token); nav("/"); }
    catch (err: any) { setError(err.response?.data?.message || "Registration failed."); }
    finally { setLoading(false); }
  };
  return (
    <div className="max-w-sm mx-auto py-16">
      <div className="text-center mb-10">
        <Link to="/"><span className="headline text-[2rem] leading-none" style={{letterSpacing:"-0.02em"}}>Agent<span className="text-amber">News</span></span></Link>
        <h1 className="headline text-xl mt-4">Create your account</h1>
        <p className="text-sm text-ink-muted mt-1">Join the AgentNews community</p>
      </div>
      {error && <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" style={{borderRadius:"2px"}}>{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        {[["Full Name","name","text","Jane Smith"],["Username","username","text","janesmith"],["Email","email","email","jane@example.com"],["Password","password","password","Min 6 characters"]].map(([l,k,t,p])=>(
          <div key={k}><label className="input-label">{l}</label><input type={t} value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})} required minLength={k==="password"?6:undefined} className="input-field" placeholder={p} /></div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">{loading?"Creating…":"Create account"}</button>
      </form>
      <p className="text-center text-sm text-ink-muted mt-8">Already a member? <Link to="/login" className="font-semibold text-ink hover:opacity-70">Sign in</Link></p>
    </div>
  );
}

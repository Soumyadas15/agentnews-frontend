import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/store/auth";
import { useArticles, useCategories } from "@/hooks/useArticles";
import api from "@/lib/api";

export default function Dashboard() {
  const { user, isAuth } = useAuth(); const nav = useNavigate();
  const [tab, setTab] = useState<"list"|"new">("list");
  const { data, refetch } = useArticles({ limit: 50 });
  const { data: cats } = useCategories();
  const [form, setForm] = useState({ title:"", excerpt:"", content:"", coverImage:"", categoryId:"", tags:"", published:false, featured:false });
  const [saving, setSaving] = useState(false); const [msg, setMsg] = useState("");

  useEffect(() => { if (!isAuth() || user?.role==="READER") nav("/"); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg("");
    try {
      await api.post("/articles", { ...form, tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean) });
      setMsg("ok"); setForm({ title:"", excerpt:"", content:"", coverImage:"", categoryId:"", tags:"", published:false, featured:false });
      refetch(); setTab("list");
    } catch (err: any) { setMsg(err.response?.data?.message || "Failed to save."); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => { if (!confirm("Delete?")) return; await api.delete(`/articles/${id}`); refetch(); };

  return (
    <div>
      <div className="mb-8 pb-6 border-b border-border flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="headline text-3xl leading-tight" style={{letterSpacing:"-0.02em"}}>Dashboard</h1>
          <p className="text-sm text-ink-muted mt-1">Signed in as <span className="font-medium text-ink">{user?.name}</span> <span className="text-[10px] uppercase tracking-widest opacity-40">{user?.role}</span></p>
        </div>
        <div className="flex gap-2">
          {(["list","new"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="text-[11px] font-semibold uppercase tracking-[0.1em] px-4 py-2 border transition-colors" style={{ borderRadius:"2px", background:tab===t?"#1A1814":"transparent", borderColor:tab===t?"#1A1814":"#E8E4DC", color:tab===t?"#fff":"#706B61" }}>
              {t==="new"?"+ New Story":"My Stories"}
            </button>
          ))}
        </div>
      </div>

      {tab==="list" && (
        <div>
          {!data?.articles.length ? (
            <div className="py-20 text-center">
              <p className="text-ink-muted text-sm mb-4">No stories yet.</p>
              <button onClick={()=>setTab("new")} className="text-[11px] font-semibold uppercase tracking-[0.12em] border-b border-ink pb-0.5 hover:opacity-50 transition-opacity">Write your first story</button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {data.articles.map(a => (
                <div key={a.id} className="flex items-start gap-4 py-5">
                  {a.coverImage && <img src={a.coverImage} alt="" className="w-20 h-14 object-cover shrink-0" style={{borderRadius:"2px"}} />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">{a.category.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 font-semibold uppercase tracking-wider" style={{borderRadius:"2px", background:a.published?"#437A22":"#E8E4DC", color:a.published?"#fff":"#706B61"}}>{a.published?"Live":"Draft"}</span>
                      {a.featured && <span className="text-[10px] px-1.5 py-0.5 font-semibold uppercase tracking-wider" style={{borderRadius:"2px",background:"#C2611F",color:"#fff"}}>Featured</span>}
                    </div>
                    <Link to={`/articles/${a.slug}`} className="headline font-semibold hover:opacity-60 transition-opacity line-clamp-1 text-lg" style={{letterSpacing:"-0.01em"}}>{a.title}</Link>
                    <p className="text-xs text-ink-muted mt-1">{format(new Date(a.createdAt),"MMM d, yyyy")} · {a.views.toLocaleString()} views · {a._count?.comments ?? 0} comments</p>
                  </div>
                  <button onClick={() => del(a.id)} className="text-[11px] text-ink-muted hover:text-red-600 transition-colors shrink-0">Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab==="new" && (
        <div className="max-w-2xl">
          {msg==="ok" && <div className="mb-6 border px-4 py-3 text-sm" style={{borderRadius:"2px",borderColor:"#437A22",background:"rgba(67,122,34,0.06)",color:"#437A22"}}>Story saved!</div>}
          {msg && msg!=="ok" && <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" style={{borderRadius:"2px"}}>{msg}</div>}
          <form onSubmit={save} className="space-y-5">
            <div><label className="input-label">Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required className="input-field" style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:"1.1rem"}} placeholder="Your story headline" /></div>
            <div><label className="input-label">Excerpt *</label><textarea value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} required rows={2} className="input-field" placeholder="Short summary shown in article listings" /></div>
            <div><label className="input-label">Body *</label><textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required rows={14} className="input-field" style={{fontFamily:"'DM Mono',monospace",fontSize:"0.85rem",lineHeight:"1.7"}} placeholder="<p>Your story. HTML is supported.</p>" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="input-label">Category *</label>
                <select value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})} required className="input-field">
                  <option value="">Select…</option>
                  {cats?.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label className="input-label">Cover Image URL</label><input value={form.coverImage} onChange={e=>setForm({...form,coverImage:e.target.value})} className="input-field" placeholder="https://…" /></div>
            </div>
            <div><label className="input-label">Tags (comma-separated)</label><input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} className="input-field" placeholder="AI, Science, Policy" /></div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})} /><span className="input-label mb-0">Publish now</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} /><span className="input-label mb-0">Feature on homepage</span></label>
            </div>
            <button type="submit" disabled={saving} className="btn-primary">{saving?"Saving…":form.published?"Publish Story":"Save Draft"}</button>
          </form>
        </div>
      )}
    </div>
  );
}

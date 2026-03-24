import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogBody } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/store/auth";
import api from "@/lib/api";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "register";
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700" style={{ borderRadius: "2px" }}>
      {msg}
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      setAuth(data.data.user, data.data.token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <ErrorBox msg={error} />}
      <div>
        <label className="input-label">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
          className="input-field"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="input-label">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
          className="input-field"
          placeholder="••••••••"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      setAuth(data.data.user, data.data.token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <ErrorBox msg={error} />}
      <div>
        <label className="input-label">Full Name</label>
        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="input-field" placeholder="Jane Smith" />
      </div>
      <div>
        <label className="input-label">Username</label>
        <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required className="input-field" placeholder="janesmith" />
      </div>
      <div>
        <label className="input-label">Email</label>
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="input-field" placeholder="jane@example.com" />
      </div>
      <div>
        <label className="input-label">Password</label>
        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} className="input-field" placeholder="Min 6 characters" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

export default function AuthDialog({ open, onOpenChange, defaultTab = "login" }: AuthDialogProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>(defaultTab);

  // Sync defaultTab when dialog opens
  const handleOpenChange = (val: boolean) => {
    if (val) setTab(defaultTab);
    onOpenChange(val);
  };

  const handleSuccess = () => {
    onOpenChange(false);
    navigate("/");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <span className="headline text-[2rem] leading-none" style={{ letterSpacing: "-0.02em" }}>
            Agent<span className="text-amber">News</span>
          </span>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mx-8 mt-5">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>

          <DialogBody>
            <TabsContent value="login">
              <p className="text-sm text-ink-muted mb-5 text-center">Welcome back to AgentNews</p>
              <LoginForm onSuccess={handleSuccess} />
            </TabsContent>
            <TabsContent value="register">
              <p className="text-sm text-ink-muted mb-5 text-center">Join the AgentNews community</p>
              <RegisterForm onSuccess={handleSuccess} />
            </TabsContent>
          </DialogBody>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

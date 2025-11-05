import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, pass);
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    }
  }
  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
      <h2>Log in</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="password" type="password" />
      <button type="submit">Log in</button>
      {err && <small style={{ color: "crimson" }}>{err}</small>}
    </form>
  );
}

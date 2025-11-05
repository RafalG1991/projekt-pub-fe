import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    try {
      await register(name, email, pass);
      setOk("Account created. You can log in.");
    } catch (e: any) {
      setErr(e?.message || "Registration failed");
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
      <h2>Register</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="password" type="password" />
      <button type="submit">Create account</button>
      {ok && <small style={{ color: "seagreen" }}>{ok}</small>}
      {err && <small style={{ color: "crimson" }}>{err}</small>}
    </form>
  );
}

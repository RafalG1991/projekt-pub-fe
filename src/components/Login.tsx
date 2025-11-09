import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {resendActivation} from "../api/auth";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [inactive, setInactive] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setInactive(false);
    setSubmitting(true);

    try {
      await login(email, pass);
      setSubmitting(false);
    } catch (e: any) {
      setSubmitting(false);
      let data;

      const msg = e.message ?? err;

      try {
        data = JSON.parse(msg);
      } catch {
        data = { error: "unknown", ok: false };
      }

      if (data.error === "account_inactive" && !data.ok) {
        setInactive(true);
        setSubmitting(false);
        setErr("Your account is inactive! Check your email.");
        return;
      }
      setErr(e?.message || "Login failed");
    }
  }

  const onResend = async () => {
    setErr("");
    try {
      const r = await resendActivation(email);
      setErr("Wysłaliśmy ponownie link aktywacyjny. Sprawdź skrzynkę.");
    } catch (e: any) {
      setErr("Nie udało się wysłać linku. Spróbuj ponownie za chwilę.");
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
      <h2>Log in</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="password" type="password" />
      <button type="submit" disabled={submitting}>{submitting ? "Logging in..." : "Log in"}</button>

      {inactive && (
        <div>
          <button type="button" onClick={onResend} disabled={!email}>
            Resend activation link
          </button>
          {!email && <small>Podaj e-mail, aby wysłać link.</small>}
        </div>
      )}

      {err && <small style={{ color: "crimson" }}>{err}</small>}
    </form>
  );
}

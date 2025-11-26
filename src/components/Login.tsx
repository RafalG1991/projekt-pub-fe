import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {resendActivation} from "../api/auth";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";

import "./LogRegForm.css";

export default function Login() {
  const navigate = useNavigate();
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
      navigate("/");
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
      if (data.error === "invalid_credentials" && !data.ok) {
        setSubmitting(false);
        setErr("Login failed — please check your username and password.");
        return;
      }
      setErr(e?.message || "Login failed");
    }
  }

  const onResend = async () => {
    setErr("");
    try {
      const r = await resendActivation(email);
      setErr("Activation link sent. Check your e-mail!");
    } catch (e: any) {
      setErr("Activation link cannot be sent now! Try again later!");
    }
  };

  return (
    <>
      <Navigation/>
      <div className="form-wrapper">
        <form onSubmit={onSubmit}>
          <h2>Log in</h2>
          <input value={email} type='email' onChange={(e) => setEmail(e.target.value)} placeholder="email" required/>
          <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="password" type="password" required/>
          <button type="submit" disabled={submitting}>{submitting ? "Logging in..." : "Log in"}</button>

          {inactive && (
            <div>
              <button type="button" onClick={onResend} disabled={!email}>
                Resend activation link
              </button>
              {!email && <small>Enter e-mail address to resend activation code</small>}
            </div>
          )}
          {err && <small style={{color: "crimson"}}>{err}</small>}
        </form>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "../api/auth";

export default function Activate() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"idle"|"ok"|"error">("idle");
  const token = params.get("token");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    fetch(`${API}/auth/activate?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const isJson = res.headers.get("content-type")?.includes("application/json");
        const data = isJson ? await res.json() : await res.text();
        if (!res.ok) throw new Error(typeof data === "string" ? data : JSON.stringify(data));
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "idle") return <p>Account activation in progress...</p>;
  if (status === "ok")   return <p>Account activated! You can login now!</p>;
  return (
    <div>
      <p>Account activation failed! Activation link can be invalid or expired!</p>
      <ResendActivation/>
    </div>
  );
}

function ResendActivation() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const resend = async () => {
    const res = await fetch(`${API}/auth/resend-activation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMsg(data.message || "Activation link has been sent");
  };
  return (
    <div>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Twój e-mail"/>
      <button onClick={resend}>Resend activation link</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}

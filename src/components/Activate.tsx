import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API } from "../api/auth";
import "./Activate.css";

export default function Activate() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const token = params.get("token");

  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    if (!token) {
      setStatus("error");
      setErrorMsg("Missing token");
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `${API}/auth/activate?token=${encodeURIComponent(token)}`
        );

        const isJson = res.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson ? await res.json() : await res.text();

        if (isJson && data && typeof data === "object") {
          const ok = (data as any).ok;
          const error = (data as any).error;

          if (ok === true) {
            setStatus("ok");
            return;
          }
          if (error === "invalid_or_used") {
            setStatus("error");
            return;
          }

          setStatus("error");
          setErrorMsg(error || "Activation failed");
          return;
        }

        if (res.ok) {
          setStatus("ok");
        } else {
          setStatus("error");
          setErrorMsg(
            typeof data === "string" ? data : "Activation failed (non-JSON)"
          );
        }
      } catch (e: any) {
        console.error(e);
        setStatus("error");
        setErrorMsg(e?.message || "Activation failed");
      }
    })();
  }, [token]);

  const goToLogin = () => navigate("/login");

  return (
    <div className="activate-page">
      <div className="activate-card">
        <div className="activate-logo">
          <span role="img" aria-label="cheers">
            🍻
          </span>
        </div>

        {status === "idle" && (
          <>
            <h1 className="activate-title">Activating your account...</h1>
            <p className="activate-text">
              The verification of the activation link is in progress. Everything will be ready in a moment.
            </p>
            <div className="activate-spinner" />
          </>
        )}

        {status === "ok" && (
          <>
            <h1 className="activate-title success">Account activated!</h1>
            <p className="activate-text">
              Your account has been successfully activated. You can log in to the employee panel.
            </p>
            <button className="activate-btn primary" onClick={goToLogin}>
              Log in
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="activate-title error">Activation failed!</h1>
            <p className="activate-text">
              The activation link is invalid or has expired."
              {errorMsg && (
                <span className="activate-error-detail"> ({errorMsg})</span>
              )}
            </p>
            <ResendActivation />
          </>
        )}
      </div>
    </div>
  );
}

function ResendActivation() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const resend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/resend-activation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMsg(data.message || "Activation link has been sent");
    } catch (e) {
      setMsg("Error while sending activation link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activate-resend">
      <h2>Send a new activation link</h2>
      <p className="activate-text small">
        Enter the email address used during registration. We will send you a fresh activation link.
      </p>
      <input
        className="activate-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your e-mail"
        type="email"
      />
      <button
        className="activate-btn outline"
        onClick={resend}
        disabled={loading || !email}
      >
        {loading ? "Sending..." : "Send the link again"}
      </button>
      {msg === "activation_sent" && <p className="activate-msg">Activation link sent!</p>}
      {msg === "already_active" && <p className="activate-msg">The account is already active! Log in to the app!</p>}
    </div>
  );
}

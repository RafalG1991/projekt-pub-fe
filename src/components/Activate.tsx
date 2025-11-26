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
            <h1 className="activate-title">Aktywujemy Twoje konto…</h1>
            <p className="activate-text">
              Trwa weryfikacja linku aktywacyjnego. Za chwilę wszystko będzie
              gotowe.
            </p>
            <div className="activate-spinner" />
          </>
        )}

        {status === "ok" && (
          <>
            <h1 className="activate-title success">Konto aktywne!</h1>
            <p className="activate-text">
              Twoje konto zostało pomyślnie aktywowane. Możesz zalogować się do
              panelu pracownika.
            </p>
            <button className="activate-btn primary" onClick={goToLogin}>
              Przejdź do logowania
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="activate-title error">Nie udało się aktywować</h1>
            <p className="activate-text">
              Link aktywacyjny jest nieprawidłowy lub wygasł.
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
      <h2>Wyślij nowy link aktywacyjny</h2>
      <p className="activate-text small">
        Podaj adres e-mail użyty przy rejestracji. Wyślemy świeży link
        aktywacyjny.
      </p>
      <input
        className="activate-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Twój e-mail"
        type="email"
      />
      <button
        className="activate-btn outline"
        onClick={resend}
        disabled={loading || !email}
      >
        {loading ? "Wysyłanie..." : "Wyślij link ponownie"}
      </button>
      {msg === "activation_sent" && <p className="activate-msg">Wysłano link aktywacyjny!</p>}
      {msg === "already_active" && <p className="activate-msg">Konto jest już aktywne! Zaloguj się do aplikacji!</p>}
    </div>
  );
}

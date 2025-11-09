const API = "http://127.0.0.1:5000";

export type User = { id: number; email: string; name: string; role: "employee" | "admin" };

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};

export const auth = {
  getState(): AuthState {
    return {
      user: JSON.parse(localStorage.getItem("user") || "null"),
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  },
  save(partial: Partial<AuthState>) {
    if (partial.user !== undefined)
      partial.user
        ? localStorage.setItem("user", JSON.stringify(partial.user))
        : localStorage.removeItem("user");
    if (partial.accessToken !== undefined)
      partial.accessToken
        ? localStorage.setItem("accessToken", partial.accessToken)
        : localStorage.removeItem("accessToken");
    if (partial.refreshToken !== undefined)
      partial.refreshToken
        ? localStorage.setItem("refreshToken", partial.refreshToken)
        : localStorage.removeItem("refreshToken");
  },
  clear() {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
  async register(name: string, email: string, password: string, role = "employee") {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async login(email: string, password: string) {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    this.save({
      user: data.user,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });
    return data.user as User;
  },
  async refreshAccess() {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) throw new Error("no refresh token");
    const res = await fetch(`${API}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${refresh}` },
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    this.save({ accessToken: data.access_token });
    return data.access_token as string;
  },
  async logout() {
    const state = this.getState();
    if (state.accessToken) {
      try {
        await fetch(`${API}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${state.accessToken}` },
        });
      } catch {
        // ignore
      }
    }
    this.clear();
  },
};

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const state = auth.getState();
  const headers = new Headers(init.headers || {});
  if (state.accessToken) headers.set("Authorization", `Bearer ${state.accessToken}`);

  const hasBody = !!init.body;
  if (hasBody && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  let res = await fetch(input, { ...init, headers });

  // 👇 tymczasowe logi – zobaczmy DLACZEGO 422
  if (!res.ok) {
    const clone = res.clone();
    let detail = "";
    try { detail = await clone.text(); } catch {}
    console.debug("authFetch error", res.status, res.url, detail);
  }

  if ((res.status === 401 || res.status === 422) && state.refreshToken) {
    try {
      await auth.refreshAccess();
      const state2 = auth.getState();
      const headers2 = new Headers(init.headers || {});
      headers2.set("Authorization", `Bearer ${state2.accessToken}`);
      if (hasBody && !headers2.has("Content-Type")) headers2.set("Content-Type", "application/json");
      res = await fetch(input, { ...init, headers: headers2 });
    } catch {
      auth.clear();
      throw new Error("session expired");
    }
  }
  return res;
}

export async function resendActivation(email: string) {
  const res = await fetch(`${API}/auth/resend-activation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) throw new Error(typeof data === "string" ? data : JSON.stringify(data));
  return data; // { ok: true, message: "activation_sent" }
}

export { API };

import React, { createContext, useContext, useMemo, useState } from "react";
import { auth, type User } from "../api/auth";
import Login from "../components/Login";

type AuthCtx = {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial = auth.getState();
  const [user, setUser] = useState<User | null>(initial.user);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      async login(email, pass) {
        const u = await auth.login(email, pass);
        setUser(u);
      },
      async register(name, email, pass) {
        await auth.register(name, email, pass);
      },
      async logout() {
        await auth.logout();
        setUser(null);
      },
    }),
    [user]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Login />;
  return children;
}

export function RequireRole({
                              roles,
                              children,
                            }: {
  roles: Array<"employee" | "admin">;
  children: JSX.Element;
}) {
  const { user } = useAuth();
  if (!user) return <Login />;
  if (!roles.includes(user.role)) return <div style={{ padding: 24 }}>Forbidden.</div>;
  return children;
}

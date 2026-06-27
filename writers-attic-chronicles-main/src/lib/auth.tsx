import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type User } from "./api";

type AuthCtx = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const t = localStorage.getItem("wa_token");
      const u = localStorage.getItem("wa_user");
      if (t) setToken(t);
      if (u) setUser(JSON.parse(u));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (t: string, u: User) => {
    localStorage.setItem("wa_token", t);
    localStorage.setItem("wa_user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const login = async (
  email: string,
  password: string
) => {

  const { data } = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  const user: User = {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
  };

  persist(data.token, user);
  console.log("NEW TOKEN", data.token);
console.log("LOCAL TOKEN", localStorage.getItem("wa_token"));
};
  const signup = async (name: string, email: string, password: string) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    const t = data.token ?? data.accessToken ?? data.jwt;
    const u: User = data.user ?? { id: data.id ?? "", name, email, role: data.role };
    if (t) persist(t, u);
  };

  const logout = () => {
    localStorage.removeItem("wa_token");
    localStorage.removeItem("wa_user");
    setUser(null);
    setToken(null);
  };

  return (
    <Ctx.Provider
      value={{ user, token, loading, login, signup, logout, isAdmin: user?.role?.toUpperCase() === "ADMIN" }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}

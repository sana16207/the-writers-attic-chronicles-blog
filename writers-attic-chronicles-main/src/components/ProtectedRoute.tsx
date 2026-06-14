import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "../lib/auth";
import { Loader } from "./Loader";

export function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
    else if (adminOnly && !isAdmin) navigate({ to: "/" });
  }, [user, loading, isAdmin, adminOnly, navigate]);

  if (loading || !user || (adminOnly && !isAdmin)) return <Loader />;
  return <>{children}</>;
}

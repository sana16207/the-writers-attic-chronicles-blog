import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "../lib/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Writers Attic" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate({ to: "/" }); }, [user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-ink">
        <Link to="/" className="block text-center font-display text-3xl text-coffee">
          Writers <span className="italic text-gold-deep">Attic</span>
        </Link>
        <p className="mt-2 text-center font-type text-[11px] uppercase tracking-[0.4em] text-coffee/60">
          ❦ The Members' Entrance ❦
        </p>

        <div className="manuscript mt-8 p-10">
          <div className="relative text-center">
            <p className="font-type text-[10px] uppercase tracking-[0.4em] text-coffee/60">Est. MCMV</p>
            <h1 className="mt-2 font-display text-3xl text-coffee">Sign In</h1>
            <p className="mt-1 font-body italic text-sm text-muted-foreground">
              Take your seat by the lamp.
            </p>
            <div className="chapter-rule my-6 mx-auto max-w-[12rem]">
              <span className="ornament text-sm">❦</span>
            </div>
          </div>
          <AuthForm
            mode="login"
            onSubmit={async ({ email, password }) => { await login(email, password); navigate({ to: "/" }); }}
          />
          <p className="mt-6 text-center font-body text-sm text-muted-foreground">
            New here? <Link to="/signup" className="text-gold-deep hover:underline">Begin your story</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

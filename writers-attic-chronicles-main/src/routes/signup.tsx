import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthForm } from "../components/AuthForm";
import { useAuth } from "../lib/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const { signup, login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate({ to: "/" });
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <Link to="/" className="block text-center text-2xl">
          Writers Attic
        </Link>

        <AuthForm
          mode="signup"
          onSubmit={async ({ name, email, password }) => {
            await signup(name!, email, password);
            await login(email, password);
            navigate({ to: "/" });
          }}
        />

        <p className="text-center mt-4">
          <Link to="/login">Already have an account? Login</Link>
        </p>

      </div>
    </div>
  );
}
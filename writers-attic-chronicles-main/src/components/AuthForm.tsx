import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AuthMode = "login" | "signup";

export function AuthForm({
  mode,
  onSubmit,
}: {
  mode: AuthMode;
  onSubmit: (vals: { name?: string; email: string; password: string }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await onSubmit({ name: mode === "signup" ? name : undefined, email, password });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {mode === "signup" && (
        <div>
          <Label htmlFor="name" className="font-type text-xs uppercase tracking-[0.25em] text-coffee/70">Name</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)}
            className="mt-2 border-coffee/30 bg-cream/60 font-body text-ink focus-visible:ring-gold" />
        </div>
      )}
      <div>
        <Label htmlFor="email" className="font-type text-xs uppercase tracking-[0.25em] text-coffee/70">Email</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-2 border-coffee/30 bg-cream/60 font-body text-ink focus-visible:ring-gold" />
      </div>
      <div>
        <Label htmlFor="password" className="font-type text-xs uppercase tracking-[0.25em] text-coffee/70">Password</Label>
        <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-2 border-coffee/30 bg-cream/60 font-body text-ink focus-visible:ring-gold" />
      </div>
      {error && <p className="font-body text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={busy}
        className="w-full bg-coffee py-6 font-type text-sm uppercase tracking-[0.25em] text-cream hover:bg-coffee-light hover:shadow-[0_0_24px_rgba(176,141,87,0.45)]">
        {busy ? "Please wait…" : mode === "login" ? "Enter Writers Attic" : "Begin your story"}
      </Button>
    </form>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StoryCard } from "@/components/StoryCard";
import { useAuth } from "../lib/auth";
import { useEffect, useState } from "react";
import { api, type Story } from "@/lib/api";
export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Writers Attic" }] }),
  component: () => <ProtectedRoute><ProfilePage /></ProtectedRoute>,
});

function ProfilePage() {
  const { user } = useAuth();
const [mine, setMine] = useState<Story[]>([]);

useEffect(() => {
  api.get("/stories")
    .then((r) => {
      const stories =
        r.data?.data ||
        r.data?.stories ||
        r.data;

      setMine(Array.isArray(stories) ? stories : []);
    })
    .catch(() => {
      setMine([]);
    });
}, []);
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="paper-card flex flex-col items-center p-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-coffee font-serif text-3xl text-cream">
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <h1 className="mt-5 font-serif text-3xl text-coffee">{user?.name}</h1>
          <p className="mt-1 font-type text-xs uppercase tracking-[0.25em] text-coffee/60">{user?.email}</p>
          {user?.role && <span className="mt-3 rounded-full bg-paper/60 px-3 py-1 font-type text-[10px] uppercase tracking-[0.25em] text-coffee">{user.role}</span>}
        </div>

        <h2 className="mt-12 font-serif text-2xl text-coffee">Your stories</h2>
        <div className="mt-6 space-y-8">
          {mine.map((s, i) => <StoryCard key={s.id} story={s} index={i} />)}
        </div>
      </div>
    </PageShell>
  );
}

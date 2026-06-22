import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StoryCard } from "@/components/StoryCard";
import { useEffect, useState } from "react";
import { api, type Story } from "@/lib/api";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({ meta: [{ title: "Bookmarks — Writers Attic" }] }),
  component: () => (
    <ProtectedRoute>
      <Bookmarks />
    </ProtectedRoute>
  ),
});

type BookmarkItem = {
  id: number | string;
  story?: Story;
};

function Bookmarks() {
  const [saved, setSaved] = useState<BookmarkItem[]>([]);
 console.log("SAVED =", saved);
  useEffect(() => {
    api
      .get("/bookmarks")
      .then((r) => {
  console.log("FULL RESPONSE", r.data);

  const data = r.data?.data || r.data || [];

  console.log("DATA", data);

  setSaved(Array.isArray(data) ? data : []);
})
      .catch((err) => {
        console.error("BOOKMARK ERROR:", err);
        setSaved([]);
      });
  }, []);

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-type text-xs uppercase tracking-[0.3em] text-coffee/60">
          Kept for later
        </p>

        <h1 className="mt-2 font-serif text-4xl text-coffee">
          Bookmarks
        </h1>

        <div className="mt-10 space-y-8">
          {saved.length === 0 && (
            <p className="text-coffee/60 text-center">
              No bookmarks yet
            </p>
          )}

          {saved.map((s, i) => {
  console.log("ITEM =", s);

  return (
    <StoryCard
      key={s.id}
      story={s.story as Story}
      index={i}
    />
  );
})}
        </div>
      </div>
    </PageShell>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { StoryCard } from "@/components/StoryCard";
import { Loader } from "@/components/Loader";
import { api, type Story } from "@/lib/api";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: FeedPage,
});

function FeedPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;

    api
      .get("/stories")
      .then((r) => {
        if (!live) return;

        // ✅ FIXED: backend ApiResponse<List<StoryResponse>>
        const stories = r.data?.data;

        setStories(Array.isArray(stories) ? stories : []);
      })
      .catch(() => {
        if (live) setStories([]);
      })
      .finally(() => {
        if (live) setLoading(false);
      });

    return () => {
      live = false;
    };
  }, []);

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-6 py-20">

        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl text-coffee">
            Latest Dispatches
          </h2>
        </div>

        {loading && <Loader />}

        {!loading && stories.length === 0 && (
          <p className="text-center text-coffee/60">
            No stories found
          </p>
        )}

        <div className="space-y-8">
          {stories.map((s, i) => (
            <StoryCard key={s.id} story={s} index={i} />
          ))}
        </div>

      </section>
    </PageShell>
  );
}
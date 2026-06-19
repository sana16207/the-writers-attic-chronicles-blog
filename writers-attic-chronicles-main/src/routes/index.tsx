import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { StoryCard } from "@/components/StoryCard";
import { Loader } from "@/components/Loader";
import { api, type Story } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: FeedPage,
});

function FeedPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let live = true;

    const loadStories = async () => {
      setLoading(true);

      try {
        const url =
          search.trim() !== ""
            ? `/stories/search?keyword=${encodeURIComponent(
                search
              )}&page=${page}&size=${size}`
            : `/stories?page=${page}&size=${size}`;

        const res = await api.get(url);

        if (!live) return;

        const data = res.data?.data;

        let content: Story[] = [];

        if (Array.isArray(data)) {
          content = data;
          setTotalPages(1);
        } else {
          content = data?.content || [];
          setTotalPages(data?.totalPages || 1);
        }

        if (sortBy === "likes") {
          content = [...content].sort(
            (a, b) => (b.likes || 0) - (a.likes || 0)
          );
        }

        setStories(content);
      } catch (err) {
        console.error(err);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadStories();

    return () => {
      live = false;
    };
  }, [page, search, sortBy]);

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-6 py-20">

        {/* SEARCH + FILTER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">

          <input
            type="text"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="flex-1 rounded border border-coffee/20 p-3"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded border border-coffee/20 p-3"
          >
            <option value="latest">Latest First</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>

        {/* TITLE */}
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
          {stories.map((story, index) => (
            <StoryCard
              key={story.id}
              story={story}
              index={index}
            />
          ))}
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">

            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border px-4 py-2 disabled:opacity-40"
            >
              Prev
            </button>

            <span>
              Page {page + 1} / {totalPages}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>

          </div>
        )}

      </section>
    </PageShell>
  );
}
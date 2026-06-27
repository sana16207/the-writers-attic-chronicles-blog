import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
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
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [totalPages, setTotalPages] = useState(1);

  const loadStoriesRef = useRef<() => void>(() => {});

  useEffect(() => {
    let live = true;

    const loadStories = async () => {
      setLoading(true);
      try {
        const url =
          search.trim() !== ""
            ? `/stories/search?keyword=${encodeURIComponent(search)}&page=${page}&size=${size}`
            : `/stories?page=${page}&size=${size}`;

        const [res, bookmarksRes, likesRes] = await Promise.all([
          api.get(url),
          api.get("/bookmarks").catch(() => ({ data: [] })),
          api.get("/likes").catch(() => ({ data: [] })),
        ]);

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

        const bookmarkData = bookmarksRes.data?.data || bookmarksRes.data || [];
        const likesData = likesRes.data?.data || likesRes.data || [];

        const bookmarkedIds = new Set(
          (Array.isArray(bookmarkData) ? bookmarkData : [])
            .map((b: any) => b.story?.id)
            .filter(Boolean)
        );
        const likedIds = new Set(
          (Array.isArray(likesData) ? likesData : [])
            .map((l: any) => l.story?.id)
            .filter(Boolean)
        );

        content = content.map((s) => ({
          ...s,
          bookmarked: bookmarkedIds.has(s.id),
          liked: likedIds.has(s.id),
        }));

        switch (sortBy) {
          case "likes":
            content.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            break;
          case "oldest":
            content.sort(
              (a, b) =>
                new Date(a.createdAt || "").getTime() -
                new Date(b.createdAt || "").getTime()
            );
            break;
          case "az":
            content.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
            break;
          case "za":
            content.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
            break;
          case "author":
            content.sort((a, b) =>
              (a.authorName || "").localeCompare(b.authorName || "")
            );
            break;
        }

        const currentUser = JSON.parse(localStorage.getItem("wa_user") || "{}");
        if (filter === "mine") {
          content = content.filter((s) => s.authorName === currentUser.name);
        }
        if (filter === "liked") {
          content = content.filter((s) => s.liked === true);
        }

        setStories([...content]);
      } catch (err) {
        console.error(err);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadStoriesRef.current = loadStories;
    loadStories();

    const handler = () => loadStoriesRef.current();
    window.addEventListener("storyChanged", handler);
    return () => {
      live = false;
      window.removeEventListener("storyChanged", handler);
    };
  }, [page, search, sortBy, filter]);

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-6 pt-2 pb-20">
        <section className="text-center py-12 border-b border-coffee/10">
          <p className="mb-4 text-xs font-type tracking-[0.3em] text-coffee/50">
            VOL. I · MCMV · EST. BY READERS, FOR READERS
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-coffee leading-tight">
            A quiet place <span className="text-gold-deep italic">to write</span>,
            <br />
            and to be read slowly.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-coffee/70">
            Writers Attic is a digital journal of the unhurried kind —
            for essays scribbled at midnight, stories worth keeping,
            and coffee that's gone cold.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() =>
                document.getElementById("feed")?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-md border border-coffee/30 bg-[#CDB79E] px-8 py-4 font-type tracking-[0.15em] text-coffee shadow-sm transition hover:bg-coffee hover:text-beige"
            >
              READ THE FEED
            </button>
            <Link
              to="/create"
              className="rounded-md bg-coffee px-8 py-4 font-type tracking-[0.15em] text-[#E8D8C3] shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              BEGIN WRITING
            </Link>
          </div>
        </section>

        <div className="mb-10 rounded-xl border border-coffee/15 bg-beige/50 p-5 shadow-sm flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="flex-1 rounded-lg border border-coffee/20 bg-paper p-3 text-coffee placeholder:text-coffee/50 focus:border-coffee focus:outline-none"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-coffee/20 bg-paper px-4 py-3 text-coffee"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="likes">Most Liked</option>
            <option value="az">Title A-Z</option>
            <option value="za">Title Z-A</option>
            <option value="author">Author Name</option>
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-coffee bg-coffee px-4 py-3 text-[#E8D8C3]"
          >
            <option value="all">All Stories</option>
            <option value="mine">My Stories</option>
            <option value="liked">Liked Stories</option>
          </select>
        </div>

        <div id="feed" className="mb-10 text-center">
          <h2 className="font-display text-4xl text-coffee">Latest Dispatches</h2>
        </div>

        {loading && <Loader />}

        {!loading && stories.length === 0 && (
          <p className="text-center text-coffee/60">No stories found</p>
        )}

        <div className="mb-10 flex justify-center">
          <div className="rounded-full bg-coffee px-6 py-2 font-display text-1xl text-[#E8D8C3]">
            🪶 {stories.length} Stories Loaded
          </div>
        </div>

        <div className="space-y-8">
          {stories.map((story, index) => (
            <StoryCard key={story.id} story={story} index={index} />
          ))}
        </div>

        {!loading && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border px-4 py-2 disabled:opacity-40"
            >
              Prev
            </button>
            <span>Page {page + 1} / {totalPages}</span>
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
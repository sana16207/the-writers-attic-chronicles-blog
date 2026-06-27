import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StoryCard } from "@/components/StoryCard";
import { useEffect, useState, useRef } from "react";
import { api, type Story } from "@/lib/api";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [{ title: "Bookmarks — Writers Attic" }],
  }),
  component: () => (
    <ProtectedRoute>
      <Bookmarks />
    </ProtectedRoute>
  ),
});

type BookmarkItem = {
  id: number | string;
  story?: any;
};

function Bookmarks() {
  const [saved, setSaved] = useState<BookmarkItem[]>([]);
  const [likesData, setLikesData] = useState<any[]>([]);

  const loadBookmarks = () => {
    api
      .get("/bookmarks")
      .then((r) => {
        const data = r.data?.data || r.data || [];
        setSaved(Array.isArray(data) ? data : []);
      })
      .catch(() => setSaved([]));

    // FIX 1: also fetch likes so we know which stories the user liked
    api
      .get("/likes")
      .then((r) => setLikesData(r.data?.data || r.data || []))
      .catch(() => setLikesData([]));
  };

  // FIX 2: stable ref so event listener never captures a stale closure
  const loadBookmarksRef = useRef(loadBookmarks);
  useEffect(() => {
    loadBookmarksRef.current = loadBookmarks;
  });

  useEffect(() => {
    loadBookmarksRef.current();
    const handler = () => loadBookmarksRef.current();
    window.addEventListener("storyChanged", handler);
    return () => window.removeEventListener("storyChanged", handler);
  }, []);

  const likedStoryIds = likesData.map((l: any) => l.story?.id).filter(Boolean);

  // FIX 3: correct like endpoint
  const handleLike = async (id: number | string) => {
    try {
      await api.post(`/stories/${id}/like`);
      loadBookmarks();
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleBookmark = () => {
    loadBookmarks();
  };

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

          {saved.map((b, i) => {
            const s = b.story;
            if (!s) return null;

            // FIX 4: properly extract authorName and likes from nested story shape
            const storyProp: Story = {
              ...s,
              bookmarked: true,
              liked: likedStoryIds.includes(s.id),
              likes: s.likeCount ?? s.likes ?? 0,
              authorName: s.author?.name ?? s.authorName ?? "Anonymous",
            };

            return (
              <StoryCard
                key={b.id}
                story={storyProp}
                index={i}
                onLike={handleLike}
                onBookmark={handleBookmark}
              />
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StoryCard } from "@/components/StoryCard";
import { useAuth } from "../lib/auth";
import { useEffect, useState, useRef } from "react";
import { api, type Story } from "@/lib/api";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Writers Attic" }] }),
  component: () => (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  ),
});

function ProfilePage() {
  const { user } = useAuth();

  const [mine, setMine] = useState<Story[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [likesData, setLikesData] = useState<any[]>([]);

  // ================= LOAD ALL =================
  const loadAll = () => {
    loadLikes();
    loadBookmarks();
    loadMyStories();
  };

  // FIX: stable ref so event listener never captures stale closure
  const loadAllRef = useRef(loadAll);
  useEffect(() => {
    loadAllRef.current = loadAll;
  });

  useEffect(() => {
    loadAllRef.current();
    const handler = () => loadAllRef.current();
    window.addEventListener("storyChanged", handler);
    return () => window.removeEventListener("storyChanged", handler);
  }, []);

  // ================= LIKES =================
  const loadLikes = () => {
    api
      .get("/likes")
      .then((r) => {
        setLikesData(r.data?.data || r.data || []);
      })
      .catch(() => setLikesData([]));
  };

  const likedStoryIds = (likesData || [])
    .map((l: any) => l.story?.id)
    .filter(Boolean);

  const handleLike = async (id: number | string) => {
    try {
      await api.post(`/stories/${id}/like`);
      loadAll();
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  // ================= BOOKMARKS =================
  const loadBookmarks = () => {
    api
      .get("/bookmarks")
      .then((r) => {
        setBookmarks(r.data?.data || r.data || []);
      })
      .catch(() => setBookmarks([]));
  };

  // ================= MY STORIES =================
  const loadMyStories = () => {
    api
      .get("/stories")
      .then((r) => {
        const stories = r.data?.data || r.data?.stories || r.data;

        const currentUser = JSON.parse(
          localStorage.getItem("wa_user") || "{}"
        );

        const mineStories = (Array.isArray(stories) ? stories : []).filter(
          (s) => s.authorName === currentUser.name
        );

        setMine(mineStories);
      })
      .catch(() => setMine([]));
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-16">

        {/* PROFILE HEADER */}
        <div className="paper-card flex flex-col items-center p-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-coffee font-serif text-3xl text-cream">
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>

          <h1 className="mt-5 font-serif text-3xl text-coffee">
            {user?.name}
          </h1>

          <p className="mt-1 font-type text-xs uppercase tracking-[0.25em] text-coffee/60">
            {user?.email}
          </p>

          {user?.role && (
            <span className="mt-3 rounded-full bg-paper/60 px-3 py-1 font-type text-[10px] uppercase tracking-[0.25em] text-coffee">
              {user.role}
            </span>
          )}
        </div>

        {/* MY STORIES */}
        <h2 className="mt-12 font-serif text-2xl text-coffee">
          Your stories
        </h2>

        <div className="mt-6 space-y-8">
          {mine.map((s, i) => (
            <StoryCard
              key={s.id}
              story={s}
              index={i}
              onLike={handleLike}
            />
          ))}
        </div>

        {/* BOOKMARKS */}
        <h2 className="mt-12 font-serif text-2xl text-coffee">
          Bookmarks
        </h2>

        <p>Total bookmarks: {bookmarks.length}</p>

        <div className="mt-6 space-y-8">
          {bookmarks.map((b, i) => (
            <StoryCard
              key={b.story.id}
              story={{
                id: b.story.id,
                title: b.story.title,
                content: b.story.content,
                createdAt: b.story.createdAt,
                bookmarked: true,
                liked: likedStoryIds.includes(b.story.id),
                likes: b.story.likeCount || b.story.likes || 0,
                authorName: b.story.author?.name ?? b.story.authorName ?? "Anonymous",
              }}
              index={i}
              onLike={handleLike}
            />
          ))}
        </div>

      </div>
    </PageShell>
  );
}
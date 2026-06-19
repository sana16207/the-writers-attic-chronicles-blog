import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Loader } from "@/components/Loader";
import { CommentBox } from "@/components/CommentBox";
import { api, type Story, type Comment } from "@/lib/api";
import { useAuth } from "../lib/auth";
import { Heart, Bookmark, ArrowLeft, Trash2 } from "lucide-react";

export const Route = createFileRoute("/story/$id")({
  component: StoryPage,
});

function authorName(s?: Story | null) {
  return s?.authorName ?? "Anonymous";
}

function StoryPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();

  const [story, setStory] = useState<Story | null | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    let live = true;

    // STORY
    api
      .get(`/stories/${id}`)
      .then((r) => {
        if (!live) return;

        const data =
          r.data?.data ||
          r.data?.story ||
          r.data;

        setStory(data);
      })
      .catch(() => {
        if (live) setStory(null);
      });

    // COMMENTS
    api
      .get(`/comments/story/${id}`)
      .then((r) => {
        if (!live) return;

        const data =
          r.data?.data ||
          r.data?.comments ||
          r.data;

        setComments(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (live) setComments([]);
      });

    return () => {
      live = false;
    };
  }, [id]);

  const handleAddComment = async (text: string) => {
    try {
      const { data } = await api.post("/comments", {
        content: text,
        storyId: Number(id),
      });

      setComments((prev) => [...prev, data]);
    } catch {
      setComments((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          content: text,
          authorName: user?.name ?? "You",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this story?")) return;

    try {
      await api.delete(`/stories/${story?.id}`);
      window.location.href = "/";
    } catch (err: any) {
      console.log(err?.response?.data);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  if (story === undefined) {
    return (
      <PageShell>
        <Loader />
      </PageShell>
    );
  }

  if (story === null) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="font-serif text-3xl text-coffee">
            This story has wandered off.
          </h1>

          <Link
            to="/"
            className="mt-6 inline-block font-type text-xs uppercase tracking-[0.25em] text-gold"
          >
            ← Back to the feed
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-6 py-16">

        {/* BACK */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-coffee/60 hover:text-gold-deep"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All stories
        </Link>

        {/* HEADER */}
        <header className="mt-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-coffee/60">
            Chapter ·{" "}
            {story.createdAt &&
              new Date(story.createdAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
          </p>

          <h1 className="font-display text-4xl md:text-6xl text-coffee mt-4">
            {story.title || "Untitled Story"}
          </h1>

          <p className="mt-3 italic text-coffee/70">
            — by {authorName(story)} —
          </p>
        </header>

        {/* CONTENT */}
        <div className="mt-12 text-[18px] leading-[1.9] text-ink/90">
          {(story.content || "")
            .split(/\n\n+/)
            .map((p, i) => (
              <p key={i} className="mb-6">
                {p}
              </p>
            ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-center gap-4 mt-10">

          <button
            onClick={() => setLiked(!liked)}
            className="flex items-center gap-2 border px-4 py-2 rounded"
          >
            <Heart className={liked ? "fill-red-500 text-red-500" : ""} />
            {liked ? "Loved" : "Love"}
          </button>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="flex items-center gap-2 border px-4 py-2 rounded"
          >
            <Bookmark className={bookmarked ? "fill-yellow-500 text-yellow-500" : ""} />
            {bookmarked ? "Saved" : "Bookmark"}
          </button>

        </div>

        {/* DELETE (only owner/admin backend will allow) */}
        <button
          onClick={handleDelete}
          className="mt-8 flex items-center gap-2 border px-4 py-2 hover:bg-gray-100"
        >
          <Trash2 size={16} />
          Delete Story
        </button>

        {/* COMMENTS */}
        <CommentBox
          comments={comments}
          onSubmit={user ? handleAddComment : undefined}
          disabled={!user}
        />

      </article>
    </PageShell>
  );
}
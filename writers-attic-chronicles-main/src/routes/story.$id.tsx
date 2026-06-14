import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Loader } from "@/components/Loader";
import { CommentBox } from "@/components/CommentBox";
import { api, type Story, type Comment } from "@/lib/api";
import { useAuth } from "../lib/auth";
import { Heart, Bookmark, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/story/$id")({
  component: StoryPage,
});

function authorName(s?: Story | null) {
  if (!s) return "Anonymous";
  return s.authorName ?? "Anonymous";
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

        const story =
          r.data?.data ||
          r.data?.story ||
          r.data;

        setStory(story);
      })
      .catch(() => {
        if (live) setStory(null);
      });

    // COMMENTS
    api
  .get(`/comments/story/${id}`)
  .then((r) => {
    if (!live) return;

    const comments =
      r.data?.data ||
      r.data?.comments ||
      r.data;

    setComments(Array.isArray(comments) ? comments : []);
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
      const { data } = await api.post(
  "/comments",
  {
    content: text,
    storyId: Number(id),
  }
);

setComments((c) => [...c, data]);
    } catch {
      setComments((c) => [
        ...c,
        {
          id: `local-${Date.now()}`,
          content: text,
          authorName: user?.name ?? "You",
          createdAt: new Date().toISOString(),
        },
      ]);
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
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-type text-[11px] uppercase tracking-[0.3em] text-coffee/60 hover:text-gold-deep"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All stories
        </Link>

        <header className="mt-10 text-center animate-ink">
          <p className="font-type text-[11px] uppercase tracking-[0.4em] text-coffee/60">
            Chapter ·{" "}
            {story.createdAt &&
              new Date(story.createdAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
          </p>

          <div className="chapter-rule my-5 mx-auto max-w-xs">
            <span className="ornament text-sm">❦</span>
          </div>

          <h1 className="font-display text-4xl leading-[1.05] text-coffee md:text-6xl">
            {story.title || "Untitled Story"}
          </h1>

          <p className="mt-5 font-body italic text-coffee/70">
            — by {authorName(story)} —
          </p>
        </header>

        <div className="chapter-rule my-12">
          <span className="ornament text-lg">❦ ✦ ❦</span>
        </div>

        <div className="font-body text-[19px] leading-[1.9] text-ink/90 animate-fade-up [text-align:justify] hyphens-auto">
          {(story.content || "")
            .split(/\n\n+/)
            .map((p, i) => (
              <p
                key={i}
                className={`mb-7 ${i === 0 ? "drop-cap" : ""}`}
              >
                {p}
              </p>
            ))}
        </div>

        <div className="chapter-rule my-12">
          <span className="ornament text-base">finis</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setLiked(!liked)}
            className="flex items-center gap-2 rounded-sm border border-coffee/30 bg-card/70 px-5 py-2.5 text-coffee/80 transition-colors hover:bg-paper/60 hover:text-gold-deep"
          >
            <Heart
              className={`h-4 w-4 ${
                liked ? "fill-gold text-gold-deep" : ""
              }`}
            />
            <span className="font-type text-[11px] uppercase tracking-[0.25em]">
              {liked ? "Loved" : "Love this"}
            </span>
          </button>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="flex items-center gap-2 rounded-sm border border-coffee/30 bg-card/70 px-5 py-2.5 text-coffee/80 transition-colors hover:bg-paper/60 hover:text-gold-deep"
          >
            <Bookmark
              className={`h-4 w-4 ${
                bookmarked ? "fill-gold text-gold-deep" : ""
              }`}
            />
            <span className="font-type text-[11px] uppercase tracking-[0.25em]">
              {bookmarked ? "Saved" : "Bookmark"}
            </span>
          </button>
        </div>

        <CommentBox
          comments={comments}
          onSubmit={user ? handleAddComment : undefined}
          disabled={!user}
        />
      </article>
    </PageShell>
  );
}
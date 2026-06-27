import { Link } from "@tanstack/react-router";
import { Heart, Bookmark } from "lucide-react";
import type { Story } from "@/lib/api";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

function authorName(s: Story) {
  return s?.authorName ?? "Anonymous";
}

function preview(content?: string | null, n = 180) {
  if (!content) return "No content available";
  const t = content.replace(/<[^>]+>/g, "").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

function timeAgo(d?: string) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function StoryCard({
  story,
  index = 0,
  onLike,
  onBookmark,
}: {
  story: Story;
  index?: number;
  onLike?: (id: number | string) => void;
  onBookmark?: (id: number | string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  // story prop change aagum pothu (parent refresh) local state sync aaganum
  useEffect(() => {
    setLiked(Boolean(story?.liked));
    setLikes(Number(story?.likes ?? 0));
    setBookmarked(Boolean((story as any)?.bookmarked));
  }, [story.id, story.liked, story.likes, (story as any).bookmarked]);

  // ================= LIKE =================
  const handleLike = async (e: any) => {
    e.preventDefault();

    try {
      if (!liked) {
        await api.post(`/stories/${story.id}/like`);
        setLiked(true);
        setLikes((l) => l + 1);
      } else {
        await api.delete(`/stories/${story.id}/like`);
        setLiked(false);
        setLikes((l) => Math.max(0, l - 1));
      }

      window.dispatchEvent(new Event("storyChanged"));
      onLike?.(story.id);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= BOOKMARK =================
  const handleBookmark = async (e: any) => {
    e.preventDefault();

    try {
      if (!bookmarked) {
        await api.post(`/stories/${story.id}/bookmark`);
        setBookmarked(true);
      } else {
        await api.delete(`/stories/${story.id}/bookmark`);
        setBookmarked(false);
      }

      window.dispatchEvent(new Event("storyChanged"));
      onBookmark?.(story.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <article
      className="manuscript warm-glow animate-fade-up p-8 md:p-11"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="relative">
        <div className="flex items-center gap-3 font-type text-[10px] uppercase tracking-[0.32em] text-coffee/60">
          <span>№ {String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-6 bg-coffee/30" />
          <span>{authorName(story)}</span>
          <span className="h-px w-6 bg-coffee/30" />
          <span>{timeAgo(story.createdAt)}</span>
        </div>

        <Link
          to="/story/$id"
          params={{ id: String(story.id) }}
          className="mt-4 block"
        >
          <h2 className="font-display text-[2.1rem] md:text-[2.6rem] leading-[1.05] text-coffee hover:text-gold-deep">
            {story.title || "Untitled Story"}
          </h2>
        </Link>

        <p className="mt-5 text-[17px] leading-[1.85] text-ink/85">
          {preview(story.content)}
        </p>

        <div className="mt-7 flex items-center justify-between border-t border-coffee/15 pt-5">
          <Link
            to="/story/$id"
            params={{ id: String(story.id) }}
            className="font-type text-[11px] uppercase tracking-[0.3em] text-gold-deep"
          >
            Continue reading →
          </Link>

          <div className="flex items-center gap-2">
            {/* LIKE */}
            <button onClick={handleLike} className="flex items-center gap-1.5">
              <Heart
                className={`h-4 w-4 ${
                  liked ? "fill-gold text-gold-deep" : ""
                }`}
              />
              <span className="text-[11px]">{likes}</span>
            </button>

            {/* BOOKMARK */}
            <button onClick={handleBookmark} className="p-2">
              <Bookmark
                className={`h-4 w-4 ${
                  bookmarked ? "fill-yellow-400 text-yellow-500" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
import { Link } from "@tanstack/react-router";
import { Heart, Bookmark } from "lucide-react";
import type { Story } from "@/lib/api";
import { useState } from "react";
  import { useEffect } from "react";

import { api } from "@/lib/api";
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
}: {
  story: Story;
  index?: number;
}) {

const [liked, setLiked] = useState(false);
const [bookmarked, setBookmarked] = useState(false);
const [likes, setLikes] = useState(0);

useEffect(() => {
  setLiked(Boolean(story?.liked));
  setBookmarked(Boolean(story?.bookmarked));
  setLikes(Number(story?.likes ?? 0));
}, [story]);
console.log("StoryCard:", story.id, story.likes, story.liked);
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
          <h2 className="font-display text-[2.1rem] md:text-[2.6rem] leading-[1.05] text-coffee transition-colors hover:text-gold-deep">
            {story.title || "Untitled Story"}
          </h2>
        </Link>

        <div className="chapter-rule mt-5">
          <span className="ornament text-xs">❦</span>
        </div>

        <p className="mt-5 font-body text-[17px] leading-[1.85] text-ink/85">
          {preview(story.content)}
        </p>

        <div className="mt-7 flex items-center justify-between border-t border-coffee/15 pt-5">
          <Link
            to="/story/$id"
            params={{ id: String(story.id) }}
            className="font-type text-[11px] uppercase tracking-[0.3em] text-gold-deep hover:text-coffee"
          >
            Continue reading →
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={async (e) => {
  e.preventDefault();

  try {
    if (!liked) {
      await api.post(`/stories/${story.id}/like`);
      setLiked(true);
      setLikes((l) => l + 1);
    } else {
      await api.delete(`/stories/${story.id}/like`);
      setLiked(false);
      setLikes((l) => l - 1);
    }
  } catch (err) {
    console.error(err);
  }
}}
              className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-coffee/70 transition-colors hover:bg-paper/40 hover:text-gold-deep"
              aria-label="Like"
            >
              <Heart
                className={`h-4 w-4 ${
                  liked ? "fill-gold text-gold-deep" : ""
                }`}
              />
              <span className="font-type text-[11px]">{likes}</span>
            </button>

            <button
              onClick={async (e) => {
  e.preventDefault();

  try {
    if (!bookmarked) {
      await api.post(`/stories/${story.id}/bookmark`);
      setBookmarked(true);
    } else {
      await api.delete(`/stories/${story.id}/bookmark`);
      setBookmarked(false);
    }
  } catch (err) {
    console.error(err);
  }
}}
              className="rounded-sm p-2 text-coffee/70 transition-colors hover:bg-paper/40 hover:text-gold-deep"
              aria-label="Bookmark"
            >
              <Bookmark
                className={`h-4 w-4 ${
                  bookmarked ? "fill-gold text-gold-deep" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
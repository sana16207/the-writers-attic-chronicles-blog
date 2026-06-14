import type { Comment } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function authorName(c: Comment) {
  if (c.authorName) return c.authorName;
  if (typeof c.author === "string") return c.author;
  return c.author?.name ?? "A reader";
}

export function CommentBox({
  comments,
  onSubmit,
  disabled,
}: {
  comments: Comment[];
  onSubmit?: (text: string) => Promise<void> | void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !onSubmit) return;
    setBusy(true);
    try { await onSubmit(text.trim()); setText(""); } finally { setBusy(false); }
  };

  return (
    <section className="mt-14">
      <h3 className="font-serif text-2xl text-coffee">Marginalia</h3>
      <p className="mt-1 font-type text-xs uppercase tracking-[0.25em] text-coffee/60">Notes from fellow readers</p>

      <div className="mt-6 space-y-4">
        {comments.length === 0 && (
          <p className="font-body italic text-muted-foreground">No notes yet — be the first to scribble.</p>
        )}
        {comments.map((c, i) => (
          <div
            key={c.id}
            className="paper-card animate-fade-up p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="font-body text-[15px] leading-relaxed text-ink/85">{c.content}</p>
            <div className="mt-3 font-type text-[11px] uppercase tracking-[0.25em] text-coffee/60">
              — {authorName(c)}
              {c.createdAt && <span className="ml-2">· {new Date(c.createdAt).toLocaleDateString()}</span>}
            </div>
          </div>
        ))}
      </div>

      {onSubmit && (
        <form onSubmit={submit} className="mt-8 paper-card p-5">
          {disabled ? (
            <p className="font-body text-sm italic text-muted-foreground">Sign in to leave a note.</p>
          ) : (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Pen a thought…"
                rows={3}
                className="w-full resize-none bg-transparent font-body text-[15px] text-ink outline-none placeholder:text-coffee/40"
              />
              <div className="mt-3 flex justify-end">
                <Button type="submit" disabled={busy || !text.trim()} className="bg-coffee text-cream hover:bg-coffee-light">
                  {busy ? "Posting…" : "Leave note"}
                </Button>
              </div>
            </>
          )}
        </form>
      )}
    </section>
  );
}

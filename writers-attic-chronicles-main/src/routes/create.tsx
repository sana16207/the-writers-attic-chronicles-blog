import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "Write — Writers Attic" }] }),
  component: () => <ProtectedRoute><CreatePage /></ProtectedRoute>,
});

function CreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  const publish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("A title and a body are required.");
      return;
    }
    setBusy(true);
    try {
      const response = await api.post("/stories", {
  title,
  content,
  status: "PUBLISHED",
});

toast.success("Published.");

const storyId =
  response.data?.data?.id ||
  response.data?.id;

navigate({
  to: "/story/$id",
  params: {
    id: String(storyId),
  },
});
    } catch (err: any) {
      console.log("FULL ERROR", err);
  console.log("ERROR DATA", err?.response?.data);
      toast.error(err?.response?.data?.message ?? "Could not publish. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell hideFooter>
      <div className="mx-auto max-w-3xl px-6 py-14">
        <p className="font-type text-xs uppercase tracking-[0.3em] text-coffee/60">A blank page</p>
        <h1 className="mt-2 font-serif text-3xl text-coffee">Compose</h1>

        <div className="paper-card mt-8 p-8 md:p-12">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your title…"
            className="w-full border-b border-border bg-transparent pb-4 font-serif text-4xl leading-tight text-coffee outline-none placeholder:text-coffee/30 md:text-5xl"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Begin where the lamp is brightest…"
            rows={18}
            className="mt-6 w-full resize-none bg-transparent font-body text-[18px] leading-[1.8] text-ink outline-none placeholder:text-coffee/40"
          />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="font-type text-xs uppercase tracking-[0.25em] text-coffee/50">
            {content.trim().split(/\s+/).filter(Boolean).length} words
          </p>
          <button onClick={publish} disabled={busy} className="ink-stamp hover:ink-stamp-hover disabled:opacity-60">
            {busy ? "Pressing…" : "Publish story"}
          </button>
        </div>
      </div>
    </PageShell>
  );
}

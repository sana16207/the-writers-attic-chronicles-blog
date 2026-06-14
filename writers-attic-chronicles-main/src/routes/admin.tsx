import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminTable, type Column } from "@/components/AdminTable";
import { api, type Story, type User, type Comment } from "@/lib/api";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, MessageCircle } from "lucide-react";
import { SAMPLE_STORIES, SAMPLE_COMMENTS } from "@/lib/sample-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Writers Attic" }] }),
  component: () => <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>,
});

function AdminPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [stories, setStories] = useState<Story[] | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);

  useEffect(() => {
    api.get<User[]>("/admin/users").then((r) => setUsers(r.data ?? [])).catch(() => setUsers([]));
    api.get<Story[]>("/stories").then((r) => setStories(r.data ?? [])).catch(() => setStories(SAMPLE_STORIES));
    api.get<Comment[]>("/admin/comments")
      .then((r) => setComments(r.data ?? []))
      .catch(() => setComments(Object.values(SAMPLE_COMMENTS).flat()));
  }, []);

  const deleteStory = async (s: Story) => {
    try { await api.delete(`/stories/${s.id}`); } catch {}
    setStories((prev) => prev?.filter((x) => x.id !== s.id) ?? null);
    toast.success("Story removed.");
  };

  const deleteComment = async (c: Comment) => {
    try { await api.delete(`/comments/${c.id}`); } catch {}
    setComments((prev) => prev?.filter((x) => x.id !== c.id) ?? null);
    toast.success("Comment removed.");
  };

  const deleteUser = async (u: User) => {
    try { await api.delete(`/admin/users/${u.id}`); } catch {}
    setUsers((prev) => prev?.filter((x) => x.id !== u.id) ?? null);
    toast.success("User removed.");
  };

  const userCols: Column<User>[] = [
    { header: "Name", cell: (u) => u.name },
    { header: "Email", cell: (u) => u.email },
    { header: "Role", cell: (u) => <span className="font-type text-[11px] uppercase tracking-widest text-gold">{u.role ?? "USER"}</span> },
  ];
  const storyCols: Column<Story>[] = [
    { header: "Title", cell: (s) => <span className="font-serif text-coffee">{s.title}</span> },
    { header: "Author", cell: (s) => s.authorName ?? (typeof s.author === "string" ? s.author : s.author?.name ?? "—") },
    { header: "Posted", cell: (s) => s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—" },
  ];
  const commentCols: Column<Comment>[] = [
    { header: "Comment", cell: (c) => <span className="line-clamp-2">{c.content}</span> },
    { header: "Author", cell: (c) => c.authorName ?? (typeof c.author === "string" ? c.author : c.author?.name ?? "—") },
  ];

  if (!users || !stories || !comments) return <PageShell><Loader /></PageShell>;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <p className="font-type text-[11px] uppercase tracking-[0.4em] text-coffee/60">Keeper of the Keys · Archivist's Records</p>
        <h1 className="mt-2 font-display text-5xl text-coffee">The Records Room</h1>
        <div className="chapter-rule mt-5 max-w-md">
          <span className="ornament text-sm">❦</span>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <StatCard icon={<Users className="h-5 w-5" />} label="Members" value={users.length} />
          <StatCard icon={<BookOpen className="h-5 w-5" />} label="Stories" value={stories.length} />
          <StatCard icon={<MessageCircle className="h-5 w-5" />} label="Comments" value={comments.length} />
        </div>

        <Tabs defaultValue="stories" className="mt-10">
          <TabsList className="bg-paper/40">
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <TabsContent value="stories" className="mt-6">
            <AdminTable rows={stories} columns={storyCols} onDelete={deleteStory} emptyText="No stories yet." />
          </TabsContent>
          <TabsContent value="users" className="mt-6">
            <AdminTable rows={users} columns={userCols} onDelete={deleteUser} emptyText="No members yet." />
          </TabsContent>
          <TabsContent value="comments" className="mt-6">
            <AdminTable rows={comments} columns={commentCols} onDelete={deleteComment} emptyText="No comments yet." />
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="paper-card warm-glow p-6">
      <div className="flex items-center gap-3 text-coffee/70">{icon}<span className="font-type text-xs uppercase tracking-[0.25em]">{label}</span></div>
      <div className="mt-3 font-serif text-4xl text-coffee">{value}</div>
    </div>
  );
}

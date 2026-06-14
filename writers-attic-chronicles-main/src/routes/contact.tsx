import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Writers Attic" }] }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you — your letter is on its way.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-xl px-6 py-20">
        <p className="font-type text-xs uppercase tracking-[0.4em] text-coffee/60">Post a letter</p>
        <h1 className="mt-3 font-serif text-5xl text-coffee">Contact</h1>
        <p className="mt-4 font-body text-[17px] leading-relaxed text-ink/80">
          A note, a question, a story you'd like to send our way — we read everything.
        </p>

        <form onSubmit={submit} className="paper-card mt-10 space-y-5 p-8">
          <div>
            <Label className="font-type text-xs uppercase tracking-[0.25em] text-coffee/70">Name</Label>
            <Input required value={form.name} onChange={set("name")}
              className="mt-2 border-coffee/30 bg-cream/60 focus-visible:ring-gold" />
          </div>
          <div>
            <Label className="font-type text-xs uppercase tracking-[0.25em] text-coffee/70">Email</Label>
            <Input required type="email" value={form.email} onChange={set("email")}
              className="mt-2 border-coffee/30 bg-cream/60 focus-visible:ring-gold" />
          </div>
          <div>
            <Label className="font-type text-xs uppercase tracking-[0.25em] text-coffee/70">Message</Label>
            <textarea required rows={6} value={form.message} onChange={set("message")}
              className="mt-2 w-full rounded-md border border-coffee/30 bg-cream/60 p-3 font-body text-ink outline-none focus:ring-2 focus:ring-gold" />
          </div>
          <button type="submit" className="ink-stamp hover:ink-stamp-hover">Send letter</button>
        </form>
      </div>
    </PageShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy — Writers Attic" }] }),
  component: PrivacyPage,
});

const sections: { h: string; p: string }[] = [
  { h: "What we collect", p: "Only what we need to keep your account safe and your stories yours: a name, an email, a password (kept as a hash), and the words you choose to publish." },
  { h: "How we use it", p: "To show your work, to let other readers leave notes, and to keep the lights on. We do not sell your data, and we do not run advertising on Writers Attic." },
  { h: "Cookies", p: "We use a small number of cookies to keep you signed in. Nothing more." },
  { h: "Your rights", p: "You may export or delete your account at any time. Write to us and we'll see it done." },
  { h: "Changes to this policy", p: "If we ever update this document, we'll mark the date plainly and explain what changed." },
];

function PrivacyPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-2xl px-6 py-20">
        <p className="font-type text-xs uppercase tracking-[0.4em] text-coffee/60">Last revised — January 2026</p>
        <h1 className="mt-3 font-serif text-5xl text-coffee">Privacy</h1>
        <p className="mt-6 font-body text-[17px] leading-relaxed text-ink/85">
          We try to keep this short, which is itself a kind of privacy policy.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((s, i) => (
            <section key={i} className="paper-card p-6">
              <h2 className="font-serif text-xl text-coffee">{s.h}</h2>
              <p className="mt-2 font-body text-[16px] leading-relaxed text-ink/80">{s.p}</p>
            </section>
          ))}
        </div>
      </article>
    </PageShell>
  );
}

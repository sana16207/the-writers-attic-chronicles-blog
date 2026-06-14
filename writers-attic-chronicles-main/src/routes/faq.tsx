import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Is Writers Attic free?", a: "Yes — reading and writing are free. We may one day add a small subscription for premium features, but the core will always be free." },
  { q: "Who owns the stories I write?", a: "You do, entirely. We host them; we never claim them." },
  { q: "Can I export my work?", a: "Yes. Each story can be downloaded as Markdown from your profile." },
  { q: "How do likes and bookmarks work?", a: "Likes are public counts; bookmarks are private, kept just for you in the bookmarks page." },
  { q: "How do I become an editor or admin?", a: "We invite editors by hand. If you'd like to help, write to us via the contact page." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — Writers Attic" }] }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 py-20">
        <p className="font-type text-xs uppercase tracking-[0.4em] text-coffee/60">Help & questions</p>
        <h1 className="mt-3 font-serif text-5xl text-coffee">Frequently asked</h1>

        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border-b border-border">
              <AccordionTrigger className="py-5 text-left font-serif text-xl text-coffee hover:text-gold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-[16px] leading-relaxed text-ink/80">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </PageShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Writers Attic" },
      { name: "description", content: "The story behind Writers Attic, a vintage literary journal." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-2xl px-6 py-20">
        <p className="font-type text-xs uppercase tracking-[0.4em] text-coffee/60">Chapter I</p>
        <h1 className="mt-3 font-serif text-5xl text-coffee">About the Attic</h1>
        <div className="mt-10 space-y-6 font-body text-[18px] leading-[1.85] text-ink/85">
          <p className="first-letter:font-serif first-letter:text-6xl first-letter:font-semibold first-letter:text-coffee first-letter:mr-2 first-letter:float-left first-letter:leading-[0.9]">
            Writers Attic began, as most good things do, on a rainy evening with a half-cold cup of coffee. We wanted a place to write that did not buzz, did not blink, did not interrupt. A place that felt less like a feed and more like a desk by a window.
          </p>
          <p>
            What you are reading is a small experiment in slowness. There are no trending topics here, no infinite scroll designed to outlast your attention. There is, instead, a quiet feed of stories — essays, fragments, letters never sent — written by people who would rather be read once, carefully, than skimmed by thousands.
          </p>
          <p>
            We borrow our manners from the old journals: serif type, generous margins, a bit of typewriter ink for accent. We borrow our spirit from the corner cafés where strangers leave books on the windowsill for the next reader.
          </p>
          <p className="font-type text-sm uppercase tracking-[0.2em] text-coffee/70">
            — The Editors
          </p>
        </div>
      </article>
    </PageShell>
  );
}

import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-cream/60">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-coffee" />
              <span className="font-serif text-xl text-coffee">Writers <span className="italic text-gold">Attic</span></span>
            </div>
            <p className="mt-3 max-w-sm font-body text-sm text-muted-foreground">
              A quiet corner of the internet for unhurried writing, slow reading, and stories worth keeping.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-coffee/70">Wander</h4>
            <ul className="mt-3 space-y-2 font-body text-sm">
              <li><Link to="/" className="hover:text-gold">Feed</Link></li>
              <li><Link to="/about" className="hover:text-gold">About</Link></li>
              <li><Link to="/faq" className="hover:text-gold">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-coffee/70">The Fine Print</h4>
            <ul className="mt-3 space-y-2 font-body text-sm">
              <li><Link to="/privacy" className="hover:text-gold">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 font-type text-xs uppercase tracking-[0.3em] text-coffee/60">
          © {new Date().getFullYear()} Writers Attic — bound by hand.
        </p>
      </div>
    </footer>
  );
}

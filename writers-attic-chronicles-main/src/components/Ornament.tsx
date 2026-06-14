export function Ornament({ glyph = "❦", className = "" }: { glyph?: string; className?: string }) {
  return (
    <div className={`chapter-rule my-10 ${className}`}>
      <span className="ornament text-lg">{glyph}</span>
    </div>
  );
}

export function FleuronRow() {
  return (
    <div className="flex items-center justify-center gap-3 text-gold-deep/70 font-display text-sm tracking-[0.5em]">
      <span>❦</span><span>✦</span><span>❦</span>
    </div>
  );
}

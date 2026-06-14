export function Loader({ label = "Brewing…" }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-coffee/20 border-t-gold" />
      </div>
      <p className="font-type text-xs uppercase tracking-[0.3em] text-coffee/60">{label}</p>
    </div>
  );
}

import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
export function PageShell({ children, hideFooter = false }: { children: ReactNode; hideFooter?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* 🔥 ADD TOP PADDING FOR NAVBAR */}
      <main className="flex-1 pt-20">
        {children}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

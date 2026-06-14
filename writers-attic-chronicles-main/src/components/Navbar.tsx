import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, PenLine, User as UserIcon, LogOut, Bookmark, Shield, Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-coffee transition-colors group-hover:text-gold" />
          <span className="font-serif text-2xl tracking-tight text-coffee">
            Writers <span className="italic text-gold">Attic</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/">Feed</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button asChild variant="ghost" className="text-coffee hover:bg-paper/60">
                <Link to="/create"><PenLine className="mr-2 h-4 w-4" />Write</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-coffee/30 bg-card text-coffee hover:bg-paper/60">
                    <UserIcon className="mr-2 h-4 w-4" />
                    {user.name?.split(" ")[0] ?? "Profile"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card">
                  <DropdownMenuItem asChild><Link to="/profile"><UserIcon className="mr-2 h-4 w-4"/>My Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/bookmarks"><Bookmark className="mr-2 h-4 w-4"/>Bookmarks</Link></DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild><Link to="/admin"><Shield className="mr-2 h-4 w-4"/>Admin</Link></DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-coffee hover:bg-paper/60">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild className="bg-coffee text-cream hover:bg-coffee-light">
                <Link to="/signup">Join</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden text-coffee" onClick={() => setOpen(!open)} aria-label="Menu">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-cream md:hidden">
          <div className="flex flex-col gap-2 px-6 py-4">
            <Link to="/" onClick={() => setOpen(false)} className="py-2 font-body text-coffee">Feed</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="py-2 font-body text-coffee">About</Link>
            <Link to="/faq" onClick={() => setOpen(false)} className="py-2 font-body text-coffee">FAQ</Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="py-2 font-body text-coffee">Contact</Link>
            {user ? (
              <>
                <Link to="/create" onClick={() => setOpen(false)} className="py-2 font-body text-coffee">Write</Link>
                <Link to="/profile" onClick={() => setOpen(false)} className="py-2 font-body text-coffee">Profile</Link>
                <Link to="/bookmarks" onClick={() => setOpen(false)} className="py-2 font-body text-coffee">Bookmarks</Link>
                {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="py-2 font-body text-coffee">Admin</Link>}
                <button onClick={handleLogout} className="py-2 text-left font-body text-coffee">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="py-2 font-body text-coffee">Sign in</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="py-2 font-body text-coffee">Join</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="font-body text-[15px] text-coffee/80 transition-colors hover:text-gold"
      activeProps={{ className: "text-gold" }}
      activeOptions={{ exact: to === "/" }}
    >
      {children}
    </Link>
  );
}

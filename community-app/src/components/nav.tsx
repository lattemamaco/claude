import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth-actions";
import type { User } from "@/generated/prisma/client";

export function Nav({ user }: { user: User }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/journal", label: "Journal" },
    { href: "/community", label: "Community" },
  ];
  if (user.role === "ADMIN") {
    links.push({ href: "/admin", label: "Admin" });
  }

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link href="/" className="font-serif text-lg tracking-wide text-foreground">
          Rooted in Bloom
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <span className="text-border">·</span>
          <span className="text-muted">{user.displayName}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline"
            >
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}

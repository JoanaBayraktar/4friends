"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/group", label: "Crew", icon: "🏠" },
  { href: "/chat", label: "Chat", icon: "💬" },
  { href: "/leaderboard", label: "Rangliste", icon: "🏆" },
  { href: "/me", label: "Profil", icon: "👤" },
  { href: "/settings", label: "Mehr", icon: "⚙️" },
];

export function BottomNav() {
  const pathname = usePathname();

  // The chat page is a fixed full-screen view with its own sticky input
  // bar at the bottom, so the bottom nav would overlap it on mobile.
  if (pathname?.startsWith("/chat")) return null;

  // No navigation while signing in / creating an account.
  if (pathname?.startsWith("/login")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-orange-100 bg-white/90 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-3xl items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/group" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
                isActive ? "text-orange-600" : "text-zinc-400"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

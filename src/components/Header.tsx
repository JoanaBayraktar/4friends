"use client";

import Link from "next/link";
import { usePoints } from "@/hooks/usePoints";
import { getNextLevel } from "@/lib/points";

export function Header() {
  const { points, level, hydrated } = usePoints();
  const next = getNextLevel(points);

  return (
    <header className="border-b border-orange-100 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/group" className="text-lg font-semibold tracking-tight">
          4Friends
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-medium text-zinc-600 sm:flex">
          <Link href="/group" className="hover:text-zinc-900">
            Crew
          </Link>
          <Link href="/chat" className="hover:text-zinc-900">
            Chat
          </Link>
          <Link href="/leaderboard" className="hover:text-zinc-900">
            Rangliste
          </Link>
          <Link href="/me" className="hover:text-zinc-900">
            Mein Profil
          </Link>
          <Link href="/settings" className="hover:text-zinc-900">
            Einstellungen
          </Link>
        </nav>

        {hydrated && (
          <div
            className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-900"
            title={
              next
                ? `${next.threshold - points} Punkte bis ${next.name}`
                : "Höchstes Level erreicht"
            }
          >
            <span>{level.emoji}</span>
            <span>{points} P</span>
          </div>
        )}
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePoints } from "@/hooks/usePoints";
import { useAuth } from "@/hooks/useAuth";
import { getNextLevel } from "@/lib/points";

export function Header({ backHref }: { backHref?: string } = {}) {
  const { points, level, hydrated } = usePoints();
  const { profile, signOut } = useAuth();
  const next = getNextLevel(points);

  return (
    <header className="border-b border-orange-100 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          {backHref && (
            <Link
              href={backHref}
              aria-label="Zurück"
              className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-xl text-zinc-600 transition-colors hover:bg-orange-100"
            >
              ←
            </Link>
          )}
          <Link href="/group" className="text-lg font-semibold tracking-tight">
            4Friends
          </Link>
        </div>

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

        <div className="flex items-center gap-2">
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

          {profile && (
            <button
              type="button"
              onClick={() => void signOut()}
              aria-label="Abmelden"
              title="Abmelden"
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-zinc-500 transition-colors hover:bg-orange-100 hover:text-zinc-900"
            >
              🚪
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

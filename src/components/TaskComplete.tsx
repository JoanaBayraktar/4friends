"use client";

import Link from "next/link";
import { POINTS_PER_TASK } from "@/lib/points";

export function TaskComplete({ name }: { name: string }) {
  return (
    <div className="space-y-4 rounded-2xl bg-white p-6 text-center shadow-sm">
      <span className="text-4xl">🎉</span>
      <p className="text-lg font-medium text-zinc-900">
        Danke! Das hilft {name}s Profil weiter.
      </p>
      <div className="animate-points-pop inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2 text-lg font-semibold text-orange-900">
        <span>+{POINTS_PER_TASK}</span>
        <span>Punkte 🎉</span>
      </div>
      <Link
        href="/group"
        className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Zurück zur Übersicht
      </Link>
    </div>
  );
}

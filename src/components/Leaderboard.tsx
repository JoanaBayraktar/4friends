"use client";

import { usePoints } from "@/hooks/usePoints";
import { MOCK_PROFILES } from "@/lib/mock-data";
import { CURRENT_USER_ID } from "@/lib/chat";

const MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard() {
  const { points, hydrated } = usePoints();

  if (!hydrated) return null;

  const ranking = MOCK_PROFILES.map((profile) => ({
    profile,
    points: profile.id === CURRENT_USER_ID ? points : profile.mockPoints ?? 0,
  })).sort((a, b) => b.points - a.points);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
      <p className="mb-3 text-sm font-medium text-zinc-700">
        Punkte-Rangliste deines Freundeskreises
      </p>
      <ul className="space-y-2">
        {ranking.map((entry, index) => {
          const isMe = entry.profile.id === CURRENT_USER_ID;
          return (
            <li
              key={entry.profile.id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                isMe ? "bg-orange-50" : ""
              }`}
            >
              <span className="w-6 text-center text-sm font-semibold text-zinc-400">
                {MEDALS[index] ?? `${index + 1}.`}
              </span>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${entry.profile.color}`}
              >
                {entry.profile.initials}
              </span>
              <span className="flex-1 text-sm font-medium text-zinc-900">
                {entry.profile.name}
                {isMe && (
                  <span className="ml-1 text-xs font-normal text-zinc-400">
                    (du)
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold text-orange-900">
                {entry.points} P
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

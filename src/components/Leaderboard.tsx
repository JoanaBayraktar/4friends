"use client";

import { useAuth } from "@/hooks/useAuth";
import { useGroupMembers } from "@/hooks/useGroupMembers";
import { Avatar } from "@/components/Avatar";

const MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard() {
  const { userId } = useAuth();
  const { members, hydrated } = useGroupMembers();

  if (!hydrated) return null;

  const ranking = [...members].sort((a, b) => b.points - a.points);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
      <p className="mb-3 text-sm font-medium text-zinc-700">
        Punkte-Rangliste deines Freundeskreises
      </p>
      <ul className="space-y-2">
        {ranking.map((member, index) => {
          const isMe = member.id === userId;
          return (
            <li
              key={member.id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                isMe ? "bg-orange-50" : ""
              }`}
            >
              <span className="w-6 text-center text-sm font-semibold text-zinc-400">
                {MEDALS[index] ?? `${index + 1}.`}
              </span>
              <Avatar
                name={member.name}
                color={member.color}
                imageUrl={member.image_url}
                className="h-9 w-9 text-xs"
              />
              <span className="flex-1 text-sm font-medium text-zinc-900">
                {member.name}
                {isMe && (
                  <span className="ml-1 text-xs font-normal text-zinc-400">
                    (du)
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold text-orange-900">
                {member.points} P
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import { usePoints } from "@/hooks/usePoints";
import { POINTS_PER_TASK } from "@/lib/points";
import { getProfileById } from "@/lib/mock-data";

export function ProfileStats({
  answeredAboutCount,
  topReplierId,
}: {
  answeredAboutCount: number;
  topReplierId: string;
}) {
  const { points, hydrated: pointsHydrated } = usePoints();

  const topReplier = getProfileById(topReplierId);
  const questionsAnswered = pointsHydrated
    ? Math.round(points / POINTS_PER_TASK)
    : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2">
      <div className="col-span-2 row-span-2 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-orange-400 to-rose-400 p-5 text-white shadow-sm">
        <p className="text-sm font-medium text-white/80">Punkte gesamt</p>
        <p className="text-5xl font-bold tracking-tight">
          {pointsHydrated ? points : 0}
        </p>
        <p className="text-xs text-white/70">
          Jede beantwortete Aufgabe bringt dich ein Level weiter.
        </p>
      </div>

      <Stat
        label="Aufgaben erledigt"
        value={questionsAnswered}
        className="col-span-2"
      />

      <Stat label="Über dich beantwortet" value={answeredAboutCount} />

      <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
        <p className="text-xs font-medium text-zinc-400">Top Replier</p>
        {topReplier ? (
          <div className="mt-2 flex flex-col items-center gap-1">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${topReplier.color}`}
            >
              {topReplier.initials}
            </span>
            <span className="text-sm font-semibold text-zinc-900">
              {topReplier.name}
            </span>
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-400">–</p>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  className = "",
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl bg-white p-4 text-center shadow-sm ${className}`}
    >
      <p className="text-xs font-medium text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-900">{value}</p>
    </div>
  );
}

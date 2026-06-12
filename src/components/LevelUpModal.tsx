"use client";

import type { Level } from "@/lib/points";

export function LevelUpModal({
  level,
  onClose,
}: {
  level: Level;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="animate-level-up flex max-w-xs flex-col items-center gap-3 rounded-3xl bg-white px-8 py-10 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-6xl">{level.emoji}</span>
        <p className="text-sm font-medium uppercase tracking-wide text-orange-500">
          Level Up!
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">
          {level.name}
        </h2>
        <p className="text-sm text-zinc-500">
          Du sammelst fleißig liebevolle Eindrücke für deinen Freundeskreis.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          Weiter so!
        </button>
      </div>
    </div>
  );
}

"use client";

import { useProfileSettings } from "@/hooks/useProfileSettings";

export function ProfileExtras() {
  const { settings, hydrated, updateSettings } = useProfileSettings();

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <label
        htmlFor="favorite-song"
        className="mb-2 block text-sm font-medium text-zinc-700"
      >
        🎵 Aktueller Lieblingssong
      </label>
      <input
        id="favorite-song"
        value={hydrated ? settings.favoriteSong : ""}
        onChange={(e) => updateSettings({ favoriteSong: e.target.value })}
        placeholder="z. B. Artist – Songtitel"
        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
      />
      <p className="mt-2 text-xs text-zinc-400">
        Wird auf deinem Profil angezeigt, damit dein Freundeskreis weiß, was
        bei dir gerade läuft.
      </p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ProfileEditor({
  userId,
  initialContent,
  initialApproved,
}: {
  userId: string;
  initialContent: string;
  initialApproved: boolean;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [content, setContent] = useState(initialContent);
  const [approved, setApproved] = useState(initialApproved);
  const [saved, setSaved] = useState(false);

  async function handleSave(nextApproved: boolean) {
    await supabase.from("profile_summaries").upsert(
      {
        about_user_id: userId,
        content,
        approved: nextApproved,
        approved_at: nextApproved ? new Date().toISOString() : null,
      },
      { onConflict: "about_user_id" }
    );
    setApproved(nextApproved);
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <label
          htmlFor="profile-text"
          className="mb-2 block text-sm font-medium text-zinc-700"
        >
          Generierter Profiltext
        </label>
        <textarea
          id="profile-text"
          rows={6}
          value={content}
          onChange={(e) => {
            setSaved(false);
            setContent(e.target.value);
          }}
          placeholder="Hier erscheint der aus den Antworten deiner Freund:innen generierte Text. Du kannst ihn anpassen, bevor du ihn freigibst."
          className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm leading-relaxed focus:border-zinc-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => void handleSave(false)}
          className="flex-1 rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-white"
        >
          Als Entwurf speichern
        </button>
        <button
          type="button"
          onClick={() => void handleSave(true)}
          className="flex-1 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          Profil freigeben
        </button>
      </div>

      {saved && (
        <p className="text-center text-sm text-emerald-600">
          {approved
            ? "Dein Profil ist freigegeben und für deinen Freundeskreis sichtbar."
            : "Entwurf gespeichert. Noch nicht freigegeben."}
        </p>
      )}
    </div>
  );
}

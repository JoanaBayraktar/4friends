"use client";

import { useState } from "react";

export function ProfileEditor({
  initialContent,
  initialApproved,
}: {
  initialContent: string;
  initialApproved: boolean;
}) {
  const [content, setContent] = useState(initialContent);
  const [approved, setApproved] = useState(initialApproved);
  const [saved, setSaved] = useState(false);

  function handleSave(nextApproved: boolean) {
    // TODO: persist `content` and `approved` to `profile_summaries`
    // for the signed-in user.
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
          onClick={() => handleSave(false)}
          className="flex-1 rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-white"
        >
          Als Entwurf speichern
        </button>
        <button
          type="button"
          onClick={() => handleSave(true)}
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

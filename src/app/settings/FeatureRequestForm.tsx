"use client";

import { useState } from "react";
import { useFeatureRequests } from "@/hooks/useFeatureRequests";
import type { FeatureRequestType } from "@/lib/feature-requests";

export function FeatureRequestForm() {
  const { addRequest } = useFeatureRequests();
  const [type, setType] = useState<FeatureRequestType>("feature");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit() {
    if (!text.trim()) return;
    addRequest(type, text.trim());
    setText("");
    setSent(true);
  }

  return (
    <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-medium text-zinc-700">Ideen &amp; Wünsche</p>
        <p className="text-xs text-zinc-400">
          Fehlt dir eine Funktion oder hast du eine coole neue Frage für die
          Aufgaben? Lass es uns wissen!
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setType("feature");
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              type === "feature"
                ? "bg-orange-100 text-orange-900"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            }`}
          >
            💡 Neue Funktion
          </button>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setType("question");
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              type === "question"
                ? "bg-orange-100 text-orange-900"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            }`}
          >
            ❓ Neue Frage
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => {
            setSent(false);
            setText(e.target.value);
          }}
          rows={3}
          placeholder={
            type === "feature"
              ? "Welche Funktion fehlt dir in 4Friends?"
              : "Welche Frage sollten wir den Leuten in den Aufgaben stellen?"
          }
          className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm leading-relaxed focus:border-zinc-400 focus:outline-none"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          Absenden
        </button>
      </div>

      {sent && (
        <p className="text-sm text-emerald-600">
          Danke für deine Idee! Wir schauen uns das an. 💛
        </p>
      )}
    </div>
  );
}

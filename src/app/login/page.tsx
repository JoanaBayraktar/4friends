"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = ["code", "name", "photo"] as const;
type Step = (typeof STEPS)[number];

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("code");

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(step);

  function goNext() {
    if (step === "code") setStep("name");
    else if (step === "name") setStep("photo");
  }

  function goBack() {
    if (step === "photo") setStep("name");
    else if (step === "name") setStep("code");
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleFinish(e: React.FormEvent) {
    e.preventDefault();
    // TODO: validate invite code against `groups.invite_code`, create/sign
    // in the user, upsert their `profiles` row and upload the photo to
    // Supabase Storage (-> profiles.image_url).
    router.push("/group");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <form
        onSubmit={handleFinish}
        className="w-full max-w-sm space-y-5 rounded-2xl bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= stepIndex ? "bg-orange-400" : "bg-orange-100"
              }`}
            />
          ))}
        </div>

        {step === "code" && (
          <div className="space-y-5">
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Freundeskreis beitreten
              </h1>
              <p className="text-sm text-zinc-500">
                Gib den Einladungscode deines Freundeskreises ein.
              </p>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="code"
                className="text-sm font-medium text-zinc-700"
              >
                Einladungscode
              </label>
              <input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="z. B. CREW2026"
                required
                autoFocus
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={!code}
              className="w-full rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Weiter
            </button>
          </div>
        )}

        {step === "name" && (
          <div className="space-y-5">
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Wer bist du?
              </h1>
              <p className="text-sm text-zinc-500">
                So sehen dich deine Freund:innen in der App.
              </p>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-zinc-700"
              >
                Dein Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Wie sollen dich andere sehen?"
                required
                autoFocus
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="pronouns"
                className="text-sm font-medium text-zinc-700"
              >
                Pronomen{" "}
                <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <input
                id="pronouns"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                placeholder="z. B. sie/ihr, er/ihm, they/them"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
              >
                Zurück
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!name}
                className="flex-1 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Weiter
              </button>
            </div>
          </div>
        )}

        {step === "photo" && (
          <div className="space-y-5">
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Profilfoto
              </h1>
              <p className="text-sm text-zinc-500">
                Optional – du kannst das später jederzeit ändern.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <label
                htmlFor="photo"
                className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-orange-100 text-sm font-medium text-orange-900 transition-colors hover:bg-orange-200"
              >
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt="Profilfoto-Vorschau"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "Foto wählen"
                )}
              </label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <p className="rounded-xl bg-orange-50 px-4 py-3 text-center text-xs text-zinc-500">
              Bald: Deine Freund:innen können dir liebevoll ein neues
              Profilbild vorschlagen, das du dann freigeben kannst. Erstmal
              nur als Idee festgehalten – kommt noch nicht. ✨
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
              >
                Zurück
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              >
                Loslegen
              </button>
            </div>
          </div>
        )}
      </form>
    </main>
  );
}

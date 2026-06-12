"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Avatar } from "@/components/Avatar";
import { useAuth } from "@/hooks/useAuth";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { createClient } from "@/lib/supabase/client";
import type { Group } from "@/lib/supabase/types";
import { FeatureRequestForm } from "./FeatureRequestForm";

export default function SettingsPage() {
  const { profile, refreshProfile, signOut } = useAuth();
  const { settings, hydrated, updateSettings } = useProfileSettings();
  const supabase = useMemo(() => createClient(), []);
  const [group, setGroup] = useState<Group | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    let active = true;
    supabase
      .from("groups")
      .select("*")
      .eq("id", profile.group_id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setGroup(data ?? null);
      });
    return () => {
      active = false;
    };
  }, [profile, supabase]);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setPhotoError(null);
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${profile.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      // Bust caches so the new photo shows up immediately everywhere.
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ image_url: publicUrl })
        .eq("id", profile.id);
      if (updateError) throw updateError;

      await refreshProfile();
    } catch (err) {
      setPhotoError(
        err instanceof Error
          ? err.message
          : "Foto konnte nicht hochgeladen werden."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  if (!hydrated || !profile) {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Einstellungen
          </h1>
          <p className="text-sm text-zinc-500">
            Verwalte dein Profil, deinen Freundeskreis und mehr.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-zinc-700">Dein Profil</p>

            <div className="flex items-center gap-4">
              <label
                htmlFor="photo"
                className="cursor-pointer transition-opacity hover:opacity-80"
              >
                <Avatar
                  name={profile.name}
                  color={profile.color}
                  imageUrl={profile.image_url}
                  className="h-16 w-16 text-sm"
                />
              </label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => void handlePhotoChange(e)}
                disabled={uploading}
                className="hidden"
              />
              <label
                htmlFor="photo"
                className={`cursor-pointer rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 ${
                  uploading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                {uploading ? "Wird hochgeladen …" : "Foto ändern"}
              </label>
            </div>
            {photoError && (
              <p className="text-sm text-rose-600">{photoError}</p>
            )}

            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-zinc-700"
              >
                Name
              </label>
              <input
                id="name"
                value={settings.name}
                onChange={(e) => {
                  setSaved(false);
                  void updateSettings({ name: e.target.value });
                }}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="pronouns"
                className="text-sm font-medium text-zinc-700"
              >
                Pronomen
              </label>
              <input
                id="pronouns"
                value={settings.pronouns}
                onChange={(e) => {
                  setSaved(false);
                  void updateSettings({ pronouns: e.target.value });
                }}
                placeholder="z. B. sie/ihr, er/ihm, they/them"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <p className="rounded-xl bg-orange-50 px-4 py-3 text-xs text-zinc-500">
              Bald: Deine Freund:innen können dir liebevoll ein neues
              Profilbild vorschlagen, das du dann freigeben kannst. ✨
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-medium text-zinc-700">
                Benachrichtigungen
              </p>
              <p className="text-xs text-zinc-400">
                Erhalte eine Erinnerung, wenn eine neue Aufgabe für dich
                wartet.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.notifications}
              onClick={() => {
                setSaved(false);
                void updateSettings({ notifications: !settings.notifications });
              }}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                settings.notifications ? "bg-orange-400" : "bg-zinc-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  settings.notifications ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          <div className="space-y-2 rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-zinc-700">
              Dein Freundeskreis
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Name</span>
              <span className="font-medium text-zinc-900">
                {group?.name ?? "–"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Einladungscode</span>
              <span className="font-mono font-medium text-zinc-900">
                {group?.invite_code ?? "–"}
              </span>
            </div>
          </div>

          <div className="space-y-2 rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-zinc-700">
              Bald verfügbar
            </p>
            <ul className="space-y-1 text-sm text-zinc-500">
              <li>🖼️ Profilbild-Vorschläge von deinem Freundeskreis</li>
              <li>🎬 Gemeinsame Filme- &amp; Serien-Liste zum Bewerten</li>
            </ul>
          </div>

          <FeatureRequestForm />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="flex-1 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Speichern
            </button>
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex-1 rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
            >
              Abmelden
            </button>
          </div>

          {saved && (
            <p className="text-center text-sm text-emerald-600">
              Einstellungen gespeichert.
            </p>
          )}
        </form>
      </main>
    </div>
  );
}

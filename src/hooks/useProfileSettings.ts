"use client";

import { useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { ProfileSettings } from "@/lib/profile-settings";
import type { Database } from "@/lib/supabase/types";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export function useProfileSettings() {
  const { userId, profile, hydrated, refreshProfile } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const settings: ProfileSettings = {
    name: profile?.name ?? "",
    pronouns: profile?.pronouns ?? "",
    favoriteSong: profile?.favorite_song ?? "",
    notifications: profile?.notifications ?? true,
  };

  const updateSettings = useCallback(
    async (patch: Partial<ProfileSettings>) => {
      if (!userId) return;
      const dbPatch: ProfileUpdate = {};
      if (patch.name !== undefined) dbPatch.name = patch.name;
      if (patch.pronouns !== undefined) dbPatch.pronouns = patch.pronouns;
      if (patch.favoriteSong !== undefined)
        dbPatch.favorite_song = patch.favoriteSong;
      if (patch.notifications !== undefined)
        dbPatch.notifications = patch.notifications;

      await supabase.from("profiles").update(dbPatch).eq("id", userId);
      await refreshProfile();
    },
    [userId, supabase, refreshProfile]
  );

  return { settings, hydrated, updateSettings };
}

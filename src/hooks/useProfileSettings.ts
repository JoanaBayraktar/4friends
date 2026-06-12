"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_PROFILE_SETTINGS,
  PROFILE_SETTINGS_KEY,
  type ProfileSettings,
} from "@/lib/profile-settings";

export function useProfileSettings() {
  const [settings, setSettings] = useState<ProfileSettings>(
    DEFAULT_PROFILE_SETTINGS
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(PROFILE_SETTINGS_KEY);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
        setSettings({ ...DEFAULT_PROFILE_SETTINGS, ...JSON.parse(stored) });
      } catch {
        setSettings(DEFAULT_PROFILE_SETTINGS);
      }
    }
    setHydrated(true);
  }, []);

  const updateSettings = useCallback((patch: Partial<ProfileSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      window.localStorage.setItem(PROFILE_SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, hydrated, updateSettings };
}

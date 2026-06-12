"use client";

import { useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { FeatureRequestType } from "@/lib/feature-requests";

export function useFeatureRequests() {
  const { userId, profile } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const addRequest = useCallback(
    async (type: FeatureRequestType, text: string) => {
      if (!userId || !profile) return;
      await supabase.from("feature_requests").insert({
        group_id: profile.group_id,
        user_id: userId,
        type,
        text,
      });
    },
    [userId, profile, supabase]
  );

  return { addRequest };
}

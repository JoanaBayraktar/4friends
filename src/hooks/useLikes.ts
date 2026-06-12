"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

// Tracks which individual freitext answers the current user has "hearted",
// backed by the `freitext_answer_likes` table.
export function useLikes() {
  const { userId } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    supabase
      .from("freitext_answer_likes")
      .select("answer_id")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (!active) return;
        setLiked(new Set((data ?? []).map((row) => row.answer_id)));
        setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, [userId, supabase]);

  const toggleLike = useCallback(
    (id: string) => {
      if (!userId) return;
      setLiked((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          void supabase
            .from("freitext_answer_likes")
            .delete()
            .eq("answer_id", id)
            .eq("user_id", userId);
        } else {
          next.add(id);
          void supabase
            .from("freitext_answer_likes")
            .insert({ answer_id: id, user_id: userId });
        }
        return next;
      });
    },
    [userId, supabase]
  );

  const isLiked = useCallback((id: string) => liked.has(id), [liked]);

  return { hydrated, toggleLike, isLiked };
}

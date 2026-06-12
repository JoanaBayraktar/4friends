"use client";

import { useCallback, useEffect, useState } from "react";
import { LIKES_STORAGE_KEY } from "@/lib/likes";

export function useLikes() {
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(LIKES_STORAGE_KEY);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
        setLiked(new Set(JSON.parse(stored) as string[]));
      } catch {
        setLiked(new Set());
      }
    }
    setHydrated(true);
  }, []);

  const toggleLike = useCallback((id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      window.localStorage.setItem(
        LIKES_STORAGE_KEY,
        JSON.stringify(Array.from(next))
      );
      return next;
    });
  }, []);

  const isLiked = useCallback((id: string) => liked.has(id), [liked]);

  return { hydrated, toggleLike, isLiked };
}

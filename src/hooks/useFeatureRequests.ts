"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FEATURE_REQUESTS_KEY,
  type FeatureRequest,
  type FeatureRequestType,
} from "@/lib/feature-requests";

export function useFeatureRequests() {
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(FEATURE_REQUESTS_KEY);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
        setRequests(JSON.parse(stored) as FeatureRequest[]);
      } catch {
        setRequests([]);
      }
    }
    setHydrated(true);
  }, []);

  const addRequest = useCallback((type: FeatureRequestType, text: string) => {
    setRequests((prev) => {
      const next: FeatureRequest[] = [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          type,
          text,
          createdAt: new Date().toISOString(),
        },
      ];
      window.localStorage.setItem(FEATURE_REQUESTS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { requests, hydrated, addRequest };
}

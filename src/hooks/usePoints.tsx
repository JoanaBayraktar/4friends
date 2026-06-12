"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { getLevel, getLevelIndex, type Level } from "@/lib/points";

type PointsContextValue = {
  points: number;
  level: Level;
  hydrated: boolean;
  addPoints: (
    amount: number,
    reason?: string
  ) => Promise<{ newLevel: Level | null }>;
};

const PointsContext = createContext<PointsContextValue | null>(null);

export function PointsProvider({ children }: { children: ReactNode }) {
  const { userId, profile, hydrated, refreshProfile } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const points = profile?.points ?? 0;

  const addPoints = useCallback(
    async (
      amount: number,
      reason = "task_completed"
    ): Promise<{ newLevel: Level | null }> => {
      const before = points;
      if (userId) {
        await supabase
          .from("point_events")
          .insert({ user_id: userId, amount, reason });
        await refreshProfile();
      }
      const after = before + amount;
      const newLevel =
        getLevelIndex(after) > getLevelIndex(before) ? getLevel(after) : null;
      return { newLevel };
    },
    [userId, points, supabase, refreshProfile]
  );

  return (
    <PointsContext.Provider
      value={{ points, level: getLevel(points), hydrated, addPoints }}
    >
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error("usePoints must be used within a PointsProvider");
  }
  return context;
}

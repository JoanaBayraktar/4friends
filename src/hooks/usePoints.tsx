"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getLevel, getLevelIndex, POINTS_STORAGE_KEY, type Level } from "@/lib/points";

type PointsContextValue = {
  points: number;
  level: Level;
  hydrated: boolean;
  addPoints: (amount: number) => { newLevel: Level | null };
};

const PointsContext = createContext<PointsContextValue | null>(null);

export function PointsProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(POINTS_STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
    setPoints(stored ? Number(stored) || 0 : 0);
    setHydrated(true);
  }, []);

  const addPoints = useCallback(
    (amount: number): { newLevel: Level | null } => {
      const next = points + amount;
      window.localStorage.setItem(POINTS_STORAGE_KEY, String(next));
      setPoints(next);

      const newLevel =
        getLevelIndex(next) > getLevelIndex(points) ? getLevel(next) : null;
      return { newLevel };
    },
    [points]
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

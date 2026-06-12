// Gamification helpers. Points live on `profiles.points`, backed by
// `point_events` (see supabase/migrations and src/hooks/usePoints.tsx).

export const POINTS_PER_TASK = 15;

export type Level = {
  threshold: number;
  name: string;
  emoji: string;
};

export const LEVELS: Level[] = [
  { threshold: 0, name: "Neuling", emoji: "🌱" },
  { threshold: 30, name: "Mitwisser:in", emoji: "👀" },
  { threshold: 75, name: "Vertraute:r", emoji: "🤝" },
  { threshold: 150, name: "Seelenverwandte:r", emoji: "✨" },
  { threshold: 250, name: "Freundschafts-Champion", emoji: "🏆" },
];

export function getLevel(points: number): Level {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (points >= level.threshold) {
      current = level;
    }
  }
  return current;
}

export function getLevelIndex(points: number): number {
  return LEVELS.indexOf(getLevel(points));
}

export function getNextLevel(points: number): Level | null {
  const index = getLevelIndex(points);
  return LEVELS[index + 1] ?? null;
}

// lib/runningStats.ts

export const secondsToTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const secondsToPace = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}'${s.toString().padStart(2, "0")}/km`;
};

import type { Race } from "../data/races"; // ✅ Cambiado a type-only import

// mejor carrera por distancia
export const getBestRace = (races: Race[], distance: number): Race | null => {
  const filtered = races.filter(r => r.distance_km === distance);
  if (!filtered.length) return null;

  return filtered.reduce((best, current) =>
    current.finish_time_sec < best.finish_time_sec ? current : best
  );
};

// ritmo medio
export const getAveragePace = (races: Race[]): number => {
  const total = races.reduce((sum, r) => sum + r.pace_sec_km, 0);
  return Math.round(total / races.length);
};

// mejora (%) desde primera a última carrera
export const getImprovement = (races: Race[]): number => {
  const sorted = [...races].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  return ((first.pace_sec_km - last.pace_sec_km) / first.pace_sec_km) * 100;
};
/**
 * lib / formatters.ts
 */

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

export const formatPace = (pace: string): string => {
  return pace.replace("'", ":").replace("/km", "");
};
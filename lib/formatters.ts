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

// ── Conversión de unidades (km <-> mi) ──

export const KM_PER_MILE = 1.609344;

export const kmToMiles = (km: number): number => km / KM_PER_MILE;

// pace_sec_km está en segundos por km; lo convertimos a segundos por milla
export const paceSecPerKmToSecPerMile = (secPerKm: number): number =>
  secPerKm * KM_PER_MILE;

// Formatea segundos como "M:SS" (sin sufijo de unidad, se indica en el
// encabezado de la columna / opción seleccionada)
export const secondsToPaceColon = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};
// data/races.ts

export interface Race {
  name: string;
  distance: string;
  distance_km: number;
  location: string;
  date: string;
  date_obj: Date;

  dorsal?: number;

  finish_time: string;
  official_time?: string;
  pace: string;

  // 🔥 cálculos
  finish_time_sec: number;
  pace_sec_km: number;

  // extra
  general_position?: string;
  category_position?: string;
  coordinates?: { lat: number; lon: number };
  split_5k?: string;
  split_4k?: string; // Añadido para splits alternativos

  color_bg: string;
  color_text: string;
}

// helpers
const toSeconds = (time: string): number => {
  const [min, sec] = time.split(":").map(Number);
  return min * 60 + sec;
};

const paceToSeconds = (pace: string): number => {
  const [min, rest] = pace.split("'");
  const sec = rest.replace("/km", "");
  return Number(min) * 60 + Number(sec);
};

export const races: Race[] = [
  {
    name: "XXVI Carrera al Amanecer Santa Pola",
    distance: "6 km",
    distance_km: 6,
    location: "Santa Pola",
    date: "2022-08-28",
    date_obj: new Date("2022-08-28"),
    dorsal: 723,
    finish_time: "30:16",
    official_time: "30:42",
    pace: "5'07/km",
    finish_time_sec: toSeconds("30:16"),
    pace_sec_km: paceToSeconds("5'07/km"),
    general_position: "444/1411",
    category_position: "393/971",
    coordinates: { lat: 38.1917, lon: -0.5558 },
    color_bg: "#2596be",
    color_text: "white",
  },
  {
    name: "VIII 10k Rotary Elche",
    distance: "10 km",
    distance_km: 10,
    location: "Elche",
    date: "2023-02-12",
    date_obj: new Date("2023-02-12"),
    dorsal: 706,
    finish_time: "52:44",
    official_time: "52:56",
    pace: "5'18/km",
    finish_time_sec: toSeconds("52:44"),
    pace_sec_km: paceToSeconds("5'18/km"),
    general_position: "522/784",
    category_position: "201/242",
    coordinates: { lat: 38.2691, lon: -0.6989 },
    color_bg: "#faae3f",
    color_text: "#2e56a3",
  },
  {
    name: "Benidorm Half (10k)",
    distance: "10 km",
    distance_km: 10,
    location: "Benidorm",
    date: "2023-11-25",
    date_obj: new Date("2023-11-25"),
    dorsal: 4396,
    finish_time: "49:09",
    official_time: "49:24",
    pace: "4'56/km",
    finish_time_sec: toSeconds("49:09"),
    pace_sec_km: paceToSeconds("4'56/km"),
    general_position: "453/2059",
    category_position: "12/21",
    coordinates: { lat: 38.5408, lon: -0.1226 },
    color_bg: "#ffffff",
    color_text: "#82afcd",
  },
  {
    name: "III Elche Night Race (5k)",
    distance: "5 km",
    distance_km: 5,
    location: "Elche",
    date: "2024-05-11",
    date_obj: new Date("2024-05-11"),
    dorsal: 3061,
    finish_time: "28:27",
    official_time: "29:04",
    pace: "5'49/km",
    finish_time_sec: toSeconds("28:27"),
    pace_sec_km: paceToSeconds("5'49/km"),
    general_position: "358/986",
    category_position: "135/226",
    coordinates: { lat: 38.2691, lon: -0.6989 },
    color_bg: "#000000",
    color_text: "#59d14b",
  },
  {
    name: "52 Media Elche (10k Pompadour)",
    distance: "10 km",
    distance_km: 10,
    location: "Elche",
    date: "2025-03-23",
    date_obj: new Date("2025-03-23"),
    dorsal: 10546,
    finish_time: "48:55",
    official_time: "49:49",
    pace: "4'59/km",
    finish_time_sec: toSeconds("48:55"),
    pace_sec_km: paceToSeconds("4'59/km"),
    split_5k: "25:14",
    general_position: "317/1292",
    category_position: "115/280",
    coordinates: { lat: 38.2691, lon: -0.6989 },
    color_bg: "#e20909",
    color_text: "#ffffff",
  },
  {
    name: "IV Elche Night Race (5k)",
    distance: "5 km",
    distance_km: 5,
    location: "Elche",
    date: "2025-05-10",
    date_obj: new Date("2025-05-10"),
    dorsal: 3222,
    finish_time: "24:19",
    official_time: "24:39",
    pace: "4'56/km",
    finish_time_sec: toSeconds("24:19"),
    pace_sec_km: paceToSeconds("4'56/km"),
    general_position: "221/1265",
    category_position: "42/89",
    coordinates: { lat: 38.2691, lon: -0.6989 },
    color_bg: "#000000",
    color_text: "#59d14b",
  },
  {
    name: "XXIX Carrera al Amanecer Santa Pola",
    distance: "6 km",
    distance_km: 6,
    location: "Santa Pola",
    date: "2025-08-31",
    date_obj: new Date("2025-08-31"),
    dorsal: 1096,
    finish_time: "26:14",
    official_time: "26:22",
    pace: "4'24/km",
    finish_time_sec: toSeconds("26:14"),
    pace_sec_km: paceToSeconds("4'24/km"),
    general_position: "140/1806",
    category_position: "126/1073",
    coordinates: { lat: 38.1917, lon: -0.5558 },
    color_bg: "#2596be",
    color_text: "white",
  },
  {
    name: "10k Internacional Santa Pola",
    distance: "10 km",
    distance_km: 10,
    location: "Santa Pola",
    date: "2026-01-18",
    date_obj: new Date("2026-01-18"),
    dorsal: 7262,
    finish_time: "44:17",
    official_time: "44:23",
    pace: "4'26/km",
    finish_time_sec: toSeconds("44:17"),
    pace_sec_km: paceToSeconds("4'26/km"),
    general_position: "225/1346",
    category_position: "78/212",
    coordinates: { lat: 38.1917, lon: -0.5558 },
    color_bg: "#f4b00e",
    color_text: "#000000",
  },
  // 🆕 Carrera futura
  {
    name: "V Elche Night Race (5k)",
    distance: "5km",
    distance_km: 5,
    location: "Elche",
    date: "2026-05-16",
    date_obj: new Date("2026-05-16"),
    dorsal: 5311, // Pendiente de asignar
    finish_time: "21:34",
    official_time: "22:01",
    pace: "4'22/km",
    finish_time_sec: toSeconds("21:34"),
    pace_sec_km: paceToSeconds("4'22/km"),
    general_position: "167/2004",
    category_position: "25/139",
    coordinates: { lat: 38.2691, lon: -0.6989 },
    color_bg: "#8b5cf6",
    color_text: "white",
  },
];
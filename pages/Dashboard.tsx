// pages/Dashboard.tsx

import { useState, useEffect } from "react";
import { races } from "../data/races";
import {
  getBestRace,
  getAveragePace,
  getImprovement,
} from "../lib/runningStats";
import { secondsToPace, formatPace } from "../lib/formatters";
import RaceProgressionCharts from "../components/RaceProgressionCharts";

export default function Dashboard() {
  // Inicializar desde localStorage o preferencia del sistema
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Aplicar tema al body cuando cambie
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Filtrar carreras completadas (con tiempo)
  const completedRaces = races.filter(race => race.finish_time_sec > 0);
  const upcomingRaces = races.filter(race => race.finish_time_sec === 0);

  // Estadísticas por distancia
  const getStatsByDistance = () => {
    const stats: { [key: number]: { count: number; bestTime: number; bestRace: any } } = {};
    
    completedRaces.forEach(race => {
      const dist = race.distance_km;
      if (!stats[dist]) {
        stats[dist] = { count: 0, bestTime: Infinity, bestRace: null };
      }
      stats[dist].count++;
      if (race.finish_time_sec < stats[dist].bestTime) {
        stats[dist].bestTime = race.finish_time_sec;
        stats[dist].bestRace = race;
      }
    });
    
    return stats;
  };

  const distanceStats = getStatsByDistance();
  
  // Ordenar distancias
  const sortedDistances = Object.keys(distanceStats)
    .map(Number)
    .sort((a, b) => a - b);

  const best5k = getBestRace(completedRaces, 5);
  const best10k = getBestRace(completedRaces, 10);
  const avgPace = getAveragePace(completedRaces);
  const improvement = getImprovement(completedRaces);

  // Función de ordenación
  const handleSort = (key: string) => {
    setSortConfig(prev =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const sortedRaces = [...completedRaces].sort((a, b) => {
    if (!sortConfig) return b.date_obj.getTime() - a.date_obj.getTime();

    const dir = sortConfig.direction === "asc" ? 1 : -1;

    switch (sortConfig.key) {
      case "date":     return dir * (a.date_obj.getTime() - b.date_obj.getTime());
      case "name":     return dir * a.name.localeCompare(b.name);
      case "distance": return dir * (a.distance_km - b.distance_km);
      case "time":     return dir * (a.finish_time_sec - b.finish_time_sec);
      case "official": return dir * ((a.finish_time_sec || 0) - (b.finish_time_sec || 0));
      case "pace":     return dir * (a.pace_sec_km - b.pace_sec_km);
      case "bib":      return dir * ((a.dorsal || 0) - (b.dorsal || 0));
      case "position": {
        const posA = parseInt(a.general_position?.split("/")[0] || "9999");
        const posB = parseInt(b.general_position?.split("/")[0] || "9999");
        return dir * (posA - posB);
      }
      default: return 0;
    }
  });

  // Icono de ordenación
  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    const isActive = sortConfig?.key === columnKey;
    const isAsc = isActive && sortConfig?.direction === "asc";
    const isDesc = isActive && sortConfig?.direction === "desc";

    return (
      <span style={{ display: "inline-flex", flexDirection: "column", marginLeft: "4px", lineHeight: 1, verticalAlign: "middle" }}>
        <span style={{ fontSize: "0.5rem", color: isAsc ? "#60a5fa" : "#475569", lineHeight: 1 }}>▲</span>
        <span style={{ fontSize: "0.5rem", color: isDesc ? "#60a5fa" : "#475569", lineHeight: 1 }}>▼</span>
      </span>
    );
  };

  // Helper para extraer posición numérica de "444/1411"
  const getPositionNumber = (positionStr: string | undefined): number | null => {
    if (!positionStr) return null;
    const parts = positionStr.split("/");
    return parseInt(parts[0], 10);
  };

  // Helper para sufijos de posición
  const getPositionSuffix = (position: number): string => {
    if (position === 1) return "st";
    if (position === 2) return "nd";
    if (position === 3) return "rd";
    return "th";
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Calcular días hasta la próxima carrera
  const getDaysUntil = (date: Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const raceDate = new Date(date);
    raceDate.setHours(0, 0, 0, 0);
    const diffTime = raceDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="dashboard-container">
      {/* Toggle Switch */}
      <div className="theme-toggle">
        <button 
          className={`toggle-switch ${darkMode ? "dark" : "light"}`}
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
        >
          <span className="toggle-slider">
            <span className="toggle-icon">{darkMode ? "🌙" : "☀️"}</span>
          </span>
        </button>
      </div>

      <h1 className="dashboard-title">
        Running Dashboard
      </h1>

      {/* UPCOMING RACE SECTION */}
      {upcomingRaces.length > 0 && (
        <div className="upcoming-section">
          <h2 className="section-title">Upcoming Race</h2>
          <div className="upcoming-card">
            <div className="upcoming-content">
              <div className="upcoming-name">{upcomingRaces[0].name}</div>
              <div className="upcoming-details">
                <span className="upcoming-distance">{upcomingRaces[0].distance}</span>
                <span className="upcoming-location">{upcomingRaces[0].location}</span>
                <span className="upcoming-date">
                  {new Date(upcomingRaces[0].date).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="upcoming-countdown">
                  🏃‍♂️ {getDaysUntil(upcomingRaces[0].date_obj)} days to go!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="stats-grid">

        {/* Tarjeta de estadísticas por distancia */}
        <div className="stat-card stat-card-distance">
          <div className="stat-title">Races by Distance</div>
          <div className="distance-stats">
            {sortedDistances.map(dist => {
              const count = distanceStats[dist].count;
              const label = dist === 21.1 ? "21K" : `${dist}K`;
              return (
                <div key={dist} className="distance-item">
                  <span className="distance-label">{label}</span>
                  <span className="distance-badges">
                    {Array.from({ length: count }).map((_, i) => (
                      <span key={i} className="distance-badge">●</span>
                    ))}
                  </span>
                  <span className="distance-count">{count} {count === 1 ? "race" : "races"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tarjeta de PRs */}
        <div className="stat-card stat-card-pr">
          <div className="stat-title">Personal Records</div>
          <div className="pr-stats">
            <div className="pr-item">
              <span className="pr-distance">5K</span>
              <span className="pr-time">{best5k?.finish_time || "-"}</span>
            </div>
            <div className="pr-item">
              <span className="pr-distance">10K</span>
              <span className="pr-time">{best10k?.finish_time || "-"}</span>
            </div>
          </div>
        </div>

        {/* Tarjeta de estadísticas generales */}
        <div className="stat-card stat-card-general">
          <div className="stat-title">Overall Stats</div>
          <div className="general-stats">
            <div className="general-item">
              <span className="general-label">Total Races</span>
              <span className="general-value">{completedRaces.length}</span>
            </div>
            <div className="general-item">
              <span className="general-label">Total Distance</span>
              <span className="general-value">
                {completedRaces.reduce((sum, r) => sum + r.distance_km, 0).toFixed(1)} km
              </span>
            </div>
            <div className="general-item">
              <span className="general-label">Avg Pace</span>
              <span className="general-value">{secondsToPace(avgPace)}</span>
            </div>
            <div className="general-item">
              <span className="general-label">Improvement</span>
              <span className={`general-value ${improvement >= 0 ? 'positive' : 'negative'}`}>
                {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA COMPLETA */}
      <div className="table-header">
        <h2>Race History</h2>
      </div>

      <div className="races-table-wrapper">
        <table className="races-table">
          <thead>
            <tr>
              {[
                { key: "date",     label: "Date" },
                { key: "name",     label: "Race" },
                { key: "distance", label: "Dist" },
                { key: "time",     label: "Time" },
                { key: "official", label: "Official" },
                { key: "pace",     label: "Pace" },
                { key: "bib",      label: "Bib" },
                { key: "position", label: "Position" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  style={{ cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}
                >
                  {label}<SortIcon columnKey={key} />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedRaces.map((race, i) => {
              const positionNum = getPositionNumber(race.general_position);
              return (
                <tr key={i}>
                  <td className="date-cell">
                    <span className="date-day">{new Date(race.date).getDate()}</span>
                    <span className="date-month">{new Date(race.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="date-year">{new Date(race.date).getFullYear()}</span>
                  </td>
                  <td className="race-name">{race.name}</td>
                  <td className="distance-cell">{race.distance_km} km</td>
                  <td className="time-cell">{race.finish_time}</td>
                  <td className="official-cell">{race.official_time || "-"}</td>
                  <td className="pace-cell">{race.pace ? formatPace(race.pace) : "-"}</td>
                  <td className="bib-cell">{race.dorsal || "-"}</td>
                  <td className="position-cell">
                    {race.general_position && positionNum
                      ? `${positionNum}${getPositionSuffix(positionNum)} (${race.category_position})`
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── RACE PROGRESSION CHARTS ── */}
      <RaceProgressionCharts darkMode={darkMode} />
    </div>
  );
}
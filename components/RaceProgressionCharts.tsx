// components/RaceProgressionCharts.tsx

import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";
import { races } from "../data/races";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler
);

// ─── helpers ────────────────────────────────────────────────────────────────

const fmtTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// ─── Tipos ──────────────────────────────────────────────────────────────────

interface RacePoint {
  label: string;     // etiqueta del eje X (año o nombre corto)
  timeSec: number;
  pace: string;
  raceName: string;
}

interface SeriesConfig {
  title: string;
  subtitle: string;
  color: string;
  fill: string;
  points: RacePoint[];
  /** Si true, el eje Y va de MAX → MIN (escala invertida, gráfica ascendente visualmente) */
  invertY: boolean;
  improvement: string | null;
}

// ─── Datos por serie ─────────────────────────────────────────────────────────

const buildSeries = (): SeriesConfig[] => {
  const completed = races.filter((r) => r.finish_time_sec > 0);

  // Agrupa por clave de serie
  const group = (
    filter: (r: (typeof completed)[0]) => boolean,
    labelFn: (r: (typeof completed)[0]) => string
  ): RacePoint[] =>
    completed
      .filter(filter)
      .sort((a, b) => a.date_obj.getTime() - b.date_obj.getTime())
      .map((r) => ({
        label: labelFn(r),
        timeSec: r.finish_time_sec,
        pace: r.pace,
        raceName: r.name,
      }));

  const improvementPct = (pts: RacePoint[]): string | null => {
    if (pts.length < 2) return null;
    const pct =
      ((pts[0].timeSec - pts[pts.length - 1].timeSec) / pts[0].timeSec) * 100;
    return pct.toFixed(1);
  };

  // ── 5K – Elche Night Race ────────────────────────────────────────────────
  const pts5k = group(
    (r) => r.distance_km === 5,
    (r) => String(new Date(r.date).getFullYear())
  );

  // ── 6K – Carrera al Amanecer ─────────────────────────────────────────────
  const pts6k = group(
    (r) => r.distance_km === 6,
    (r) => String(new Date(r.date).getFullYear())
  );

  // ── 10K – Todas las carreras de 10k ──────────────────────────────────────
  const pts10k = group(
    (r) => r.distance_km === 10,
    (r) => {
      // Etiqueta corta = año + nombre abreviado
      const yr = new Date(r.date).getFullYear();
      const short = r.name
        .replace(/\(10[kK]\)/gi, "")
        .replace(/10[kK]/gi, "")
        .replace(/Internacional/gi, "Intl.")
        .replace(/^(VIII|IX|X{0,3})(I{0,3})\s*/i, "")
        .trim()
        .split(" ")
        .slice(0, 3)
        .join(" ");
      return `${short} '${String(yr).slice(2)}`;
    }
  );

  return [
    {
      title: "5K — Elche Night Race",
      subtitle: `${pts5k.length} ediciones`,
      color: "#60a5fa",
      fill: "rgba(96,165,250,0.08)",
      points: pts5k,
      invertY: true,
      improvement: improvementPct(pts5k),
    },
    {
      title: "6K — Carrera al Amanecer",
      subtitle: `${pts6k.length} ediciones`,
      color: "#34d399",
      fill: "rgba(52,211,153,0.08)",
      points: pts6k,
      invertY: true,
      improvement: improvementPct(pts6k),
    },
    {
      title: "10K — Todas las carreras",
      subtitle: `${pts10k.length} carreras`,
      color: "#a78bfa",
      fill: "rgba(167,139,250,0.08)",
      points: pts10k,
      invertY: true,
      improvement: improvementPct(pts10k),
    },
  ];
};

// ─── Sub-componente de un gráfico ────────────────────────────────────────────

function RaceChart({ cfg, darkMode }: { cfg: SeriesConfig; darkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || cfg.points.length === 0) return;

    // Destruir instancia previa
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const textColor = darkMode ? "#94a3b8" : "#64748b";
    const gridColor = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const pointBg = darkMode ? "#1e293b" : "#ffffff";

    const times = cfg.points.map((p) => p.timeSec);
    const minT = Math.min(...times);
    const maxT = Math.max(...times);
    const pad = Math.max((maxT - minT) * 0.35, 45);

    // Plugin para pintar el ritmo encima de cada punto
    const pacePlugin = {
      id: "paceLabels",
      afterDatasetsDraw(chart: Chart) {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        cfg.points.forEach((pt, i) => {
          const el = meta.data[i] as PointElement;
          if (!el) return;
          ctx.save();
          ctx.font = `500 10px "Instrument Sans", sans-serif`;
          ctx.fillStyle = cfg.color;
          ctx.textAlign = "center";
          // En eje normal: etiqueta arriba del punto; en invertido: arriba también (y menor = arriba)
          const offset = cfg.invertY ? 14 : -14;
          ctx.fillText(pt.pace, el.x, el.y - offset);
          ctx.restore();
        });
      },
    };

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: cfg.points.map((p) => p.label),
        datasets: [
          {
            data: times,
            borderColor: cfg.color,
            backgroundColor: cfg.fill,
            pointBackgroundColor: pointBg,
            pointBorderColor: cfg.color,
            pointBorderWidth: 2.5,
            pointRadius: 6,
            pointHoverRadius: 9,
            borderWidth: 2,
            fill: true,
            tension: 0.38,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: darkMode ? "#1e293b" : "#ffffff",
            borderColor: darkMode
              ? "rgba(255,255,255,0.12)"
              : "rgba(0,0,0,0.10)",
            borderWidth: 1,
            titleColor: darkMode ? "#f1f5f9" : "#1e293b",
            bodyColor: darkMode ? "#94a3b8" : "#475569",
            padding: 10,
            callbacks: {
              title: (ctx) => cfg.points[ctx[0].dataIndex].raceName,
              label: (ctx) => {
                const i = ctx.dataIndex;
                return [
                  `  Tiempo: ${fmtTime(cfg.points[i].timeSec)}`,
                  `  Ritmo:  ${cfg.points[i].pace}`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColor,
              font: { size: 11 },
              autoSkip: false,
              maxRotation: cfg.points.length > 4 ? 20 : 0,
            },
            grid: { color: gridColor },
            border: { display: false },
          },
          y: {
            // Eje invertido → max arriba (tiempo más lento = arriba), min abajo
            // Visualmente la línea sube conforme mejoras
            reverse: cfg.invertY,
            min: minT - pad,
            max: maxT + pad,
            ticks: {
              color: textColor,
              font: { size: 10 },
              callback: (v) => fmtTime(Math.round(v as number)),
            },
            grid: { color: gridColor },
            border: { display: false },
          },
        },
        animation: { duration: 700, easing: "easeInOutQuart" },
      },
      plugins: [pacePlugin],
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [cfg, darkMode]);

  const imp = cfg.improvement ? parseFloat(cfg.improvement) : null;

  return (
    <div className="prog-chart-card">
      <div className="prog-chart-header">
        <div>
          <p className="prog-chart-title">{cfg.title}</p>
          <p className="prog-chart-sub">
            {imp !== null ? (
              <>
                <span className="prog-imp-arrow">↓</span>
                {Math.abs(imp)}% mejora de tiempo
              </>
            ) : (
              cfg.subtitle
            )}
          </p>
        </div>
      </div>
      <div className="prog-chart-wrap">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Gráfico de progresión de ${cfg.title}`}
        />
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

interface Props {
  darkMode: boolean;
}

export default function RaceProgressionCharts({ darkMode }: Props) {
  const series = buildSeries();

  return (
    <div className="prog-section">
      <div className="table-header">
        <h2>Race Progression</h2>
      </div>
      <div className="prog-grid">
        {series.map((cfg) => (
          <RaceChart key={cfg.title} cfg={cfg} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
}
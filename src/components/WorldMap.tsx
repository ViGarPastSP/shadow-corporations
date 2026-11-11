"use client";

import { useState } from "react";

// Simplified interactive world map using SVG paths for major countries
// Paths are approximate but recognizable shapes for gameplay

const COUNTRY_PATHS: { id: string; name: string; d: string; color: string }[] = [
  {
    id: "es",
    name: "España",
    color: "#dc2626",
    d: "M420 195 l12 -2 8 6 2 10 -6 8 -14 2 -10 -6 -4 -8 z",
  },
  {
    id: "fr",
    name: "Francia",
    color: "#2563eb",
    d: "M430 165 l18 -4 10 8 2 14 -8 10 -16 4 -12 -6 -4 -12 z",
  },
  {
    id: "de",
    name: "Alemania",
    color: "#ca8a04",
    d: "M455 145 l16 0 8 10 0 14 -10 8 -14 0 -8 -10 0 -12 z",
  },
  {
    id: "it",
    name: "Italia",
    color: "#16a34a",
    d: "M460 185 l8 2 4 18 -2 12 -8 4 -6 -8 0 -16 z",
  },
  {
    id: "gb",
    name: "Reino Unido",
    color: "#7c3aed",
    d: "M420 130 l10 -2 6 8 -2 12 -8 4 -8 -4 0 -12 z",
  },
  {
    id: "pl",
    name: "Polonia",
    color: "#db2777",
    d: "M480 140 l14 0 6 10 -2 12 -12 4 -10 -6 0 -12 z",
  },
  {
    id: "ua",
    name: "Ucrania",
    color: "#0891b2",
    d: "M500 155 l22 0 8 10 -4 12 -18 4 -14 -6 0 -12 z",
  },
  {
    id: "ru",
    name: "Rusia",
    color: "#b91c1c",
    d: "M520 80 l120 0 40 20 20 40 -10 30 -60 10 -80 -10 -40 -20 -20 -30 z",
  },
  {
    id: "tr",
    name: "Turquía",
    color: "#b91c1c",
    d: "M510 195 l24 0 8 10 -6 8 -20 2 -10 -8 0 -10 z",
  },
  {
    id: "eg",
    name: "Egipto",
    color: "#ca8a04",
    d: "M505 230 l14 0 6 16 -4 12 -12 2 -8 -10 0 -14 z",
  },
  {
    id: "sa",
    name: "Arabia Saudí",
    color: "#15803d",
    d: "M530 230 l20 4 10 18 -8 14 -18 0 -12 -12 0 -16 z",
  },
  {
    id: "in",
    name: "India",
    color: "#ea580c",
    d: "M600 220 l18 4 8 20 -6 24 -14 8 -12 -12 0 -28 z",
  },
  {
    id: "cn",
    name: "China",
    color: "#dc2626",
    d: "M640 160 l50 0 30 20 10 30 -20 25 -40 10 -35 -15 -15 -30 z",
  },
  {
    id: "jp",
    name: "Japón",
    color: "#e11d48",
    d: "M720 175 l12 4 4 16 -6 10 -10 0 -6 -12 0 -14 z",
  },
  {
    id: "kr",
    name: "Corea del Sur",
    color: "#2563eb",
    d: "M705 185 l8 2 2 10 -4 6 -8 0 -2 -8 z",
  },
  {
    id: "us",
    name: "Estados Unidos",
    color: "#1d4ed8",
    d: "M120 150 l90 0 20 15 5 30 -25 25 -70 10 -40 -15 -15 -30 z",
  },
  {
    id: "ca",
    name: "Canadá",
    color: "#dc2626",
    d: "M100 60 l120 0 40 20 10 40 -30 20 -100 5 -50 -15 -20 -30 z",
  },
  {
    id: "mx",
    name: "México",
    color: "#15803d",
    d: "M130 220 l40 5 15 20 -10 15 -30 5 -20 -15 0 -20 z",
  },
  {
    id: "br",
    name: "Brasil",
    color: "#16a34a",
    d: "M220 280 l40 5 25 30 5 40 -20 25 -35 5 -25 -20 -10 -40 z",
  },
  {
    id: "ar",
    name: "Argentina",
    color: "#2563eb",
    d: "M230 360 l20 0 10 25 0 30 -12 15 -16 0 -10 -20 0 -35 z",
  },
  {
    id: "co",
    name: "Colombia",
    color: "#ca8a04",
    d: "M190 260 l18 0 8 14 -6 10 -14 2 -10 -8 0 -12 z",
  },
  {
    id: "ng",
    name: "Nigeria",
    color: "#15803d",
    d: "M450 270 l14 0 6 12 -4 10 -12 2 -8 -8 0 -12 z",
  },
  {
    id: "za",
    name: "Sudáfrica",
    color: "#16a34a",
    d: "M480 360 l18 0 8 12 -6 10 -16 2 -10 -8 0 -12 z",
  },
  {
    id: "ma",
    name: "Marruecos",
    color: "#b91c1c",
    d: "M400 220 l12 0 4 12 -6 8 -10 0 -4 -10 z",
  },
  {
    id: "au",
    name: "Australia",
    color: "#0891b2",
    d: "M700 340 l45 5 20 20 0 25 -25 15 -40 0 -20 -20 0 -30 z",
  },
];

interface WorldMapProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  battleCountryIds?: string[];
}

export default function WorldMap({ selectedId, onSelect, battleCountryIds = [] }: WorldMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#060a12]">
      <svg
        viewBox="0 0 800 450"
        className="w-full h-full max-h-full"
        style={{ touchAction: "manipulation" }}
      >
        {/* Ocean */}
        <rect width="800" height="450" fill="#060a12" />

        {/* Grid subtle */}
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 50}
            y1={0}
            x2={i * 50}
            y2={450}
            stroke="#ffffff"
            strokeOpacity="0.03"
          />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={i * 50}
            x2={800}
            y2={i * 50}
            stroke="#ffffff"
            strokeOpacity="0.03"
          />
        ))}

        {/* Continents base blobs (very soft) */}
        <ellipse cx="450" cy="160" rx="180" ry="90" fill="#0f172a" opacity="0.5" />
        <ellipse cx="650" cy="200" rx="120" ry="80" fill="#0f172a" opacity="0.45" />
        <ellipse cx="160" cy="160" rx="110" ry="80" fill="#0f172a" opacity="0.45" />
        <ellipse cx="230" cy="320" rx="80" ry="100" fill="#0f172a" opacity="0.4" />
        <ellipse cx="480" cy="300" rx="90" ry="70" fill="#0f172a" opacity="0.35" />
        <ellipse cx="720" cy="360" rx="50" ry="35" fill="#0f172a" opacity="0.4" />

        {COUNTRY_PATHS.map((c) => {
          const isSelected = selectedId === c.id;
          const isHovered = hovered === c.id;
          const hasBattle = battleCountryIds.includes(c.id);
          return (
            <g key={c.id}>
              <path
                d={c.d}
                fill={isSelected ? c.color : isHovered ? c.color + "cc" : c.color + "99"}
                stroke={isSelected ? "#fff" : hasBattle ? "#ef4444" : "#000"}
                strokeWidth={isSelected ? 2 : hasBattle ? 1.5 : 0.5}
                className="cursor-pointer transition-all duration-150"
                style={{
                  filter: isSelected || isHovered ? `drop-shadow(0 0 6px ${c.color})` : undefined,
                  transform: isHovered || isSelected ? "scale(1.02)" : undefined,
                  transformOrigin: "center",
                }}
                onClick={() => onSelect(c.id)}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
              />
              {hasBattle && (
                <circle
                  cx={parseFloat(c.d.split(" ")[0].replace("M", "")) + 10}
                  cy={parseFloat(c.d.split(" ")[1]) - 4}
                  r={3}
                  fill="#ef4444"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })}

        {/* Label for hovered/selected */}
        {(hovered || selectedId) && (() => {
          const c = COUNTRY_PATHS.find((x) => x.id === (hovered || selectedId));
          if (!c) return null;
          const parts = c.d.replace("M", "").split(/[\s,l]+/);
          const x = parseFloat(parts[0]) || 400;
          const y = parseFloat(parts[1]) || 200;
          return (
            <g>
              <rect x={x - 10} y={y - 28} width={c.name.length * 6.5 + 12} height={16} rx={3} fill="#000" opacity="0.85" />
              <text x={x - 4} y={y - 16} fill="#fff" fontSize="10" fontFamily="Inter, sans-serif">
                {c.name}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
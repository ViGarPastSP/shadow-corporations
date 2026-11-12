"use client";

import { useState } from "react";
import Link from "next/link";
import GameShell from "@/components/GameShell";
import WorldMap from "@/components/WorldMap";
import { COUNTRIES, REGIONS, getRegionsByCountry } from "@/data/countries";
import { MOCK_BATTLES } from "@/data/battles";
import { colorForId } from "@/data/mapCountries";

export default function MapPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>("es");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const selected = selectedCountry ? COUNTRIES.find((c) => c.id === selectedCountry) : null;
  const regions = selectedCountry ? getRegionsByCountry(selectedCountry) : [];
  // For countries not in COUNTRIES yet, still show synthetic region from selection
  const regionName =
    selectedRegion
      ? REGIONS.find((r) => r.id === selectedRegion)?.name || selectedRegion
      : null;

  const countryBattles = selectedCountry
    ? MOCK_BATTLES.filter((b) => b.location.startsWith(selectedCountry))
    : [];
  const battleIds = Array.from(
    new Set(
      MOCK_BATTLES.filter((b) => b.status === "active").map((b) => b.location.split("-")[0])
    )
  );

  function handleSelectCountry(id: string) {
    setSelectedCountry(id);
    setSelectedRegion(null);
  }

  function handleSelectRegion(id: string) {
    setSelectedRegion(id);
  }

  const displayName = selected?.name || (selectedCountry ? selectedCountry.toUpperCase() : null);
  const displayColor = selected?.color || (selectedCountry ? colorForId(selectedCountry) : "#666");

  const bottom = (
    <div className="h-full flex items-stretch gap-2 px-2 py-1.5 overflow-x-auto scroll-hidden">
      {selectedCountry ? (
        <>
          <div className="flex items-center gap-2 px-3 rounded-lg bg-[var(--panel2)] border border-[var(--border)] shrink-0 min-w-[140px]">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: displayColor }} />
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate">{displayName}</div>
              <div className="text-[10px] text-[var(--muted)]">
                {regions.length ? `${regions.length} regiones` : "País"}
                {regionName ? ` · ${regionName}` : ""}
              </div>
            </div>
          </div>

          {regions.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => handleSelectRegion(r.id)}
              className={`flex flex-col justify-center px-3 rounded-lg border shrink-0 min-w-[118px] text-left transition ${
                selectedRegion === r.id
                  ? "border-[var(--accent)] bg-[var(--accent)]/15"
                  : "border-[var(--border)] bg-[var(--panel)] hover:border-[var(--accent)]"
              }`}
            >
              <span className="text-[11px] font-medium truncate">{r.name}</span>
              <span className="text-[10px] text-[var(--muted)]">
                {selectedRegion === r.id ? "Seleccionada" : "Clic o mapa"}
              </span>
            </button>
          ))}

          {countryBattles.map((b) => (
            <Link
              key={b.id}
              href="/battles"
              className="flex flex-col justify-center px-3 rounded-lg bg-red-500/10 border border-red-500/40 shrink-0 min-w-[130px]"
            >
              <span className="text-[11px] font-medium text-red-300 truncate">{b.title}</span>
              <span className="text-[10px] text-[var(--muted)]">Batalla activa</span>
            </Link>
          ))}

          <div className="flex items-center gap-1.5 ml-auto shrink-0 pr-1">
            <button
              type="button"
              disabled={!selectedRegion && regions.length > 0}
              className="text-[11px] px-3 py-1.5 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium disabled:opacity-40"
            >
              Expandir {selectedRegion ? "región" : ""}
            </button>
            <Link href="/ops" className="text-[11px] px-3 py-1.5 rounded-md bg-[var(--panel2)] border border-[var(--border)]">
              Operar
            </Link>
          </div>
        </>
      ) : (
        <div className="flex items-center text-[11px] text-[var(--muted)] px-2">
          Haz clic en cualquier país · luego en una región
        </div>
      )}
    </div>
  );

  return (
    <GameShell bottom={bottom}>
      <WorldMap
        selectedId={selectedCountry}
        selectedRegionId={selectedRegion}
        onSelectCountry={handleSelectCountry}
        onSelectRegion={handleSelectRegion}
        battleCountryIds={battleIds}
      />
    </GameShell>
  );
}
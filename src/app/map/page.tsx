"use client";

import { useState } from "react";
import Link from "next/link";
import GameShell from "@/components/GameShell";
import WorldMap from "@/components/WorldMap";
import { COUNTRIES, getRegionsByCountry } from "@/data/countries";
import { MOCK_BATTLES } from "@/data/battles";

export default function MapPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>("es");

  const selected = selectedCountry ? COUNTRIES.find((c) => c.id === selectedCountry) : null;
  const regions = selectedCountry ? getRegionsByCountry(selectedCountry) : [];
  const countryBattles = selectedCountry
    ? MOCK_BATTLES.filter((b) => b.location.startsWith(selectedCountry))
    : [];
  const battleIds = Array.from(
    new Set(
      MOCK_BATTLES.filter((b) => b.status === "active").map((b) => b.location.split("-")[0])
    )
  );

  const bottom = (
    <div className="h-full flex items-stretch gap-2 px-2 py-1.5 overflow-x-auto scroll-hidden">
      {selected ? (
        <>
          <div className="flex items-center gap-2 px-3 rounded-lg bg-[var(--panel2)] border border-[var(--border)] shrink-0 min-w-[150px]">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: selected.color }} />
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate">{selected.name}</div>
              <div className="text-[10px] text-[var(--muted)]">{regions.length} regiones · 0% control</div>
            </div>
          </div>

          {regions.map((r) => (
            <button
              key={r.id}
              type="button"
              className="flex flex-col justify-center px-3 rounded-lg bg-[var(--panel)] border border-[var(--border)] hover:border-[var(--accent)] shrink-0 min-w-[118px] text-left transition"
            >
              <span className="text-[11px] font-medium truncate">{r.name}</span>
              <span className="text-[10px] text-[var(--muted)]">Sin control</span>
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
            <button type="button" className="text-[11px] px-3 py-1.5 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium">
              Expandir
            </button>
            <Link href="/ops" className="text-[11px] px-3 py-1.5 rounded-md bg-[var(--panel2)] border border-[var(--border)]">
              Operar
            </Link>
          </div>
        </>
      ) : (
        <div className="flex items-center text-[11px] text-[var(--muted)] px-2">
          Haz clic en un país jugable del mapa
        </div>
      )}
    </div>
  );

  return (
    <GameShell bottom={bottom}>
      <WorldMap selectedId={selectedCountry} onSelect={setSelectedCountry} battleCountryIds={battleIds} />
    </GameShell>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import WorldMap from "@/components/WorldMap";
import { COUNTRIES, getRegionsByCountry } from "@/data/countries";
import { MOCK_BATTLES } from "@/data/battles";

export default function MapPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const selected = selectedCountry ? COUNTRIES.find((c) => c.id === selectedCountry) : null;
  const regions = selectedCountry ? getRegionsByCountry(selectedCountry) : [];
  const countryBattles = selectedCountry
    ? MOCK_BATTLES.filter((b) => b.location.startsWith(selectedCountry))
    : [];
  const battleIds = [...new Set(MOCK_BATTLES.filter((b) => b.status === "active").map((b) => b.location.split("-")[0]))];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <header className="border-b border-border bg-surface shrink-0 z-20">
        <div className="px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/20 border border-primary/40 rounded flex items-center justify-center">
                <span className="text-primary font-bold text-xs">SC</span>
              </div>
              <span className="font-semibold text-sm tracking-tight">ShadowCorps</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1 text-xs">
              <Link href="/dashboard" className="px-2.5 py-1 rounded text-muted hover:text-white">Dashboard</Link>
              <Link href="/map" className="px-2.5 py-1 rounded bg-surface2 text-white">Mapa</Link>
              <Link href="/ops" className="px-2.5 py-1 rounded text-muted hover:text-white">Operaciones</Link>
              <Link href="/battles" className="px-2.5 py-1 rounded text-muted hover:text-white">Batallas</Link>
            </nav>
          </div>
          <div className="text-[11px] text-muted">
            {selected ? selected.name : "Selecciona un país"}
          </div>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        <WorldMap
          selectedId={selectedCountry}
          onSelect={setSelectedCountry}
          battleCountryIds={battleIds}
        />

        {/* Detail panel */}
        {selected && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-surface/95 backdrop-blur-md p-4 max-h-[38vh] overflow-auto scroll-hidden z-10">
            <div className="max-w-5xl mx-auto flex flex-wrap gap-5">
              <div className="w-44 shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selected.color }} />
                  <h2 className="font-semibold">{selected.name}</h2>
                </div>
                <div className="text-[11px] text-muted mb-2">{selected.continent} · {regions.length} regiones</div>
                <div className="flex flex-col gap-1">
                  <button className="text-[11px] bg-primary hover:bg-primaryHover text-white py-1.5 rounded-md">
                    Expandir influencia
                  </button>
                  <button className="text-[11px] bg-surface2 hover:bg-zinc-700 py-1.5 rounded-md">
                    Declarar guerra
                  </button>
                  <Link href="/ops" className="text-[11px] text-center text-primary hover:underline py-1">
                    Operar aquí (espía)
                  </Link>
                </div>
              </div>

              <div className="flex-1 min-w-[180px]">
                <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5">Regiones</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {regions.map((r) => (
                    <div key={r.id} className="bg-surface2 border border-border rounded px-2 py-1.5 text-[11px]">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-[10px] text-muted">Sin control</div>
                    </div>
                  ))}
                </div>
              </div>

              {countryBattles.length > 0 && (
                <div className="w-48 shrink-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5">Batallas</div>
                  <div className="space-y-1">
                    {countryBattles.map((b) => (
                      <Link
                        key={b.id}
                        href="/battles"
                        className="block bg-red-500/10 border border-red-500/30 rounded px-2 py-1.5 text-[11px] hover:bg-red-500/20"
                      >
                        <div className="text-red-300 font-medium">{b.title}</div>
                        <div className="text-muted text-[10px]">{b.attacker} vs {b.defender}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
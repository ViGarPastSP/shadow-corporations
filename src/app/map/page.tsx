"use client";

import { useState } from "react";
import Link from "next/link";
import { COUNTRIES, REGIONS, CONTINENTS, getRegionsByCountry } from "@/data/countries";
import { MOCK_BATTLES } from "@/data/battles";

export default function MapPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  const filteredCountries = selectedContinent
    ? COUNTRIES.filter((c) => c.continent === selectedContinent)
    : COUNTRIES;

  const selected = selectedCountry ? COUNTRIES.find((c) => c.id === selectedCountry) : null;
  const regions = selectedCountry ? getRegionsByCountry(selectedCountry) : [];
  const countryBattles = selectedCountry
    ? MOCK_BATTLES.filter((b) => b.location.startsWith(selectedCountry))
    : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-surface sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary/20 border border-primary/40 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-sm tracking-tighter">SC</span>
              </div>
              <span className="font-semibold tracking-tight">ShadowCorps</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1 text-sm">
              <Link href="/dashboard" className="px-3 py-1.5 rounded-md text-muted hover:text-white transition">Dashboard</Link>
              <Link href="/map" className="px-3 py-1.5 rounded-md bg-surface2 text-white">Mapa Mundial</Link>
              <Link href="/battles" className="px-3 py-1.5 rounded-md text-muted hover:text-white transition">Batallas</Link>
            </nav>
          </div>
          <div className="text-sm text-muted">{COUNTRIES.length} países · {REGIONS.length} regiones</div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-64 border-r border-border bg-surface overflow-y-auto shrink-0 hidden md:block">
          <div className="p-3 border-b border-border">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => { setSelectedContinent(null); setSelectedCountry(null); }}
                className={`text-[11px] px-2 py-1 rounded transition ${
                  !selectedContinent ? "bg-primary text-white" : "bg-surface2 text-muted hover:text-white"
                }`}
              >Todos</button>
              {CONTINENTS.map((c) => (
                <button
                  key={c}
                  onClick={() => { setSelectedContinent(c); setSelectedCountry(null); }}
                  className={`text-[11px] px-2 py-1 rounded transition ${
                    selectedContinent === c ? "bg-primary text-white" : "bg-surface2 text-muted hover:text-white"
                  }`}
                >{c.split(" ")[0]}</button>
              ))}
            </div>
          </div>
          <div className="p-1.5">
            {filteredCountries.map((country) => (
              <button
                key={country.id}
                onClick={() => setSelectedCountry(country.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition ${
                  selectedCountry === country.id ? "bg-surface2" : "hover:bg-surface2/50"
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: country.color }} />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{country.name}</div>
                  <div className="text-[10px] text-muted">{country.regions.length} regiones</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main content - World Map visual */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Real-feeling world map using geographic layout */}
          <div className="flex-1 relative bg-[#0a0f1a] overflow-auto">
            {/* Dark ocean background with grid */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: "40px 40px"
            }} />

            <div className="relative p-6 min-h-full">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Mapa Mundial</h1>
                  <p className="text-muted text-xs mt-0.5">Haz clic en un país para ver regiones y batallas activas</p>
                </div>
                <Link href="/battles" className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-md hover:bg-primary/30 transition">
                  Ver todas las batallas →
                </Link>
              </div>

              {/* Geographic-ish layout by continent */}
              <div className="space-y-8">
                {CONTINENTS.map((continent) => {
                  const countries = COUNTRIES.filter((c) => c.continent === continent);
                  if (selectedContinent && selectedContinent !== continent) return null;
                  return (
                    <div key={continent}>
                      <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">{continent}</h2>
                      <div className="flex flex-wrap gap-2">
                        {countries.map((country) => {
                          const hasBattle = MOCK_BATTLES.some((b) => b.location.startsWith(country.id) && b.status === "active");
                          const isSelected = selectedCountry === country.id;
                          return (
                            <button
                              key={country.id}
                              onClick={() => setSelectedCountry(country.id)}
                              className={`relative group px-4 py-3 rounded-lg border-2 text-left transition min-w-[120px] ${
                                isSelected
                                  ? "border-primary bg-primary/15 scale-105 shadow-lg shadow-primary/20"
                                  : "border-transparent bg-surface/80 hover:border-zinc-600 hover:bg-surface"
                              }`}
                              style={{
                                boxShadow: isSelected ? undefined : `inset 0 0 0 1px ${country.color}33`,
                              }}
                            >
                              {hasBattle && (
                                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-background" />
                              )}
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: country.color }} />
                                <span className="text-sm font-medium">{country.name}</span>
                              </div>
                              <div className="text-[10px] text-muted mt-1">{country.regions.length} regiones</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom detail panel */}
          {selected && (
            <div className="border-t border-border bg-surface p-4 max-h-[40vh] overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap items-start gap-6">
                  <div className="w-48 shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: selected.color }} />
                      <h2 className="font-semibold text-lg">{selected.name}</h2>
                    </div>
                    <div className="text-xs text-muted space-y-0.5 mb-3">
                      <div>{selected.continent}</div>
                      <div>{regions.length} regiones · Código {selected.code}</div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <button className="w-full bg-primary hover:bg-primaryHover text-white text-xs font-medium py-2 rounded-md transition">
                        Expandir influencia
                      </button>
                      <button className="w-full bg-surface2 hover:bg-zinc-700 text-xs py-2 rounded-md transition">
                        Declarar guerra
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-xs font-medium text-muted mb-2 uppercase tracking-wider">Regiones</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {regions.map((region) => (
                        <div key={region.id} className="bg-surface2 border border-border rounded-md px-2.5 py-2 hover:border-zinc-500 cursor-pointer transition">
                          <div className="text-xs font-medium">{region.name}</div>
                          <div className="text-[10px] text-muted">Sin control</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {countryBattles.length > 0 && (
                    <div className="w-56 shrink-0">
                      <h3 className="text-xs font-medium text-muted mb-2 uppercase tracking-wider">Batallas aquí</h3>
                      <div className="space-y-1.5">
                        {countryBattles.map((b) => (
                          <Link key={b.id} href="/battles" className="block bg-red-500/10 border border-red-500/30 rounded-md px-2.5 py-2 hover:bg-red-500/20 transition">
                            <div className="text-xs font-medium text-red-300">{b.title}</div>
                            <div className="text-[10px] text-muted">{b.attacker} vs {b.defender}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
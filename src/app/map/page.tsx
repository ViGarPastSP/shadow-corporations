"use client";

import { useState } from "react";
import Link from "next/link";
import { COUNTRIES, REGIONS, CONTINENTS, getRegionsByCountry } from "@/data/countries";

export default function MapPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  const filteredCountries = selectedContinent
    ? COUNTRIES.filter((c) => c.continent === selectedContinent)
    : COUNTRIES;

  const selected = selectedCountry ? COUNTRIES.find((c) => c.id === selectedCountry) : null;
  const regions = selectedCountry ? getRegionsByCountry(selectedCountry) : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
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
              <Link href="/dashboard" className="px-3 py-1.5 rounded-md text-muted hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/map" className="px-3 py-1.5 rounded-md bg-surface2 text-white">
                Mapa Mundial
              </Link>
              <Link href="#" className="px-3 py-1.5 rounded-md text-muted hover:text-white transition">
                Corporación
              </Link>
              <Link href="#" className="px-3 py-1.5 rounded-md text-muted hover:text-white transition">
                Rankings
              </Link>
            </nav>
          </div>
          <div className="text-sm text-muted">
            {COUNTRIES.length} países · {REGIONS.length} regiones
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Continents & Countries */}
        <aside className="w-72 border-r border-border bg-surface overflow-y-auto shrink-0">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-sm mb-3">Continentes</h2>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedContinent(null)}
                className={`text-xs px-2.5 py-1 rounded-md transition ${
                  !selectedContinent
                    ? "bg-primary text-white"
                    : "bg-surface2 text-muted hover:text-white"
                }`}
              >
                Todos
              </button>
              {CONTINENTS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedContinent(c);
                    setSelectedCountry(null);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-md transition ${
                    selectedContinent === c
                      ? "bg-primary text-white"
                      : "bg-surface2 text-muted hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="p-2">
            {filteredCountries.map((country) => (
              <button
                key={country.id}
                onClick={() => setSelectedCountry(country.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${
                  selectedCountry === country.id
                    ? "bg-surface2 border border-border"
                    : "hover:bg-surface2/50"
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: country.color }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{country.name}</div>
                  <div className="text-xs text-muted">{country.regions.length} regiones</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main map area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Map placeholder - visual grid of countries */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight">Mapa Mundial</h1>
              <p className="text-muted text-sm mt-1">
                Controla regiones, influye en gobiernos y expande tu corporación por el planeta.
              </p>
            </div>

            {/* Visual country grid (simulates map feel) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredCountries.map((country) => {
                const isSelected = selectedCountry === country.id;
                return (
                  <button
                    key={country.id}
                    onClick={() => setSelectedCountry(country.id)}
                    className={`relative aspect-[4/3] rounded-xl border-2 p-4 text-left transition overflow-hidden group ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-surface hover:border-zinc-500"
                    }`}
                  >
                    <div
                      className="absolute inset-0 opacity-20 group-hover:opacity-30 transition"
                      style={{ backgroundColor: country.color }}
                    />
                    <div className="relative z-10">
                      <div className="text-xs text-muted mb-1">{country.continent}</div>
                      <div className="font-semibold text-sm">{country.name}</div>
                      <div className="text-xs text-muted mt-2">
                        {country.regions.length} regiones
                      </div>
                    </div>
                    {/* Control indicator placeholder */}
                    <div className="absolute bottom-2 right-2 text-[10px] text-muted bg-background/60 px-1.5 py-0.5 rounded">
                      0% control
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom panel - selected country details */}
          {selected && (
            <div className="border-t border-border bg-surface p-5">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
                <div className="md:w-64 shrink-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selected.color }}
                    />
                    <h2 className="font-semibold text-lg">{selected.name}</h2>
                  </div>
                  <div className="text-sm text-muted space-y-1">
                    <div>Continente: {selected.continent}</div>
                    <div>Código: {selected.code}</div>
                    <div>{regions.length} regiones</div>
                  </div>
                  <button className="mt-4 w-full bg-primary hover:bg-primaryHover text-white text-sm font-medium py-2 rounded-lg transition">
                    Expandir influencia
                  </button>
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-medium text-muted mb-3">Regiones</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {regions.map((region) => (
                      <div
                        key={region.id}
                        className="bg-surface2 border border-border rounded-lg px-3 py-2.5 hover:border-zinc-500 transition cursor-pointer"
                      >
                        <div className="text-sm font-medium">{region.name}</div>
                        <div className="text-xs text-muted mt-0.5">Sin control</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
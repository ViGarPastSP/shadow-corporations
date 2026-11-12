"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  Swords,
  VenetianMask,
  Crosshair,
  Landmark,
  ChevronLeft,
  ChevronRight,
  Globe,
  Layers,
  Route,
  X,
} from "lucide-react";
import GameShell from "@/components/GameShell";
import WorldMap, { type BattleMark, type MapLayers } from "@/components/WorldMap";
import { MockTag, SoonTag, StatBar, WorldTicker } from "@/components/ui";
import { loadAdmin1, loadWorld, normalize, type GeoCollection } from "@/lib/geo";
import { MOCK_BATTLES, BATTLE_TYPE_COLORS, BATTLE_TYPE_LABELS } from "@/data/battles";
import { localStats, ownerOf } from "@/data/simworld";

export default function MapPage() {
  const [world, setWorld] = useState<GeoCollection | null>(null);
  const [regionData, setRegionData] = useState<GeoCollection | null>(null);
  const [regionsLoading, setRegionsLoading] = useState(false);
  const [country, setCountry] = useState<string | null>("es");
  const [region, setRegion] = useState<string | null>(null);
  const [layers, setLayers] = useState<MapLayers>({ control: true, battles: true, routes: true });
  const [panelOpen, setPanelOpen] = useState(true);
  const [q, setQ] = useState("");
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let on = true;
    loadWorld().then((w) => {
      if (on) setWorld(w);
    });
    return () => {
      on = false;
    };
  }, []);

  useEffect(() => {
    setRegionData(null);
    if (!country) {
      setRegionsLoading(false);
      return;
    }
    let on = true;
    setRegionsLoading(true);
    loadAdmin1(country).then((d) => {
      if (!on) return;
      setRegionData(d);
      setRegionsLoading(false);
    });
    return () => {
      on = false;
    };
  }, [country]);

  const selectCountry = useCallback((id: string) => {
    setCountry(id);
    setRegion(null);
  }, []);
  const selectRegion = useCallback((id: string) => setRegion(id), []);
  const back = useCallback(() => {
    if (region) setRegion(null);
    else setCountry(null);
  }, [region]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [back]);

  const battleMarks = useMemo<BattleMark[]>(
    () =>
      MOCK_BATTLES.filter((b) => b.status === "active").map((b) => ({
        id: b.id,
        country: b.location.split("-")[0],
        region: b.location.includes("-") ? b.location : undefined,
        title: b.title,
        color: BATTLE_TYPE_COLORS[b.type],
      })),
    []
  );

  const countryProps = country ? world?.features.find((f) => f.properties.id === country)?.properties : undefined;
  const regions = useMemo(
    () =>
      (regionData?.features ?? [])
        .map((f) => f.properties)
        .sort((a, b) => a.name.localeCompare(b.name, "es")),
    [regionData]
  );
  const regionProps = region ? regions.find((r) => r.id === region) : undefined;

  const countryOwner = country ? ownerOf(country) : null;
  const countryStats = country ? localStats(country) : null;
  const regionOwner = region ? ownerOf(region) : null;
  const regionStats = region ? localStats(region) : null;
  const countryBattles = country ? MOCK_BATTLES.filter((b) => b.location.split("-")[0] === country) : [];

  const results = useMemo(() => {
    const n = normalize(q.trim());
    if (!n || !world) return [];
    return world.features
      .filter((f) => normalize(f.properties.name).includes(n))
      .slice(0, 7)
      .map((f) => f.properties);
  }, [q, world]);

  // Centra la tarjeta de región seleccionada en la tira inferior
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !region) return;
    const el = strip.querySelector<HTMLElement>(`[data-rid="${region}"]`);
    if (el) {
      strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
    }
  }, [region]);

  const toggle = (key: keyof MapLayers) => setLayers((l) => ({ ...l, [key]: !l[key] }));

  const bottom = country ? (
    <div className="h-full flex items-stretch gap-2 px-2 py-2">
      <div className="hud shrink-0 flex items-center gap-3 pl-3 pr-2 min-w-[190px]">
        <i className="w-1.5 self-stretch my-2 rounded block" style={{ background: countryOwner?.color ?? "#3a4050" }} />
        <div className="min-w-0">
          <div className="font-display text-[19px] leading-none tracking-wide truncate max-w-[150px]">
            {countryProps?.name ?? country.toUpperCase()}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-1">
            {regionsLoading ? "Cargando…" : regions.length ? `${regions.length} regiones` : "Sin subdivisiones"}
          </div>
        </div>
        <button type="button" className="btn !h-8 !px-2" onClick={() => setCountry(null)} title="Volver al mundo (Esc)">
          <Globe size={14} />
        </button>
      </div>

      <div
        ref={stripRef}
        className="relative flex-1 flex items-stretch gap-2 overflow-x-auto scroll-hidden"
        onWheel={(e) => {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) e.currentTarget.scrollLeft += e.deltaY;
        }}
      >
        {regionsLoading && (
          <div className="flex items-center text-[12px] text-[var(--muted)] px-3">Cargando subdivisiones…</div>
        )}
        {!regionsLoading && regions.length === 0 && (
          <div className="flex items-center gap-2 text-[12px] text-[var(--muted)] px-3">
            Este país aún no tiene subdivisiones cargadas.
            <span className="tag tag-soon">TODO datos admin-1</span>
          </div>
        )}
        {regions.map((r) => {
          const o = ownerOf(r.id);
          const st = localStats(r.id);
          const active = r.id === region;
          const war = MOCK_BATTLES.some((b) => b.location === r.id && b.status === "active");
          return (
            <button
              key={r.id}
              type="button"
              data-rid={r.id}
              onClick={() => selectRegion(r.id)}
              className={`relative shrink-0 w-[158px] text-left rounded-lg border px-3 py-2 transition ${
                active
                  ? "border-white/70 bg-white/[0.07] shadow-[0_0_0_1px_rgba(255,255,255,.2)]"
                  : "border-[var(--border)] bg-[var(--panel)] hover:border-[var(--border-hi)] hover:bg-[var(--panel2)]"
              }`}
            >
              <i className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r" style={{ background: o?.color ?? "#3a4050" }} />
              <div className="flex items-center gap-1.5">
                <span className="font-display text-[15px] tracking-wide leading-none truncate">{r.name}</span>
                {war && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-hi)] animate-pulse shrink-0" />}
              </div>
              <div className="text-[10px] mt-1 truncate" style={{ color: o?.color ?? "var(--dim)" }}>
                {o ? o.name : "Sin control"}
              </div>
              <div className="sbar mt-2">
                <i style={{ width: `${st.control}%`, background: o?.color ?? "#3a4050" }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  ) : (
    <WorldTicker />
  );

  return (
    <GameShell bottom={bottom}>
      <WorldMap
        world={world}
        regionData={regionData}
        selectedId={country}
        selectedRegionId={region}
        onSelectCountry={selectCountry}
        onSelectRegion={selectRegion}
        onBackground={() => {
          setRegion(null);
          setCountry(null);
        }}
        battles={battleMarks}
        layers={layers}
      />

      {/* Expediente (izquierda) */}
      <div className="absolute top-3 left-3 z-30 w-[292px] max-w-[calc(100%-24px)]">
        {!panelOpen ? (
          <button type="button" className="hud w-9 h-9 flex items-center justify-center" onClick={() => setPanelOpen(true)} aria-label="Abrir expediente">
            <ChevronRight size={16} />
          </button>
        ) : (
          <div className="hud overflow-hidden max-h-[calc(100dvh-52px-80px-24px)] flex flex-col">
            <div className="flex items-center justify-between px-3 pt-2.5">
              <span className="hud-head">Expediente · {region ? "Región" : "País"}</span>
              <button type="button" onClick={() => setPanelOpen(false)} className="text-[var(--muted)] hover:text-white" aria-label="Cerrar expediente">
                <ChevronLeft size={16} />
              </button>
            </div>

            <div className="overflow-y-auto scroll-hidden px-3 pb-3 pt-1">
              {!country ? (
                <div className="py-4">
                  <div className="font-display text-[24px] tracking-wide leading-none">Mapa mundial</div>
                  <p className="text-[12px] text-[var(--muted)] mt-2 leading-relaxed">
                    Selecciona un país para abrir su expediente y ver sus regiones. Rueda para acercar, arrastra para moverte.
                  </p>
                </div>
              ) : (
                <>
                  <div className="font-display text-[28px] tracking-wide leading-[1.05] mt-1">
                    {regionProps?.name ?? countryProps?.name ?? country.toUpperCase()}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    {region && <span className="tag">{countryProps?.name}</span>}
                    {countryProps?.cont && <span className="tag">{countryProps.cont}</span>}
                    {regions.length > 0 && !region && <span className="tag">{regions.length} regiones</span>}
                    <MockTag />
                  </div>

                  <div className="mt-3 flex items-center gap-2 rounded-md border border-[var(--border)] bg-black/25 px-2.5 py-2">
                    <i className="w-2.5 h-6 rounded-sm block" style={{ background: (region ? regionOwner : countryOwner)?.color ?? "#3a4050" }} />
                    <div className="min-w-0">
                      <div className="text-[9px] uppercase tracking-[0.14em] text-[var(--dim)]">Controla</div>
                      <div className="text-[13px] font-semibold truncate">
                        {(region ? regionOwner : countryOwner)?.name ?? "Territorio sin dueño"}
                      </div>
                    </div>
                  </div>

                  {(region ? regionStats : countryStats) && (
                    <div className="mt-3 space-y-2.5">
                      <StatBar label="Control" value={(region ? regionStats : countryStats)!.control} tone="gold" />
                      <StatBar label="Estabilidad" value={(region ? regionStats : countryStats)!.stability} tone="good" />
                      <StatBar label="Corrupción" value={(region ? regionStats : countryStats)!.corruption} tone="neutral" />
                      <StatBar label="Vigilancia" value={(region ? regionStats : countryStats)!.surveillance} tone="bad" />
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Ingresos / día</span>
                        <span className="font-mono text-[13px] text-[var(--gold)]">
                          ${(region ? regionStats : countryStats)!.income}k
                        </span>
                      </div>
                    </div>
                  )}

                  {region && (
                    <div className="mt-4 grid grid-cols-1 gap-1.5">
                      <Link href="/ops" className="btn btn-primary">
                        <VenetianMask size={14} /> Infiltrar con identidad
                      </Link>
                      <button type="button" className="btn" disabled>
                        <Landmark size={14} /> Expandir influencia <SoonTag />
                      </button>
                      <button type="button" className="btn btn-danger" disabled>
                        <Crosshair size={14} /> Declarar ataque <SoonTag />
                      </button>
                    </div>
                  )}

                  {countryBattles.length > 0 && (
                    <div className="mt-4">
                      <div className="hud-head mb-1.5">Conflictos en {countryProps?.name}</div>
                      <div className="space-y-1.5">
                        {countryBattles.map((b) => {
                          const total = b.attackerPower + b.defenderPower || 1;
                          const pct = Math.round((b.attackerPower / total) * 100);
                          const c = BATTLE_TYPE_COLORS[b.type];
                          return (
                            <Link
                              key={b.id}
                              href="/battles"
                              className="block rounded-md border border-[var(--border)] bg-black/25 px-2.5 py-2 hover:border-[var(--border-hi)]"
                            >
                              <div className="flex items-center gap-1.5">
                                <Swords size={12} color={c} />
                                <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: c }}>
                                  {BATTLE_TYPE_LABELS[b.type]}
                                </span>
                                {b.status === "pending" && <span className="tag ml-auto">Pendiente</span>}
                              </div>
                              <div className="text-[12px] font-medium mt-0.5 truncate">{b.title}</div>
                              <div className="flex h-1 mt-1.5 rounded overflow-hidden bg-[#1a1e28]">
                                <i style={{ width: `${pct}%`, background: c }} />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Buscador + capas (derecha) */}
      <div className="absolute top-3 right-3 z-30 flex flex-col items-end gap-2">
        <div className="relative w-[240px] max-w-[60vw]">
          <div className="hud flex items-center gap-2 px-2.5 h-9">
            <Search size={14} className="text-[var(--muted)] shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar país…"
              className="bg-transparent outline-none text-[13px] w-full placeholder:text-[var(--dim)]"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label="Limpiar">
                <X size={13} className="text-[var(--muted)]" />
              </button>
            )}
          </div>
          {results.length > 0 && (
            <div className="hud absolute left-0 right-0 top-10 overflow-hidden">
              {results.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="w-full text-left px-3 py-2 text-[13px] hover:bg-white/10 flex items-center justify-between"
                  onClick={() => {
                    selectCountry(r.id);
                    setQ("");
                  }}
                >
                  <span>{r.name}</span>
                  <span className="text-[10px] text-[var(--dim)] uppercase">{r.cont}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hud flex items-center p-1 gap-1">
          {(
            [
              { k: "control", label: "Control", icon: Layers },
              { k: "battles", label: "Batallas", icon: Swords },
              { k: "routes", label: "Rutas", icon: Route },
            ] as const
          ).map((l) => {
            const Icon = l.icon;
            const on = layers[l.k];
            return (
              <button
                key={l.k}
                type="button"
                onClick={() => toggle(l.k)}
                className={`flex items-center gap-1.5 h-7 px-2 rounded text-[10px] font-semibold uppercase tracking-wider transition ${
                  on ? "bg-[var(--accent)]/20 text-white border border-[var(--accent)]/60" : "text-[var(--muted)] border border-transparent hover:text-white"
                }`}
                title={`Capa: ${l.label}`}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{l.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}

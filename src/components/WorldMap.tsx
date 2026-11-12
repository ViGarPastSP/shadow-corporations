"use client";

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import { Plus, Minus, LocateFixed } from "lucide-react";
import type { GeoCollection, GeoFeature } from "@/lib/geo";
import { FACTIONS, ROUTES, ownerOf } from "@/data/simworld";
import { MockTag } from "@/components/ui";

export interface BattleMark {
  id: string;
  country: string;
  region?: string;
  title: string;
  color: string;
}

export interface MapLayers {
  control: boolean;
  battles: boolean;
  routes: boolean;
}

interface Props {
  world: GeoCollection | null;
  regionData: GeoCollection | null;
  selectedId: string | null;
  selectedRegionId: string | null;
  onSelectCountry: (id: string) => void;
  onSelectRegion: (id: string) => void;
  onBackground: () => void;
  battles: BattleMark[];
  layers: MapLayers;
}

type PathGen = ReturnType<typeof geoPath>;
interface View {
  k: number;
  x: number;
  y: number;
}
interface PathItem {
  id: string;
  name: string;
  d: string;
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Bounds proyectados de una feature, ignorando islas lejanas (Alaska, Guayana, Svalbard…). */
function boundsOf(pg: PathGen, f: GeoFeature): [number, number, number, number] | null {
  const g = f.geometry;
  if (!g) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polys: any[] = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  const items: { b: [number, number, number, number]; a: number }[] = [];
  for (const p of polys) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bb = pg.bounds({ type: "Polygon", coordinates: p } as any);
    const x0 = bb[0][0];
    const y0 = bb[0][1];
    const x1 = bb[1][0];
    const y1 = bb[1][1];
    if (![x0, y0, x1, y1].every((n) => Number.isFinite(n))) continue;
    items.push({ b: [x0, y0, x1, y1], a: Math.max(x1 - x0, 1) * Math.max(y1 - y0, 1) });
  }
  if (!items.length) return null;
  const max = Math.max(...items.map((i) => i.a));
  const keep = items.filter((i) => i.a >= max * 0.12);
  return [
    Math.min(...keep.map((i) => i.b[0])),
    Math.min(...keep.map((i) => i.b[1])),
    Math.max(...keep.map((i) => i.b[2])),
    Math.max(...keep.map((i) => i.b[3])),
  ];
}

function countryFill(id: string, selected: boolean, dimmed: boolean, hasRegions: boolean, control: boolean) {
  const o = control ? ownerOf(id) : null;
  if (selected) return hasRegions ? "#0b0e14" : o ? o.color + "77" : "#2a303c";
  const base = dimmed ? "#0f1218" : "#171b24";
  if (!o) return base;
  return o.color + (dimmed ? "24" : "42");
}

interface CountriesProps {
  items: PathItem[];
  selectedId: string | null;
  hasRegions: boolean;
  control: boolean;
  battleIds: Set<string>;
  onClick: (id: string, e: React.MouseEvent) => void;
  onEnter: (id: string, name: string) => void;
  onLeave: () => void;
}

const Countries = memo(function Countries(p: CountriesProps) {
  return (
    <g>
      {p.items.map((c) => {
        const selected = c.id === p.selectedId;
        const battle = p.battleIds.has(c.id);
        return (
          <path
            key={c.id}
            d={c.d}
            className="country"
            fill={countryFill(c.id, selected, p.selectedId !== null, p.hasRegions, p.control)}
            stroke={battle ? "#ff2f4d" : "#06080c"}
            strokeWidth={battle ? 1.1 : 0.6}
            strokeOpacity={battle ? 0.8 : 1}
            vectorEffect="non-scaling-stroke"
            onClick={(e) => p.onClick(c.id, e)}
            onPointerEnter={() => p.onEnter(c.id, c.name)}
            onPointerLeave={p.onLeave}
          />
        );
      })}
    </g>
  );
});

interface RegionsProps {
  items: PathItem[];
  selectedRegionId: string | null;
  control: boolean;
  onClick: (id: string, e: React.MouseEvent) => void;
  onEnter: (id: string, name: string) => void;
  onLeave: () => void;
}

const Regions = memo(function Regions(p: RegionsProps) {
  return (
    <g>
      {p.items.map((r) => {
        const o = p.control ? ownerOf(r.id) : null;
        const sel = r.id === p.selectedRegionId;
        const fill = sel ? (o ? o.color + "aa" : "#2c3342") : o ? o.color + "55" : "#1a1f29";
        return (
          <path
            key={r.id}
            d={r.d}
            className="region"
            fill={fill}
            stroke="#07090d"
            strokeWidth={0.9}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            onClick={(e) => p.onClick(r.id, e)}
            onPointerEnter={() => p.onEnter(r.id, r.name)}
            onPointerLeave={p.onLeave}
          />
        );
      })}
    </g>
  );
});

export default function WorldMap({
  world,
  regionData,
  selectedId,
  selectedRegionId,
  onSelectCountry,
  onSelectRegion,
  onBackground,
  battles,
  layers,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 900, h: 500 });
  const [view, setView] = useState<View>({ k: 1, x: 0, y: 0 });
  const [dur, setDur] = useState(0);
  const viewRef = useRef<View>(view);
  const drag = useRef<{ sx: number; sy: number; vx: number; vy: number; moved: boolean } | null>(null);
  const [hover, setHover] = useState<{ kind: "c" | "r"; id: string; name: string } | null>(null);

  const commit = useCallback((v: View, ms: number) => {
    viewRef.current = v;
    setDur(ms);
    setView(v);
  }, []);

  // Tamaño del contenedor
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 20 && height > 20) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const leftInset = size.w >= 1000 ? 310 : 0;

  const projection = useMemo(
    () =>
      geoNaturalEarth1().fitExtent(
        [
          [12, 12],
          [size.w - 12, size.h - 12],
        ],
        { type: "Sphere" }
      ),
    [size.w, size.h]
  );
  const pathGen = useMemo(() => geoPath(projection), [projection]);

  const sphereD = useMemo(() => pathGen({ type: "Sphere" }), [pathGen]);
  const graticuleD = useMemo(() => pathGen(geoGraticule10()), [pathGen]);

  const countryPaths = useMemo<PathItem[]>(() => {
    const out: PathItem[] = [];
    for (const f of world?.features ?? []) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = pathGen(f as any);
      if (d) out.push({ id: f.properties.id, name: f.properties.name, d });
    }
    return out;
  }, [world, pathGen]);

  const regionPaths = useMemo<PathItem[]>(() => {
    const out: PathItem[] = [];
    for (const f of regionData?.features ?? []) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = pathGen(f as any);
      if (d) out.push({ id: f.properties.id, name: f.properties.name, d });
    }
    return out;
  }, [regionData, pathGen]);

  const regionPts = useMemo(() => {
    const m = new Map<string, { x: number; y: number; name: string }>();
    for (const f of regionData?.features ?? []) {
      const p = projection([f.properties.cx, f.properties.cy]);
      if (p) m.set(f.properties.id, { x: p[0], y: p[1], name: f.properties.name });
    }
    return m;
  }, [regionData, projection]);

  const countryPts = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    for (const f of world?.features ?? []) {
      const p = projection([f.properties.cx, f.properties.cy]);
      if (p) m.set(f.properties.id, { x: p[0], y: p[1] });
    }
    return m;
  }, [world, projection]);

  const battleIds = useMemo(() => new Set(layers.battles ? battles.map((b) => b.country) : []), [battles, layers.battles]);

  const routeData = useMemo(
    () =>
      ROUTES.map((r) => ({
        id: r.id,
        name: r.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        d: pathGen({ type: "LineString", coordinates: [r.from, r.to] } as any),
        a: projection(r.from),
        b: projection(r.to),
      })),
    [pathGen, projection]
  );

  // ─── Zoom a la selección ───
  const fit = useCallback(
    (f: GeoFeature, frac: number, maxK: number) => {
      const b = boundsOf(pathGen, f);
      if (!b) return;
      const [x0, y0, x1, y1] = b;
      const bw = Math.max(x1 - x0, 2);
      const bh = Math.max(y1 - y0, 2);
      const aw = size.w - leftInset;
      const ah = size.h;
      const k = clamp(Math.min((aw * frac) / bw, (ah * frac) / bh), 1, maxK);
      commit({ k, x: leftInset + aw / 2 - ((x0 + x1) / 2) * k, y: ah / 2 - ((y0 + y1) / 2) * k }, 700);
    },
    [pathGen, size.w, size.h, leftInset, commit]
  );

  useEffect(() => {
    if (!world) return;
    const regFeat =
      selectedRegionId && regionData
        ? regionData.features.find((f) => f.properties.id === selectedRegionId)
        : undefined;
    const cFeat = selectedId ? world.features.find((f) => f.properties.id === selectedId) : undefined;
    if (regFeat) fit(regFeat, 0.5, 70);
    else if (cFeat) fit(cFeat, 0.72, 40);
    else commit({ k: 1, x: 0, y: 0 }, 700);
  }, [world, selectedId, selectedRegionId, regionData, fit, commit]);

  // ─── Arrastre (listeners de ventana: NO se captura el puntero, así el clic llega al país) ───
  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { sx: e.clientX, sy: e.clientY, vx: viewRef.current.x, vy: viewRef.current.y, moved: false };
  };
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.sx;
      const dy = e.clientY - d.sy;
      if (!d.moved && Math.abs(dx) + Math.abs(dy) > 5) d.moved = true;
      if (d.moved) commit({ k: viewRef.current.k, x: d.vx + dx, y: d.vy + dy }, 0);
    };
    const up = () => {
      const d = drag.current;
      if (d && d.moved) {
        window.setTimeout(() => {
          drag.current = null;
        }, 0);
      } else {
        drag.current = null;
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [commit]);

  // ─── Rueda: zoom hacia el cursor ───
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const v = viewRef.current;
      const k2 = clamp(v.k * Math.exp(-e.deltaY * 0.0018), 0.9, 90);
      const s = k2 / v.k;
      commit({ k: k2, x: mx - (mx - v.x) * s, y: my - (my - v.y) * s }, 120);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [commit]);

  const zoomBy = (f: number) => {
    const v = viewRef.current;
    const cx = leftInset + (size.w - leftInset) / 2;
    const cy = size.h / 2;
    const k2 = clamp(v.k * f, 0.9, 90);
    const s = k2 / v.k;
    commit({ k: k2, x: cx - (cx - v.x) * s, y: cy - (cy - v.y) * s }, 280);
  };

  const onRootMove = (e: React.PointerEvent) => {
    const el = tipRef.current;
    const root = rootRef.current;
    if (!el || !root) return;
    const r = root.getBoundingClientRect();
    el.style.transform = `translate(${e.clientX - r.left + 16}px, ${e.clientY - r.top + 18}px)`;
  };

  const handleCountryClick = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (drag.current?.moved) return;
      onSelectCountry(id);
    },
    [onSelectCountry]
  );
  const handleRegionClick = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (drag.current?.moved) return;
      onSelectRegion(id);
    },
    [onSelectRegion]
  );
  const enterC = useCallback((id: string, name: string) => setHover({ kind: "c", id, name }), []);
  const enterR = useCallback((id: string, name: string) => setHover({ kind: "r", id, name }), []);
  const leave = useCallback(() => setHover(null), []);

  const hasRegions = regionPaths.length > 0;
  const selCountryD = selectedId ? countryPaths.find((c) => c.id === selectedId)?.d : undefined;
  const selRegionD = selectedRegionId ? regionPaths.find((r) => r.id === selectedRegionId)?.d : undefined;
  const k = view.k;
  const showAllLabels = regionPaths.length > 0 && regionPaths.length <= 28;
  const hoverRegionId = hover?.kind === "r" ? hover.id : null;
  const hoverOwner = hover ? ownerOf(hover.id) : null;

  const markers = battles
    .map((b) => {
      const pt = (b.region && regionPts.get(b.region)) || countryPts.get(b.country);
      return pt ? { ...b, x: pt.x, y: pt.y } : null;
    })
    .filter((m): m is BattleMark & { x: number; y: number } => m !== null);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 touch-none select-none map-root overflow-hidden"
      onPointerDown={onDown}
      onPointerMove={onRootMove}
    >
      <svg width={size.w} height={size.h} className="block cursor-grab active:cursor-grabbing">
        <rect
          width={size.w}
          height={size.h}
          fill="transparent"
          onClick={() => {
            if (drag.current?.moved) return;
            onBackground();
          }}
        />
        <g
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
            transformOrigin: "0 0",
            transition: dur ? `transform ${dur}ms cubic-bezier(.22,.8,.22,1)` : "none",
          }}
        >
          {sphereD && (
            <path d={sphereD} fill="#090c12" stroke="#1f2837" strokeWidth={1} vectorEffect="non-scaling-stroke" pointerEvents="none" />
          )}
          {graticuleD && (
            <path d={graticuleD} fill="none" stroke="rgba(120,150,200,0.08)" strokeWidth={0.6} vectorEffect="non-scaling-stroke" pointerEvents="none" />
          )}

          <Countries
            items={countryPaths}
            selectedId={selectedId}
            hasRegions={hasRegions}
            control={layers.control}
            battleIds={battleIds}
            onClick={handleCountryClick}
            onEnter={enterC}
            onLeave={leave}
          />

          {layers.routes &&
            routeData.map(
              (r) =>
                r.d && (
                  <g key={r.id} pointerEvents="none">
                    <path d={r.d} fill="none" stroke="#14b8a6" strokeWidth={1.4} strokeOpacity={0.85} vectorEffect="non-scaling-stroke" className="route" />
                    {r.a && <circle cx={r.a[0]} cy={r.a[1]} r={2.4 / k} fill="#14b8a6" />}
                    {r.b && <circle cx={r.b[0]} cy={r.b[1]} r={2.4 / k} fill="#14b8a6" />}
                  </g>
                )
            )}

          {hasRegions && (
            <Regions
              items={regionPaths}
              selectedRegionId={selectedRegionId}
              control={layers.control}
              onClick={handleRegionClick}
              onEnter={enterR}
              onLeave={leave}
            />
          )}

          {selCountryD && (
            <path d={selCountryD} fill="none" stroke="#ff2f4d" strokeWidth={1.8} vectorEffect="non-scaling-stroke" pointerEvents="none" />
          )}
          {selRegionD && (
            <path d={selRegionD} fill="none" stroke="#ffffff" strokeWidth={2} vectorEffect="non-scaling-stroke" pointerEvents="none" />
          )}

          {hasRegions &&
            regionPaths.map((r) => {
              const pt = regionPts.get(r.id);
              if (!pt) return null;
              const on = r.id === selectedRegionId || r.id === hoverRegionId;
              if (!showAllLabels && !on) return null;
              return (
                <text
                  key={r.id}
                  transform={`translate(${pt.x} ${pt.y}) scale(${1 / k})`}
                  textAnchor="middle"
                  fill={on ? "#ffffff" : "#c9cfdb"}
                  fontSize={on ? 12.5 : 10}
                  pointerEvents="none"
                  style={{
                    fontFamily: "var(--font-display), Impact, sans-serif",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    paintOrder: "stroke",
                    stroke: "#000",
                    strokeWidth: 3,
                    strokeLinejoin: "round",
                  }}
                >
                  {r.name}
                </text>
              );
            })}

          {layers.battles &&
            markers.map((m) => (
              <g key={m.id} transform={`translate(${m.x} ${m.y}) scale(${1 / k})`} pointerEvents="none">
                <circle r={12} fill="none" stroke={m.color} strokeWidth={1.6} className="pulse-ring" />
                <circle r={4} fill={m.color} stroke="#000" strokeWidth={1} />
                <title>{m.title}</title>
              </g>
            ))}
        </g>
      </svg>

      <div className="map-scan" />
      <div className="map-vignette" />

      {!world && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hud px-5 py-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-hi)] animate-pulse" />
            <span className="font-display tracking-[0.18em] text-[14px] text-[var(--muted)]">CARGANDO MAPA…</span>
          </div>
        </div>
      )}

      {/* Tooltip */}
      <div ref={tipRef} className="absolute left-0 top-0 pointer-events-none z-30">
        {hover && (
          <div className="hud px-2.5 py-1.5 whitespace-nowrap">
            <div className="font-display text-[15px] tracking-[0.06em] leading-none">{hover.name}</div>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[var(--muted)] uppercase tracking-wider">
              <span>{hover.kind === "r" ? "Región" : "País"}</span>
              {layers.control && (
                <>
                  <span className="opacity-40">·</span>
                  <span style={{ color: hoverOwner?.color ?? "var(--dim)" }}>
                    {hoverOwner ? hoverOwner.name : "Sin control"}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Leyenda */}
      <div className="absolute bottom-3 right-16 hud px-3 py-2 hidden md:block z-20">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="hud-head">Leyenda</span>
          <MockTag />
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 max-w-[340px]">
          {layers.control &&
            FACTIONS.map((f) => (
              <span key={f.id} className="flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
                <i className="w-2.5 h-2.5 rounded-sm block" style={{ background: f.color }} />
                {f.tag}
              </span>
            ))}
          {layers.battles && (
            <span className="flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
              <i className="w-2.5 h-2.5 rounded-full block border border-[var(--accent-hi)]" />
              Batalla
            </span>
          )}
          {layers.routes && (
            <span className="flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
              <i className="w-4 h-0 block border-t-2 border-dashed border-[#14b8a6]" />
              Ruta
            </span>
          )}
        </div>
      </div>

      {/* Zoom */}
      <div className="absolute bottom-3 right-3 hud flex flex-col z-20 overflow-hidden">
        <button type="button" onClick={() => zoomBy(1.6)} className="w-9 h-9 flex items-center justify-center hover:bg-white/10" aria-label="Acercar">
          <Plus size={16} />
        </button>
        <button type="button" onClick={() => zoomBy(1 / 1.6)} className="w-9 h-9 flex items-center justify-center hover:bg-white/10 border-t border-[var(--border)]" aria-label="Alejar">
          <Minus size={16} />
        </button>
        <button type="button" onClick={onBackground} className="w-9 h-9 flex items-center justify-center hover:bg-white/10 border-t border-[var(--border)]" aria-label="Vista mundial" title="Vista mundial">
          <LocateFixed size={15} />
        </button>
      </div>
    </div>
  );
}

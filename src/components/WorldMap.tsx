"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { geoNaturalEarth1, geoPath, geoBounds } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import {
  ISO_NUM_TO_GAME,
  colorForId,
  DEFAULT_LAND,
  DEFAULT_STROKE,
  OCEAN,
  REGION_LAYOUT,
} from "@/data/mapCountries";
import { REGIONS } from "@/data/countries";

interface WorldMapProps {
  selectedId: string | null;
  selectedRegionId: string | null;
  onSelectCountry: (id: string) => void;
  onSelectRegion: (id: string) => void;
  battleCountryIds?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFeat = any;

const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function isoKey(id: unknown): string {
  if (id == null) return "";
  return String(id).padStart(3, "0");
}

function gameIdFromFeat(feat: AnyFeat): string {
  const num = isoKey(feat?.id);
  if (ISO_NUM_TO_GAME[num]) return ISO_NUM_TO_GAME[num];
  // fallback: use numeric id as stable key so EVERY country is selectable
  return num ? `c${num}` : `u${Math.random().toString(36).slice(2, 8)}`;
}

export default function WorldMap({
  selectedId,
  selectedRegionId,
  onSelectCountry,
  onSelectRegion,
  battleCountryIds = [],
}: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 450 });
  const [features, setFeatures] = useState<AnyFeat[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number; moved: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 20 && height > 20) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(TOPO_URL);
        if (!res.ok) throw new Error("No se pudo cargar el mapa");
        const topo = (await res.json()) as Topology<{ countries: GeometryCollection }>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fc = feature(topo, topo.objects.countries) as any;
        const list: AnyFeat[] = Array.isArray(fc?.features) ? fc.features : [];
        if (!cancelled) {
          setFeatures(list);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Error de mapa");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const projection = useMemo(() => {
    return geoNaturalEarth1().fitExtent(
      [
        [8, 8],
        [size.w - 8, size.h - 8],
      ],
      { type: "Sphere" }
    );
  }, [size.w, size.h]);

  const pathGen = useMemo(() => geoPath(projection), [projection]);

  // Zoom to selected country
  useEffect(() => {
    if (!selectedId || !features.length) return;
    const feat = features.find((f) => gameIdFromFeat(f) === selectedId);
    if (!feat) return;
    try {
      const [[x0, y0], [x1, y1]] = geoBounds(feat);
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      const [px, py] = projection([cx, cy] as [number, number]) || [size.w / 2, size.h / 2];
      const bw = Math.max(x1 - x0, 0.5);
      const bh = Math.max(y1 - y0, 0.5);
      // rough scale: smaller countries zoom more
      const k = Math.min(4.5, Math.max(1.4, 0.55 / Math.max(bw / 60, bh / 35)));
      setTransform({
        k,
        x: size.w / 2 - px * k,
        y: size.h / 2 - py * k,
      });
    } catch {
      /* ignore zoom errors */
    }
  }, [selectedId, features, projection, size.w, size.h]);

  const onPointerDown = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch { /* */ }
    dragRef.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) dragRef.current.moved = true;
    setTransform((t) => ({
      ...t,
      x: dragRef.current!.tx + dx,
      y: dragRef.current!.ty + dy,
    }));
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const zoomIn = () => setTransform((t) => ({ ...t, k: Math.min(8, t.k * 1.35) }));
  const zoomOut = () => setTransform((t) => ({ ...t, k: Math.max(0.7, t.k / 1.35) }));
  const resetView = () => setTransform({ k: 1, x: 0, y: 0 });

  const regionMarkers = useMemo(() => {
    if (!selectedId) return [];
    const feat = features.find((f) => gameIdFromFeat(f) === selectedId);
    if (!feat) return [];

    let b: [[number, number], [number, number]];
    try {
      b = geoBounds(feat);
    } catch {
      return [];
    }
    const [[minLon, minLat], [maxLon, maxLat]] = b;
    const layout = REGION_LAYOUT[selectedId];
    const regionDefs = REGIONS.filter((r) => r.countryId === selectedId);

    // If we have explicit layout use it; else auto-grid
    const anchors =
      layout ||
      regionDefs.map((r, i) => {
        const n = Math.max(regionDefs.length, 1);
        const cols = Math.ceil(Math.sqrt(n));
        const row = Math.floor(i / cols);
        const col = i % cols;
        return {
          id: r.id,
          fx: (col + 0.5) / cols,
          fy: (row + 0.5) / Math.ceil(n / cols),
        };
      });

    return anchors.map((a) => {
      const lon = minLon + (maxLon - minLon) * a.fx;
      const lat = maxLat - (maxLat - minLat) * a.fy;
      const xy = projection([lon, lat] as [number, number]);
      const name = REGIONS.find((r) => r.id === a.id)?.name || a.id;
      return { id: a.id, name, x: xy ? xy[0] : 0, y: xy ? xy[1] : 0 };
    });
  }, [selectedId, features, projection]);

  const label = useMemo(() => {
    const id = hovered || selectedId;
    if (!id) return null;
    const f = features.find((ft) => gameIdFromFeat(ft) === id);
    return f?.properties?.name || id.toUpperCase();
  }, [hovered, selectedId, features]);

  const handleCountryClick = useCallback(
    (gid: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (dragRef.current?.moved) return;
      onSelectCountry(gid);
    },
    [onSelectCountry]
  );

  return (
    <div ref={containerRef} className="absolute inset-0 touch-none select-none" style={{ background: OCEAN }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)] text-sm z-10">
          Cargando mapa mundial…
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm z-10">{error}</div>
      )}

      <svg
        width={size.w}
        height={size.h}
        className="block w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <rect width={size.w} height={size.h} fill={OCEAN} />

        <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
          <path
            d={pathGen({ type: "Sphere" }) || undefined}
            fill={OCEAN}
            stroke="#1e293b"
            strokeWidth={0.5 / transform.k}
          />

          {features.map((feat, i) => {
            const gid = gameIdFromFeat(feat);
            const isSelected = gid === selectedId;
            const isHovered = gid === hovered;
            const hasBattle = battleCountryIds.includes(gid);
            const base = colorForId(gid);
            const fill = isSelected ? base : isHovered ? base + "cc" : base + "88";
            let d: string | null = null;
            try {
              d = pathGen(feat);
            } catch {
              return null;
            }
            if (!d) return null;

            return (
              <path
                key={String(feat.id ?? i)}
                d={d}
                fill={isSelected ? base : fill}
                stroke={isSelected ? "#ffffff" : hasBattle ? "#ef4444" : DEFAULT_STROKE}
                strokeWidth={(isSelected ? 1.4 : hasBattle ? 1 : 0.3) / transform.k}
                className="cursor-pointer"
                style={{
                  filter: isSelected || isHovered ? `drop-shadow(0 0 3px ${base})` : undefined,
                }}
                onClick={(e) => handleCountryClick(gid, e)}
                onPointerEnter={() => setHovered(gid)}
                onPointerLeave={() => setHovered(null)}
              />
            );
          })}

          {/* Region markers when country selected */}
          {regionMarkers.map((r) => {
            const active = r.id === selectedRegionId;
            const rad = (active ? 7 : 5.5) / transform.k;
            return (
              <g
                key={r.id}
                transform={`translate(${r.x} ${r.y})`}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRegion(r.id);
                }}
              >
                <circle
                  r={rad}
                  fill={active ? "#c41e3a" : "#0b1220"}
                  stroke={active ? "#fff" : "#c41e3a"}
                  strokeWidth={1.5 / transform.k}
                />
                <circle r={2 / transform.k} fill={active ? "#fff" : "#c41e3a"} />
                <text
                  y={-10 / transform.k}
                  textAnchor="middle"
                  fill="#e8eef6"
                  fontSize={10 / transform.k}
                  fontFamily="Inter, system-ui, sans-serif"
                  style={{ pointerEvents: "none", paintOrder: "stroke", stroke: "#000", strokeWidth: 2 / transform.k }}
                >
                  {r.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {label && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-black/80 border border-[var(--border)] text-xs pointer-events-none z-20">
          {label}
        </div>
      )}

      <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-20">
        <button type="button" onClick={zoomIn} className="w-8 h-8 rounded-md bg-[var(--panel)] border border-[var(--border)] text-sm hover:bg-[var(--panel2)]">+</button>
        <button type="button" onClick={zoomOut} className="w-8 h-8 rounded-md bg-[var(--panel)] border border-[var(--border)] text-sm hover:bg-[var(--panel2)]">−</button>
        <button type="button" onClick={resetView} className="w-8 h-8 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[10px] hover:bg-[var(--panel2)]" title="Reset">⌂</button>
      </div>
    </div>
  );
}
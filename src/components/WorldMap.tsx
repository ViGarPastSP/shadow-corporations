"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { geoNaturalEarth1, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import { ISO_NUM_TO_GAME, GAME_COLORS, DEFAULT_LAND, DEFAULT_STROKE, OCEAN } from "@/data/mapCountries";

interface WorldMapProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  battleCountryIds?: string[];
}

interface CountryFeat {
  type: "Feature";
  id?: string | number;
  properties: { name?: string };
  geometry: GeoPermissibleObjects;
}

const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap({ selectedId, onSelect, battleCountryIds = [] }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 450 });
  const [features, setFeatures] = useState<CountryFeat[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Load topojson
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(TOPO_URL);
        if (!res.ok) throw new Error("No se pudo cargar el mapa");
        const topo = (await res.json()) as Topology<{ countries: GeometryCollection }>;
        const feats = feature(topo, topo.objects.countries) as unknown as {
          features: CountryFeat[];
        };
        if (!cancelled) {
          setFeatures(feats.features || []);
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
        [12, 12],
        [size.w - 12, size.h - 12],
      ],
      { type: "Sphere" }
    );
  }, [size.w, size.h]);

  const pathGen = useMemo(() => geoPath(projection), [projection]);

  const gameIdOf = useCallback((feat: CountryFeat): string | null => {
    const raw = feat.id != null ? String(feat.id).padStart(3, "0") : "";
    return ISO_NUM_TO_GAME[raw] || null;
  }, []);

  // Pan
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setTransform((t) => ({
      ...t,
      x: dragRef.current!.tx + dx,
      y: dragRef.current!.ty + dy,
    }));
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const zoomIn = () => setTransform((t) => ({ ...t, k: Math.min(6, t.k * 1.35) }));
  const zoomOut = () => setTransform((t) => ({ ...t, k: Math.max(0.8, t.k / 1.35) }));
  const resetView = () => setTransform({ k: 1, x: 0, y: 0 });

  const hoveredName = useMemo(() => {
    if (!hovered) return null;
    const f = features.find((ft) => gameIdOf(ft) === hovered);
    return f?.properties?.name || hovered.toUpperCase();
  }, [hovered, features, gameIdOf]);

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

        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`} style={{ transformOrigin: "center" }}>
          {/* Sphere outline */}
          <path d={pathGen({ type: "Sphere" }) || undefined} fill={OCEAN} stroke="#1e293b" strokeWidth={0.6} />

          {features.map((feat, i) => {
            const gid = gameIdOf(feat);
            const isPlayable = !!gid;
            const isSelected = gid === selectedId;
            const isHovered = gid === hovered;
            const hasBattle = gid ? battleCountryIds.includes(gid) : false;
            const fill = isPlayable
              ? isSelected
                ? GAME_COLORS[gid!]
                : isHovered
                ? GAME_COLORS[gid!] + "dd"
                : GAME_COLORS[gid!] + "99"
              : DEFAULT_LAND;

            const d = pathGen(feat as unknown as GeoPermissibleObjects);
            if (!d) return null;

            return (
              <path
                key={feat.id ?? i}
                d={d}
                fill={fill}
                stroke={isSelected ? "#fff" : hasBattle ? "#ef4444" : DEFAULT_STROKE}
                strokeWidth={isSelected ? 1.2 / transform.k : hasBattle ? 0.9 / transform.k : 0.35 / transform.k}
                className={isPlayable ? "cursor-pointer" : "cursor-default"}
                style={{
                  filter: isSelected || (isHovered && isPlayable) ? `drop-shadow(0 0 4px ${fill})` : undefined,
                  transition: "fill 120ms ease",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (gid) onSelect(gid);
                }}
                onPointerEnter={() => {
                  if (gid) setHovered(gid);
                }}
                onPointerLeave={() => setHovered(null)}
              />
            );
          })}
        </g>
      </svg>

      {/* Hover label */}
      {hoveredName && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-black/80 border border-[var(--border)] text-xs pointer-events-none z-20">
          {hoveredName}
        </div>
      )}

      {/* Zoom controls — Warera style */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-20">
        <button
          type="button"
          onClick={zoomIn}
          className="w-8 h-8 rounded-md bg-[var(--panel)] border border-[var(--border)] text-sm hover:bg-[var(--panel2)]"
        >
          +
        </button>
        <button
          type="button"
          onClick={zoomOut}
          className="w-8 h-8 rounded-md bg-[var(--panel)] border border-[var(--border)] text-sm hover:bg-[var(--panel2)]"
        >
          −
        </button>
        <button
          type="button"
          onClick={resetView}
          className="w-8 h-8 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[10px] hover:bg-[var(--panel2)]"
          title="Reset"
        >
          ⌂
        </button>
      </div>

      <div className="absolute top-3 left-3 text-[10px] text-[var(--muted)] bg-black/50 px-2 py-1 rounded z-10 pointer-events-none">
        Arrastra para mover · clic en país jugable
      </div>
    </div>
  );
}
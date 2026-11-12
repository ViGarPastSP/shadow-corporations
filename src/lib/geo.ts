// Tipos y carga (con caché) de la geometría del mundo y de las regiones.
// Los datos viven en /public/geo (Natural Earth, simplificados).

export interface GeoProps {
  id: string;
  name: string;
  cx: number;
  cy: number;
  cont?: string;
  pop?: number;
}

export interface GeoFeature {
  type: "Feature";
  id?: string;
  properties: GeoProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geometry: any;
}

export interface GeoCollection {
  type: "FeatureCollection";
  features: GeoFeature[];
}

const cache = new Map<string, Promise<GeoCollection | null>>();

function load(url: string): Promise<GeoCollection | null> {
  const hit = cache.get(url);
  if (hit) return hit;
  const p = fetch(url)
    .then((r) => (r.ok ? (r.json() as Promise<GeoCollection>) : null))
    .catch(() => null);
  cache.set(url, p);
  return p;
}

export function loadWorld(): Promise<GeoCollection | null> {
  return load("/geo/world.json");
}

/** Regiones (admin-1) de un país por su código ISO-2 en minúsculas. null si no hay subdivisiones. */
export function loadAdmin1(countryId: string): Promise<GeoCollection | null> {
  return load(`/geo/admin1/${countryId}.json`);
}

export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

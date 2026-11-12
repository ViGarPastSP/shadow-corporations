// ─────────────────────────────────────────────────────────────
// MUNDO SIMULADO — todo lo de este fichero es DEMO determinista.
// Cuando exista backend (Supabase: district_control, operations…)
// se sustituye por datos reales. La UI lo marca como "SIMULADO".
// ─────────────────────────────────────────────────────────────

export interface Faction {
  id: string;
  name: string;
  tag: string;
  color: string;
}

export const FACTIONS: Faction[] = [
  { id: "nexus", name: "Nexus Holdings", tag: "NXS", color: "#e11d48" },
  { id: "ledger", name: "Black Ledger", tag: "BLK", color: "#d4a24c" },
  { id: "apex", name: "Apex Dynamics", tag: "APX", color: "#3b82f6" },
  { id: "cartel", name: "Mediterranean Cartel", tag: "MED", color: "#14b8a6" },
  { id: "shadow", name: "ShadowCorps Local", tag: "SHC", color: "#a855f7" },
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seeded(id: string, salt: string): number {
  return (hash(id + ":" + salt) % 10000) / 10000;
}

const OVERRIDES: Record<string, string | null> = {
  "es-valenciana": "nexus",
  "es-cataluna": "apex",
  "es-andalucia": "ledger",
  "es-madrid": "nexus",
  "es-galicia": "cartel",
  "us-ny": "apex",
  "us-ca": "nexus",
  "fr-provence-alpes-cote-d-azur": "cartel",
  es: "nexus",
  us: "apex",
  gb: "ledger",
  it: "cartel",
};

export function factionById(id: string | null | undefined): Faction | null {
  if (!id) return null;
  return FACTIONS.find((f) => f.id === id) ?? null;
}

/** Facción que "controla" un país o región (null = sin dueño). */
export function ownerOf(id: string): Faction | null {
  if (id in OVERRIDES) return factionById(OVERRIDES[id]);
  const r = seeded(id, "own");
  if (r < 0.24) return null;
  const idx = Math.min(
    FACTIONS.length - 1,
    Math.floor(((r - 0.24) / 0.76) * FACTIONS.length)
  );
  return FACTIONS[idx];
}

export interface LocalStats {
  control: number;
  stability: number;
  corruption: number;
  surveillance: number;
  income: number;
}

export function localStats(id: string): LocalStats {
  return {
    control: 34 + Math.round(seeded(id, "c") * 62),
    stability: 20 + Math.round(seeded(id, "s") * 75),
    corruption: 10 + Math.round(seeded(id, "k") * 80),
    surveillance: 8 + Math.round(seeded(id, "v") * 82),
    income: 2 + Math.round(seeded(id, "i") * 48),
  };
}

export interface SmuggleRoute {
  id: string;
  name: string;
  from: [number, number];
  to: [number, number];
}

export const ROUTES: SmuggleRoute[] = [
  { id: "r1", name: "Valencia ⇄ Marsella", from: [-0.38, 39.47], to: [5.37, 43.3] },
  { id: "r2", name: "Casablanca ⇄ Algeciras", from: [-7.59, 33.57], to: [-5.45, 36.13] },
  { id: "r3", name: "Nápoles ⇄ Valencia", from: [14.27, 40.85], to: [-0.38, 39.47] },
  { id: "r4", name: "Róterdam ⇄ Nueva York", from: [4.48, 51.92], to: [-74.0, 40.71] },
  { id: "r5", name: "Singapur ⇄ Dubái", from: [103.82, 1.35], to: [55.27, 25.2] },
];

export interface TickerItem {
  text: string;
  color: string;
}

export const TICKER: TickerItem[] = [
  { text: "Nexus Holdings declara la guerra a Apex Dynamics en la Costa Este", color: "#e11d48" },
  { text: "Cargamento interceptado en el puerto de Marsella: 3 detenidos", color: "#14b8a6" },
  { text: "Black Ledger absorbe tres empresas menores en Andalucía", color: "#d4a24c" },
  { text: "Filtración: inspector de aduanas de Valencia, bajo sospecha", color: "#a855f7" },
  { text: "Hackeo masivo a un banco intermediario suizo", color: "#3b82f6" },
  { text: "Duelo de ejecutivos en Londres: Voss vs Kane", color: "#e11d48" },
  { text: "Nueva ruta de contrabando abierta: Casablanca ⇄ Algeciras", color: "#14b8a6" },
  { text: "Identidad de cobertura quemada en Berlín", color: "#ff4d4d" },
];

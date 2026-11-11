export type IdentityStatus = "active" | "burned" | "retired";

export interface CoverIdentity {
  id: string;
  name: string;
  cover: string; // job / role
  location: string;
  heat: number; // 0-100 exposure risk
  status: IdentityStatus;
  createdAt: string;
  lastUsedAt: string;
}

export type IntelRarity = "low" | "medium" | "high" | "critical";

export interface IntelReport {
  id: string;
  title: string;
  source: string; // who talked / where
  identityUsed: string;
  rarity: IntelRarity;
  content: string;
  status: "draft" | "sent" | "approved" | "rejected" | "paid";
  reward?: number;
  createdAt: string;
}

export type HackTargetType = "corporation" | "government" | "bank" | "personal" | "infra";

export interface HackTarget {
  id: string;
  name: string;
  type: HackTargetType;
  difficulty: number; // 1-10
  location: string;
  description: string;
  reward: string;
}

export const MOCK_IDENTITIES: CoverIdentity[] = [
  {
    id: "id1",
    name: "Carlos Mendez",
    cover: "Consultor de seguridad IT",
    location: "Madrid",
    heat: 18,
    status: "active",
    createdAt: "2026-10-02",
    lastUsedAt: "2026-11-10",
  },
  {
    id: "id2",
    name: "Elena Varga",
    cover: "Periodista freelance",
    location: "Barcelona",
    heat: 42,
    status: "active",
    createdAt: "2026-09-14",
    lastUsedAt: "2026-11-08",
  },
  {
    id: "id3",
    name: "Robert Hale",
    cover: "Analista de mercados",
    location: "Londres",
    heat: 71,
    status: "active",
    createdAt: "2026-08-20",
    lastUsedAt: "2026-11-05",
  },
];

export const MOCK_INTEL: IntelReport[] = [
  {
    id: "int1",
    title: "Movimientos de Apex en el puerto de Valencia",
    source: "Director de logística (borracho en cena)",
    identityUsed: "Carlos Mendez",
    rarity: "high",
    content: "Apex Dynamics está trasladando material no declarado por el muelle 7 entre las 02:00 y 04:00. Hay un inspector de aduanas comprado.",
    status: "sent",
    createdAt: "2026-11-10",
  },
  {
    id: "int2",
    title: "Filtración: reunión secreta Black Ledger",
    source: "Asistente personal del CEO",
    identityUsed: "Elena Varga",
    rarity: "critical",
    content: "Black Ledger planea absorber a tres empresas menores en el sur de España antes de diciembre. Lista parcial de nombres en el adjunto.",
    status: "approved",
    reward: 4500,
    createdAt: "2026-11-09",
  },
];

export const HACK_TARGETS: HackTarget[] = [
  {
    id: "h1",
    name: "Servidor de correos Apex Dynamics",
    type: "corporation",
    difficulty: 6,
    location: "us-este",
    description: "Acceso a hilos internos del departamento de operaciones especiales.",
    reward: "Intel corporativa + posible acceso a calendarios",
  },
  {
    id: "h2",
    name: "Cámaras del puerto de Valencia",
    type: "infra",
    difficulty: 4,
    location: "es-este",
    description: "Feed en vivo y grabaciones de las últimas 72h del muelle 7.",
    reward: "Prueba visual de movimientos nocturnos",
  },
  {
    id: "h3",
    name: "Cuenta personal — Inspector de aduanas",
    type: "personal",
    difficulty: 5,
    location: "es-este",
    description: "Mensajes y transferencias. Puede confirmar el soborno.",
    reward: "Prueba de corrupción + leverage",
  },
  {
    id: "h4",
    name: "Base de datos policial — Madrid",
    type: "government",
    difficulty: 8,
    location: "es-centro",
    description: "Fichas de vigilancia y alertas activas sobre identidades sospechosas.",
    reward: "Saber si alguna de tus identidades está quemada",
  },
  {
    id: "h5",
    name: "Banco intermediario — Suiza",
    type: "bank",
    difficulty: 9,
    location: "ch",
    description: "Movimientos de cuentas pantalla vinculadas a Black Ledger.",
    reward: "Rastro financiero + posibles cuentas congelables",
  },
];

export function heatLabel(heat: number): { text: string; color: string } {
  if (heat < 25) return { text: "Frío", color: "#22c55e" };
  if (heat < 50) return { text: "Tibio", color: "#eab308" };
  if (heat < 75) return { text: "Caliente", color: "#f97316" };
  return { text: "Quemado", color: "#ef4444" };
}
export type BattleType =
  | "corporate" // empresa vs empresa
  | "territorial" // control de región/país
  | "executive" // duelo entre ejecutivos
  | "route" // lucha por ruta de contrabando
  | "raid"; // asalto a instalaciones

export type BattleStatus = "pending" | "active" | "finished";

export interface Battle {
  id: string;
  type: BattleType;
  status: BattleStatus;
  title: string;
  location: string; // country or region id
  attacker: string;
  defender: string;
  attackerPower: number;
  defenderPower: number;
  startedAt: string;
  endsAt: string;
  result?: "attacker" | "defender" | "draw";
}

export const BATTLE_TYPE_LABELS: Record<BattleType, string> = {
  corporate: "Guerra Corporativa",
  territorial: "Control Territorial",
  executive: "Duelo de Ejecutivos",
  route: "Ruta de Contrabando",
  raid: "Asalto",
};

export const BATTLE_TYPE_COLORS: Record<BattleType, string> = {
  corporate: "#dc2626",
  territorial: "#ca8a04",
  executive: "#7c3aed",
  route: "#0891b2",
  raid: "#ea580c",
};

// Mock active battles for demo
export const MOCK_BATTLES: Battle[] = [
  {
    id: "b1",
    type: "territorial",
    status: "active",
    title: "Control de Asturias",
    location: "es-asturias",
    attacker: "Nexus Holdings",
    defender: "Black Ledger",
    attackerPower: 4200,
    defenderPower: 3800,
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "b2",
    type: "corporate",
    status: "active",
    title: "Guerra abierta: Nexus vs Apex",
    location: "us-ny",
    attacker: "Nexus Holdings",
    defender: "Apex Dynamics",
    attackerPower: 9100,
    defenderPower: 8700,
    startedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "b3",
    type: "route",
    status: "active",
    title: "Ruta Mediterránea",
    location: "it-sur",
    attacker: "Mediterranean Cartel",
    defender: "ShadowCorps Local",
    attackerPower: 2500,
    defenderPower: 2100,
    startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "b4",
    type: "executive",
    status: "active",
    title: "Duelo: Voss vs Kane",
    location: "gb-england",
    attacker: "Alex Voss",
    defender: "Marcus Kane",
    attackerPower: 780,
    defenderPower: 820,
    startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
  },
  {
    id: "b5",
    type: "raid",
    status: "pending",
    title: "Asalto a almacén en Marsella",
    location: "fr-sur",
    attacker: "Nexus Holdings",
    defender: "Puerto Libre",
    attackerPower: 1500,
    defenderPower: 1200,
    startedAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
  },
];
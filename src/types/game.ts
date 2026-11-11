export type Specialization =
  | "executive"
  | "spy"
  | "lobbyist"
  | "financier"
  | "propagandist";

export type OperationType =
  | "espionage"
  | "sabotage"
  | "lobby"
  | "propaganda"
  | "blackmail";

export interface Player {
  id: string;
  username: string;
  displayName: string;
  specialization: Specialization;
  level: number;
  capital: number;
  influence: number;
  information: number;
  risk: number;
  corporationId: string | null;
  createdAt: string;
}

export interface Corporation {
  id: string;
  name: string;
  tag: string;
  description: string;
  leaderId: string;
  memberCount: number;
  treasury: number;
  cityControl: number;
  createdAt: string;
}

export interface District {
  id: string;
  name: string;
  cityId: string;
  control: Record<string, number>; // corporationId -> percentage
  stability: number;
  economy: number;
  corruption: number;
}

export interface Operation {
  id: string;
  playerId: string;
  type: OperationType;
  target: string;
  progress: number;
  status: "preparing" | "active" | "completed" | "failed";
  riskLevel: number;
  startedAt: string;
  completesAt: string | null;
}
"use client";

import Link from "next/link";
import { MOCK_BATTLES, BATTLE_TYPE_LABELS, BATTLE_TYPE_COLORS } from "@/data/battles";

function timeLeft(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Finalizada";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

function powerBar(attacker: number, defender: number) {
  const total = attacker + defender;
  const attPct = Math.round((attacker / total) * 100);
  return attPct;
}

export default function BattlesPage() {
  return (
    <div className="min-h-screen bg-background">
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
              <Link href="/map" className="px-3 py-1.5 rounded-md text-muted hover:text-white transition">
                Mapa Mundial
              </Link>
              <Link href="/battles" className="px-3 py-1.5 rounded-md bg-surface2 text-white">
                Batallas
              </Link>
            </nav>
          </div>
          <div className="text-sm text-muted">{MOCK_BATTLES.filter((b) => b.status === "active").length} activas</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Batallas</h1>
          <p className="text-muted text-sm mt-1">
            Guerras corporativas, duelos de ejecutivos, control territorial y rutas de contrabando.
          </p>
        </div>

        <div className="space-y-4">
          {MOCK_BATTLES.map((battle) => {
            const attPct = powerBar(battle.attackerPower, battle.defenderPower);
            const color = BATTLE_TYPE_COLORS[battle.type];

            return (
              <div
                key={battle.id}
                className="bg-surface border border-border rounded-xl p-5 hover:border-zinc-600 transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ backgroundColor: color + "22", color }}
                      >
                        {BATTLE_TYPE_LABELS[battle.type]}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                          battle.status === "active"
                            ? "bg-green-500/15 text-green-400"
                            : battle.status === "pending"
                            ? "bg-yellow-500/15 text-yellow-400"
                            : "bg-zinc-500/15 text-zinc-400"
                        }`}
                      >
                        {battle.status === "active" ? "En curso" : battle.status === "pending" ? "Próxima" : "Finalizada"}
                      </span>
                    </div>
                    <h2 className="font-semibold">{battle.title}</h2>
                    <p className="text-xs text-muted mt-0.5">Ubicación: {battle.location}</p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-muted text-xs">Tiempo restante</div>
                    <div className="font-mono font-medium">{timeLeft(battle.endsAt)}</div>
                  </div>
                </div>

                {/* Power comparison */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-red-400">{battle.attacker}</span>
                    <span className="font-medium text-blue-400">{battle.defender}</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden bg-background flex">
                    <div
                      className="h-full bg-red-500 transition-all"
                      style={{ width: `${attPct}%` }}
                    />
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${100 - attPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted">
                    <span>{battle.attackerPower.toLocaleString()} poder</span>
                    <span>{battle.defenderPower.toLocaleString()} poder</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="text-xs bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-md transition">
                    Reforzar
                  </button>
                  <button className="text-xs bg-surface2 hover:bg-zinc-700 text-muted px-3 py-1.5 rounded-md transition">
                    Ver detalles
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
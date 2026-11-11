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
  const total = attacker + defender || 1;
  return Math.round((attacker / total) * 100);
}

export default function BattlesPage() {
  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      <header className="border-b border-border bg-surface shrink-0">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/20 border border-primary/40 rounded flex items-center justify-center">
                <span className="text-primary font-bold text-xs">SC</span>
              </div>
              <span className="font-semibold text-sm tracking-tight">ShadowCorps</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1 text-xs">
              <Link href="/dashboard" className="px-2.5 py-1 rounded text-muted hover:text-white">Dashboard</Link>
              <Link href="/map" className="px-2.5 py-1 rounded text-muted hover:text-white">Mapa</Link>
              <Link href="/ops" className="px-2.5 py-1 rounded text-muted hover:text-white">Operaciones</Link>
              <Link href="/battles" className="px-2.5 py-1 rounded bg-surface2 text-white">Batallas</Link>
            </nav>
          </div>
          <div className="text-[11px] text-muted">
            {MOCK_BATTLES.filter((b) => b.status === "active").length} activas
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto scroll-hidden max-w-5xl w-full mx-auto px-4 py-5">
        <h1 className="text-lg font-bold mb-1">Batallas</h1>
        <p className="text-[11px] text-muted mb-4">
          Guerras corporativas, duelos, control territorial y rutas de contrabando.
        </p>

        <div className="space-y-3">
          {MOCK_BATTLES.map((battle) => {
            const attPct = powerBar(battle.attackerPower, battle.defenderPower);
            const color = BATTLE_TYPE_COLORS[battle.type];
            return (
              <div key={battle.id} className="bg-surface border border-border rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: color + "22", color }}
                      >
                        {BATTLE_TYPE_LABELS[battle.type]}
                      </span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                          battle.status === "active"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-yellow-500/15 text-yellow-400"
                        }`}
                      >
                        {battle.status === "active" ? "En curso" : "Próxima"}
                      </span>
                    </div>
                    <h2 className="font-semibold text-sm">{battle.title}</h2>
                    <p className="text-[10px] text-muted">{battle.location}</p>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-muted text-[10px]">Restante</div>
                    <div className="font-mono">{timeLeft(battle.endsAt)}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-red-400">{battle.attacker}</span>
                    <span className="text-blue-400">{battle.defender}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-background flex">
                    <div className="h-full bg-red-500" style={{ width: `${attPct}%` }} />
                    <div className="h-full bg-blue-500" style={{ width: `${100 - attPct}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted">
                    <span>{battle.attackerPower.toLocaleString()}</span>
                    <span>{battle.defenderPower.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-3 flex gap-1.5">
                  <button className="text-[10px] bg-primary/20 text-primary px-2.5 py-1 rounded-md hover:bg-primary/30">
                    Reforzar
                  </button>
                  <button className="text-[10px] bg-surface2 text-muted px-2.5 py-1 rounded-md hover:bg-zinc-700">
                    Detalles
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
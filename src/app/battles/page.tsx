"use client";

import Link from "next/link";
import GameShell from "@/components/GameShell";
import { MOCK_BATTLES, BATTLE_TYPE_LABELS, BATTLE_TYPE_COLORS } from "@/data/battles";

function timeLeft(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Fin";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function BattlesPage() {
  const active = MOCK_BATTLES.filter((b) => b.status === "active").length;

  const bottom = (
    <div className="h-full flex items-center px-3 gap-2 text-[11px] text-[var(--muted)]">
      <span><strong className="text-white">{active}</strong> batallas activas</span>
      <span className="opacity-40">·</span>
      <span>Refuerza o declara guerra desde el mapa</span>
    </div>
  );

  return (
    <GameShell bottom={bottom}>
      <div className="h-full overflow-auto scroll-hidden p-3">
        <div className="max-w-3xl mx-auto space-y-2">
          {MOCK_BATTLES.map((battle) => {
            const total = battle.attackerPower + battle.defenderPower || 1;
            const attPct = Math.round((battle.attackerPower / total) * 100);
            const color = BATTLE_TYPE_COLORS[battle.type];
            return (
              <div key={battle.id} className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-3">
                <div className="flex justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: color + "22", color }}>
                        {BATTLE_TYPE_LABELS[battle.type]}
                      </span>
                      <span className="text-[9px] text-green-400">EN CURSO</span>
                    </div>
                    <div className="text-sm font-semibold">{battle.title}</div>
                  </div>
                  <div className="text-right text-[11px] font-mono text-[var(--muted)]">{timeLeft(battle.endsAt)}</div>
                </div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-red-400">{battle.attacker}</span>
                  <span className="text-blue-400">{battle.defender}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-black/40 flex">
                  <div className="h-full bg-red-500" style={{ width: `${attPct}%` }} />
                  <div className="h-full bg-blue-500" style={{ width: `${100 - attPct}%` }} />
                </div>
                <div className="mt-2 flex gap-1.5">
                  <button className="text-[10px] px-2.5 py-1 rounded bg-[var(--accent)]/20 text-[var(--accent)]">Reforzar</button>
                  <Link href="/map" className="text-[10px] px-2.5 py-1 rounded bg-[var(--panel2)] text-[var(--muted)]">Ver mapa</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}
"use client";

import Link from "next/link";
import GameShell from "@/components/GameShell";

export default function DashboardPage() {
  const bottom = (
    <div className="h-full flex items-center gap-2 px-3 overflow-x-auto scroll-hidden">
      <Link href="/map" className="text-[11px] px-3 py-1.5 rounded-md bg-[var(--panel2)] border border-[var(--border)] shrink-0">Mapa</Link>
      <Link href="/ops" className="text-[11px] px-3 py-1.5 rounded-md bg-[var(--panel2)] border border-[var(--border)] shrink-0">Operaciones</Link>
      <Link href="/battles" className="text-[11px] px-3 py-1.5 rounded-md bg-[var(--panel2)] border border-[var(--border)] shrink-0">Batallas</Link>
      <span className="text-[11px] text-[var(--muted)] ml-auto shrink-0">Alex Voss · Espía · Nv 14</span>
    </div>
  );

  return (
    <GameShell bottom={bottom}>
      <div className="h-full overflow-auto scroll-hidden p-3">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            {["Capital|$128.4k", "Intel|67", "Heat|34", "Nivel|14"].map((s) => {
              const [l, v] = s.split("|");
              return (
                <div key={l} className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-2.5">
                  <div className="text-[10px] text-[var(--muted)]">{l}</div>
                  <div className="text-base font-semibold">{v}</div>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-3">
              <div className="text-xs font-semibold mb-2">Operaciones</div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between"><span>Infiltración Apex</span><span className="text-[var(--muted)]">72%</span></div>
                <div className="h-1 bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-[var(--accent)]" style={{ width: "72%" }} /></div>
                <div className="flex justify-between pt-1"><span>Hack cámaras Valencia</span><span className="text-[var(--muted)]">40%</span></div>
                <div className="h-1 bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-[var(--accent)]" style={{ width: "40%" }} /></div>
              </div>
              <Link href="/ops" className="block text-center text-[11px] text-[var(--accent)] mt-3">Centro de ops →</Link>
            </div>

            <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-3">
              <div className="text-xs font-semibold mb-2">Corporación</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded bg-[var(--accent)]/20 border border-[var(--accent)]/40 flex items-center justify-center text-[10px] font-bold text-[var(--accent)]">NX</div>
                <div>
                  <div className="text-sm font-medium">Nexus Holdings</div>
                  <div className="text-[10px] text-[var(--muted)]">#7 · 48 miembros</div>
                </div>
              </div>
              <div className="text-[11px] space-y-0.5">
                <div className="flex justify-between"><span className="text-[var(--muted)]">Control</span><span>18%</span></div>
                <div className="flex justify-between"><span className="text-[var(--muted)]">Caja</span><span>$2.4M</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
}
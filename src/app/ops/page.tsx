"use client";

import { useState } from "react";
import GameShell from "@/components/GameShell";
import {
  MOCK_IDENTITIES,
  MOCK_INTEL,
  HACK_TARGETS,
  heatLabel,
  type CoverIdentity,
} from "@/data/spy";

type Tab = "identities" | "intel" | "hack" | "cover";

export default function OpsPage() {
  const [tab, setTab] = useState<Tab>("identities");
  const [identities, setIdentities] = useState(MOCK_IDENTITIES);
  const [intel, setIntel] = useState(MOCK_INTEL);
  const [selectedHack, setSelectedHack] = useState<string | null>(null);
  const [hackLog, setHackLog] = useState<string[]>([]);
  const [hacking, setHacking] = useState(false);

  function eraseFootprints(id: string) {
    setIdentities((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, heat: Math.max(0, i.heat - 25), lastUsedAt: new Date().toISOString().slice(0, 10) }
          : i
      )
    );
  }

  function burnIdentity(id: string) {
    setIdentities((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "burned" as const, heat: 100 } : i))
    );
  }

  function createIdentity() {
    const names = ["Marco Ruiz", "Sofia Chen", "David Okonkwo", "Anna Petrov", "Luis Navarro"];
    const covers = ["Abogado corporativo", "Ingeniero de sistemas", "Trader", "Fotógrafa", "Gestor de fondos"];
    const locs = ["Madrid", "París", "Berlín", "Nueva York", "Singapur"];
    const newId: CoverIdentity = {
      id: "id" + Date.now(),
      name: names[Math.floor(Math.random() * names.length)],
      cover: covers[Math.floor(Math.random() * covers.length)],
      location: locs[Math.floor(Math.random() * locs.length)],
      heat: 5,
      status: "active",
      createdAt: new Date().toISOString().slice(0, 10),
      lastUsedAt: new Date().toISOString().slice(0, 10),
    };
    setIdentities((prev) => [newId, ...prev]);
  }

  function startHack(targetId: string) {
    const target = HACK_TARGETS.find((t) => t.id === targetId);
    if (!target || hacking) return;
    setSelectedHack(targetId);
    setHacking(true);
    setHackLog([]);
    const steps = [
      "> conectando proxy...",
      "> IP enmascarada",
      `> escaneando ${target.name}...`,
      "> vulnerabilidad encontrada",
      "> escalando privilegios...",
      target.difficulty >= 7 ? "> firewall · mitigando..." : "> acceso silencioso",
      "> extrayendo payload...",
      "> limpiando logs...",
      `> DONE · ${target.reward}`,
    ];
    let i = 0;
    const interval = setInterval(() => {
      setHackLog((prev) => [...prev, steps[i]]);
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setHacking(false);
        setIdentities((prev) => {
          const active = prev.filter((x) => x.status === "active");
          if (!active.length) return prev;
          const victim = active[Math.floor(Math.random() * active.length)];
          return prev.map((x) =>
            x.id === victim.id ? { ...x, heat: Math.min(100, x.heat + 8 + target.difficulty) } : x
          );
        });
      }
    }, 400);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "identities", label: "Identidades" },
    { id: "intel", label: "Intel" },
    { id: "hack", label: "Hackeos" },
    { id: "cover", label: "Huellas" },
  ];

  const bottom = (
    <div className="h-full flex items-center gap-2 px-3 overflow-x-auto scroll-hidden">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`text-[11px] px-3 py-1.5 rounded-md shrink-0 ${
            tab === t.id
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--panel2)] text-[var(--muted)] border border-[var(--border)]"
          }`}
        >
          {t.label}
        </button>
      ))}
      {tab === "identities" && (
        <button
          onClick={createIdentity}
          className="ml-auto text-[11px] px-3 py-1.5 rounded-md bg-[var(--panel2)] border border-[var(--border)] shrink-0"
        >
          + Nueva identidad
        </button>
      )}
    </div>
  );

  return (
    <GameShell bottom={bottom}>
      <div className="h-full overflow-auto scroll-hidden p-3">
        {tab === "identities" && (
          <div className="max-w-2xl mx-auto space-y-2">
            {identities.map((id) => {
              const h = heatLabel(id.heat);
              return (
                <div
                  key={id.id}
                  className={`border rounded-lg p-3 ${
                    id.status === "burned"
                      ? "border-red-500/40 bg-red-500/5 opacity-60"
                      : "border-[var(--border)] bg-[var(--panel)]"
                  }`}
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{id.name}</div>
                      <div className="text-[11px] text-[var(--muted)]">{id.cover} · {id.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium" style={{ color: h.color }}>
                        {h.text} ({id.heat})
                      </div>
                      <div className="w-16 h-1 bg-black/40 rounded-full mt-1 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${id.heat}%`, backgroundColor: h.color }} />
                      </div>
                    </div>
                  </div>
                  {id.status === "active" && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => eraseFootprints(id.id)} className="text-[10px] px-2 py-1 rounded bg-[var(--panel2)]">
                        Borrar huellas
                      </button>
                      <button onClick={() => burnIdentity(id.id)} className="text-[10px] px-2 py-1 rounded bg-red-500/15 text-red-400">
                        Quemar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "intel" && (
          <div className="max-w-2xl mx-auto space-y-2">
            {intel.map((r) => (
              <div key={r.id} className="border border-[var(--border)] bg-[var(--panel)] rounded-lg p-3">
                <div className="flex justify-between gap-2">
                  <div className="text-sm font-medium">{r.title}</div>
                  <span className="text-[10px] text-[var(--muted)] shrink-0">{r.rarity}</span>
                </div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">Fuente: {r.source}</div>
                <p className="text-xs text-zinc-300 mt-2">{r.content}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-[var(--muted)]">
                  <span>Estado: {r.status}</span>
                  {r.reward && <span className="text-green-400">+${r.reward}</span>}
                  {r.status === "draft" && (
                    <button
                      onClick={() => setIntel((p) => p.map((x) => (x.id === r.id ? { ...x, status: "sent" } : x)))}
                      className="ml-auto bg-[var(--accent)] text-white px-2 py-1 rounded"
                    >
                      Enviar al jefe
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "hack" && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
            <div className="space-y-2 overflow-auto scroll-hidden">
              {HACK_TARGETS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => startHack(t.id)}
                  disabled={hacking}
                  className={`w-full text-left border rounded-lg p-3 ${
                    selectedHack === t.id ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-[var(--border)] bg-[var(--panel)]"
                  } ${hacking ? "opacity-50" : ""}`}
                >
                  <div className="flex justify-between text-sm font-medium">
                    <span>{t.name}</span>
                    <span className="text-[10px] text-[var(--muted)]">{t.difficulty}/10</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] mt-1">{t.description}</p>
                </button>
              ))}
            </div>
            <div className="bg-black border border-[var(--border)] rounded-lg p-3 font-mono text-[11px] overflow-auto scroll-hidden min-h-[200px]">
              <div className="text-green-500/70 mb-2">// terminal</div>
              {hackLog.length === 0 && <div className="text-zinc-600">Selecciona objetivo...</div>}
              {hackLog.map((line, i) => (
                <div key={i} className="text-green-400/90">{line}</div>
              ))}
              {hacking && <div className="text-green-500 animate-pulse">_</div>}
            </div>
          </div>
        )}

        {tab === "cover" && (
          <div className="max-w-md mx-auto space-y-2">
            <p className="text-[11px] text-[var(--muted)] mb-2">
              Si no limpias el heat, te descubren. Quemar corta el rastro pero pierdes la identidad.
            </p>
            {identities
              .filter((i) => i.status === "active")
              .map((id) => {
                const h = heatLabel(id.heat);
                return (
                  <div key={id.id} className="flex items-center justify-between border border-[var(--border)] bg-[var(--panel)] rounded-lg p-3">
                    <div>
                      <div className="text-sm font-medium">{id.name}</div>
                      <div className="text-[10px]" style={{ color: h.color }}>Heat {id.heat}</div>
                    </div>
                    <button onClick={() => eraseFootprints(id.id)} className="text-[11px] px-3 py-1.5 rounded bg-[var(--panel2)]">
                      Limpiar
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </GameShell>
  );
}
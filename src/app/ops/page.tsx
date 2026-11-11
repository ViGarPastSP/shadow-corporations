"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MOCK_IDENTITIES,
  MOCK_INTEL,
  HACK_TARGETS,
  heatLabel,
  type CoverIdentity,
  type IntelReport,
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
    const covers = [
      "Abogado corporativo",
      "Ingeniero de sistemas",
      "Trader independiente",
      "Fotógrafa de prensa",
      "Gestor de fondos",
    ];
    const locs = ["Madrid", "París", "Berlín", "Nueva York", "Singapur"];
    const n = names[Math.floor(Math.random() * names.length)];
    const c = covers[Math.floor(Math.random() * covers.length)];
    const l = locs[Math.floor(Math.random() * locs.length)];
    const newId: CoverIdentity = {
      id: "id" + Date.now(),
      name: n,
      cover: c,
      location: l,
      heat: 5,
      status: "active",
      createdAt: new Date().toISOString().slice(0, 10),
      lastUsedAt: new Date().toISOString().slice(0, 10),
    };
    setIdentities((prev) => [newId, ...prev]);
  }

  function sendToBoss(reportId: string) {
    setIntel((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "sent" as const } : r))
    );
  }

  function startHack(targetId: string) {
    const target = HACK_TARGETS.find((t) => t.id === targetId);
    if (!target) return;
    setSelectedHack(targetId);
    setHacking(true);
    setHackLog([]);
    const steps = [
      `> conectando a nodo proxy...`,
      `> proxy OK · IP enmascarada`,
      `> escaneando ${target.name}...`,
      `> vulnerabilidad encontrada (CVE lateral)`,
      `> escalando privilegios...`,
      target.difficulty >= 7 ? `> firewall detectó anomalía · mitigando...` : `> acceso silencioso`,
      `> extrayendo payload...`,
      `> limpiando logs remotos...`,
      `> DONE · ${target.reward}`,
    ];
    let i = 0;
    const interval = setInterval(() => {
      setHackLog((prev) => [...prev, steps[i]]);
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setHacking(false);
        // raise heat on a random active identity
        setIdentities((prev) => {
          const active = prev.filter((x) => x.status === "active");
          if (!active.length) return prev;
          const victim = active[Math.floor(Math.random() * active.length)];
          return prev.map((x) =>
            x.id === victim.id
              ? { ...x, heat: Math.min(100, x.heat + 8 + target.difficulty) }
              : x
          );
        });
      }
    }, 450);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "identities", label: "Identidades" },
    { id: "intel", label: "Intel → Jefe" },
    { id: "hack", label: "Hackeos" },
    { id: "cover", label: "Borrar huellas" },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <header className="border-b border-border bg-surface shrink-0">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
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
              <Link href="/ops" className="px-2.5 py-1 rounded bg-surface2 text-white">Operaciones</Link>
              <Link href="/battles" className="px-2.5 py-1 rounded text-muted hover:text-white">Batallas</Link>
            </nav>
          </div>
          <span className="text-[11px] text-muted">Módulo de espionaje</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-40 border-r border-border bg-surface p-2 shrink-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full text-left text-xs px-2.5 py-2 rounded-md mb-0.5 transition ${
                tab === t.id ? "bg-primary/20 text-primary" : "text-muted hover:text-white hover:bg-surface2"
              }`}
            >
              {t.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 overflow-hidden p-4 scroll-hidden">
          {tab === "identities" && (
            <div className="h-full flex flex-col max-w-3xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="font-semibold">Identidades de cobertura</h1>
                  <p className="text-[11px] text-muted">Si el heat sube demasiado, te descubren. Quema o limpia.</p>
                </div>
                <button
                  onClick={createIdentity}
                  className="text-xs bg-primary hover:bg-primaryHover text-white px-3 py-1.5 rounded-md"
                >
                  + Nueva identidad
                </button>
              </div>
              <div className="flex-1 overflow-auto scroll-hidden space-y-2">
                {identities.map((id) => {
                  const h = heatLabel(id.heat);
                  return (
                    <div
                      key={id.id}
                      className={`border rounded-lg p-3 ${
                        id.status === "burned"
                          ? "border-red-500/40 bg-red-500/5 opacity-60"
                          : "border-border bg-surface"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-sm">{id.name}</div>
                          <div className="text-[11px] text-muted">{id.cover} · {id.location}</div>
                          <div className="text-[10px] text-muted mt-1">
                            Creada {id.createdAt} · Último uso {id.lastUsedAt}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium" style={{ color: h.color }}>
                            {h.text} ({id.heat})
                          </div>
                          <div className="w-20 h-1.5 bg-background rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${id.heat}%`,
                                backgroundColor: h.color,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {id.status === "active" && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => eraseFootprints(id.id)}
                            className="text-[10px] px-2 py-1 rounded bg-surface2 hover:bg-zinc-700"
                          >
                            Borrar huellas (-25 heat)
                          </button>
                          <button
                            onClick={() => burnIdentity(id.id)}
                            className="text-[10px] px-2 py-1 rounded bg-red-500/15 text-red-400 hover:bg-red-500/25"
                          >
                            Quemar identidad
                          </button>
                        </div>
                      )}
                      {id.status === "burned" && (
                        <div className="text-[10px] text-red-400 mt-2">Identidad quemada · no usable</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "intel" && (
            <div className="h-full flex flex-col max-w-3xl">
              <h1 className="font-semibold mb-1">Informes al jefe</h1>
              <p className="text-[11px] text-muted mb-3">
                Consigues info de altos mandos o filtraciones. La envías. Él aprueba, paga o ignora.
              </p>
              <div className="flex-1 overflow-auto scroll-hidden space-y-2">
                {intel.map((r) => (
                  <div key={r.id} className="border border-border bg-surface rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium">{r.title}</div>
                        <div className="text-[10px] text-muted mt-0.5">
                          Fuente: {r.source} · Identidad: {r.identityUsed}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                          r.rarity === "critical"
                            ? "bg-red-500/20 text-red-300"
                            : r.rarity === "high"
                            ? "bg-orange-500/20 text-orange-300"
                            : "bg-zinc-500/20 text-zinc-300"
                        }`}
                      >
                        {r.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{r.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-muted">Estado: {r.status}</span>
                      {r.reward && (
                        <span className="text-[10px] text-green-400">+${r.reward}</span>
                      )}
                      {r.status === "draft" && (
                        <button
                          onClick={() => sendToBoss(r.id)}
                          className="ml-auto text-[10px] bg-primary text-white px-2 py-1 rounded"
                        >
                          Enviar al jefe
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "hack" && (
            <div className="h-full flex flex-col max-w-4xl">
              <h1 className="font-semibold mb-1">Hackeos</h1>
              <p className="text-[11px] text-muted mb-3">
                Cada hackeo sube el heat de una identidad. Limpia huellas o te localizan.
              </p>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-hidden">
                <div className="overflow-auto scroll-hidden space-y-2">
                  {HACK_TARGETS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => !hacking && startHack(t.id)}
                      disabled={hacking}
                      className={`w-full text-left border rounded-lg p-3 transition ${
                        selectedHack === t.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface hover:border-zinc-600"
                      } ${hacking ? "opacity-50" : ""}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-medium">{t.name}</div>
                        <span className="text-[10px] text-muted">Dificultad {t.difficulty}/10</span>
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">{t.type} · {t.location}</div>
                      <p className="text-[11px] text-zinc-400 mt-1">{t.description}</p>
                      <div className="text-[10px] text-primary mt-1">{t.reward}</div>
                    </button>
                  ))}
                </div>
                <div className="bg-black border border-border rounded-lg p-3 font-mono text-[11px] overflow-auto scroll-hidden">
                  <div className="text-green-500/80 mb-2">// terminal de infiltración</div>
                  {hackLog.length === 0 && (
                    <div className="text-zinc-600">Selecciona un objetivo para iniciar...</div>
                  )}
                  {hackLog.map((line, i) => (
                    <div key={i} className="text-green-400/90 leading-5">
                      {line}
                    </div>
                  ))}
                  {hacking && <div className="text-green-500 animate-pulse">_</div>}
                </div>
              </div>
            </div>
          )}

          {tab === "cover" && (
            <div className="h-full max-w-xl">
              <h1 className="font-semibold mb-1">Borrar huellas</h1>
              <p className="text-[11px] text-muted mb-4">
                Cada acción deja rastro. Si no limpias, el heat sube y te pueden descubrir.
                Quemar una identidad la destruye para siempre pero corta el rastro hacia ti.
              </p>
              <div className="space-y-2">
                {identities
                  .filter((i) => i.status === "active")
                  .map((id) => {
                    const h = heatLabel(id.heat);
                    return (
                      <div key={id.id} className="flex items-center justify-between border border-border bg-surface rounded-lg p-3">
                        <div>
                          <div className="text-sm font-medium">{id.name}</div>
                          <div className="text-[10px]" style={{ color: h.color }}>
                            Heat {id.heat} · {h.text}
                          </div>
                        </div>
                        <button
                          onClick={() => eraseFootprints(id.id)}
                          className="text-xs bg-surface2 hover:bg-zinc-700 px-3 py-1.5 rounded-md"
                        >
                          Limpiar rastro
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import {
  Fingerprint,
  FileText,
  Terminal,
  Eraser,
  MapPin,
  Send,
  Skull,
  Plus,
  ShieldAlert,
  Building2,
  Landmark,
  Banknote,
  User,
  Server,
  type LucideIcon,
} from "lucide-react";
import GameShell from "@/components/GameShell";
import { MockTag } from "@/components/ui";
import {
  MOCK_IDENTITIES,
  MOCK_INTEL,
  HACK_TARGETS,
  heatLabel,
  type CoverIdentity,
  type HackTargetType,
  type IntelRarity,
} from "@/data/spy";

type Tab = "identities" | "intel" | "hack" | "cover";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "identities", label: "Identidades", icon: Fingerprint },
  { id: "intel", label: "Intel", icon: FileText },
  { id: "hack", label: "Hackeos", icon: Terminal },
  { id: "cover", label: "Huellas", icon: Eraser },
];

const TARGET_ICON: Record<HackTargetType, LucideIcon> = {
  corporation: Building2,
  government: Landmark,
  bank: Banknote,
  personal: User,
  infra: Server,
};

const RARITY: Record<IntelRarity, { label: string; color: string }> = {
  low: { label: "BAJA", color: "#8a93a5" },
  medium: { label: "MEDIA", color: "#7cb6ff" },
  high: { label: "ALTA", color: "#e0a21a" },
  critical: { label: "CRÍTICA", color: "#ff4d4d" },
};

const INTEL_STATUS: Record<string, string> = {
  draft: "Borrador",
  sent: "Enviado al jefe",
  approved: "Aprobado",
  rejected: "Rechazado",
  paid: "Pagado",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function HeatMeter({ heat }: { heat: number }) {
  const lit = Math.round(heat / 5);
  const color = heatLabel(heat).color;
  return (
    <div className="heat-seg w-[140px]">
      {Array.from({ length: 20 }).map((_, i) => (
        <i key={i} style={i < lit ? { background: color, boxShadow: `0 0 6px ${color}66` } : undefined} />
      ))}
    </div>
  );
}

function Pips({ n, max = 10 }: { n: number; max?: number }) {
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: max }).map((_, i) => (
        <i
          key={i}
          className="block w-[5px] h-2.5 rounded-[1px]"
          style={{ background: i < n ? (n >= 8 ? "var(--accent-hi)" : n >= 5 ? "var(--warn)" : "var(--ok)") : "#1a1e28" }}
        />
      ))}
    </div>
  );
}

export default function OpsPage() {
  const [tab, setTab] = useState<Tab>("identities");
  const [identities, setIdentities] = useState(MOCK_IDENTITIES);
  const [intel, setIntel] = useState(MOCK_INTEL);
  const [selectedHack, setSelectedHack] = useState<string | null>(null);
  const [hackLog, setHackLog] = useState<string[]>([]);
  const [hacking, setHacking] = useState(false);
  const [hackTotal, setHackTotal] = useState(1);

  const active = identities.filter((i) => i.status === "active");
  const avgHeat = active.length ? Math.round(active.reduce((s, i) => s + i.heat, 0) / active.length) : 0;
  const pendingIntel = intel.filter((i) => i.status === "draft").length;
  const danger = active.filter((i) => i.heat >= 70);

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
    setIdentities((prev) => prev.map((i) => (i.id === id ? { ...i, status: "burned" as const, heat: 100 } : i)));
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
      "conectando proxy…",
      "IP enmascarada · ruta: 4 saltos",
      `escaneando ${target.name}…`,
      "vulnerabilidad encontrada",
      "escalando privilegios…",
      target.difficulty >= 7 ? "firewall activo · mitigando…" : "acceso silencioso",
      "extrayendo payload…",
      "limpiando logs…",
      `DONE · ${target.reward}`,
    ];
    setHackTotal(steps.length);
    let i = 0;
    const interval = setInterval(() => {
      const line = steps[i];
      setHackLog((prev) => [...prev, line]);
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setHacking(false);
        setHackLog((prev) => [...prev, "WARN · tu rastro ha aumentado en una de tus identidades"]);
        setIdentities((prev) => {
          const act = prev.filter((x) => x.status === "active");
          if (!act.length) return prev;
          const victim = act[Math.floor(Math.random() * act.length)];
          return prev.map((x) =>
            x.id === victim.id ? { ...x, heat: Math.min(100, x.heat + 8 + target.difficulty) } : x
          );
        });
      }
    }, 400);
  }

  const bottom = (
    <div className="h-full flex items-center gap-2 px-3 overflow-x-auto scroll-hidden">
      {TABS.map((t) => {
        const Icon = t.icon;
        const on = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 h-11 px-4 rounded-lg shrink-0 border font-display text-[15px] tracking-[0.12em] uppercase transition ${
              on
                ? "bg-[var(--accent)]/20 border-[var(--accent)] text-white shadow-[0_0_18px_rgba(200,16,46,.25)]"
                : "bg-[var(--panel)] border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-[var(--border-hi)]"
            }`}
          >
            <Icon size={16} className={on ? "text-[var(--accent-hi)]" : ""} />
            {t.label}
          </button>
        );
      })}
      {tab === "identities" && (
        <button type="button" onClick={createIdentity} className="btn btn-primary ml-auto !h-10 shrink-0">
          <Plus size={14} /> Nueva identidad
        </button>
      )}
    </div>
  );

  return (
    <GameShell bottom={bottom}>
      <div className="h-full overflow-auto scroll-hidden p-3 md:p-5">
        <div className="max-w-5xl mx-auto">
          {/* Cabecera */}
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <div className="hud-head">Centro de operaciones</div>
              <h1 className="font-display text-[34px] leading-none tracking-wide mt-1">
                {TABS.find((t) => t.id === tab)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
              <MockTag>Estado local · sin persistencia</MockTag>
              <span className="hidden sm:inline">Se reinicia al recargar · TODO: guardar en Supabase</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="hud px-3 py-2.5">
              <div className="hud-head">Identidades activas</div>
              <div className="font-display text-[30px] leading-none mt-1">{active.length}</div>
            </div>
            <div className="hud px-3 py-2.5">
              <div className="hud-head">Heat medio</div>
              <div className="font-display text-[30px] leading-none mt-1" style={{ color: heatLabel(avgHeat).color }}>
                {avgHeat}
              </div>
            </div>
            <div className="hud px-3 py-2.5">
              <div className="hud-head">Intel sin enviar</div>
              <div className="font-display text-[30px] leading-none mt-1 text-[var(--gold)]">{pendingIntel}</div>
            </div>
          </div>

          {danger.length > 0 && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-3 py-2.5">
              <ShieldAlert size={16} className="text-[var(--accent-hi)] mt-0.5 shrink-0" />
              <div className="text-[12px] leading-relaxed">
                <strong className="text-white">Riesgo de exposición:</strong>{" "}
                <span className="text-[var(--muted)]">
                  {danger.map((d) => d.name).join(", ")} {danger.length > 1 ? "superan" : "supera"} el umbral de heat. Borra
                  huellas o quema la identidad antes de que te descubran.
                </span>
              </div>
            </div>
          )}

          {/* IDENTIDADES */}
          {tab === "identities" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {identities.map((id) => {
                const h = heatLabel(id.heat);
                const burned = id.status === "burned";
                return (
                  <div key={id.id} className={`hud relative p-3.5 ${burned ? "opacity-60" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-display text-[18px] tracking-wide border-2 bg-black/40"
                        style={{ borderColor: h.color, boxShadow: burned ? "none" : `0 0 14px ${h.color}44` }}
                      >
                        {initials(id.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-display text-[20px] leading-none tracking-wide truncate">{id.name}</div>
                        <div className="text-[11px] text-[var(--muted)] mt-1 flex items-center gap-1.5 truncate">
                          {id.cover}
                          <span className="opacity-40">·</span>
                          <MapPin size={11} /> {id.location}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-[11px]" style={{ color: h.color }}>
                          {h.text.toUpperCase()} · {id.heat}
                        </div>
                        <div className="mt-1.5 flex justify-end">
                          <HeatMeter heat={id.heat} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-[10px] text-[var(--dim)] font-mono">
                      <span>Creada {id.createdAt}</span>
                      <span>Último uso {id.lastUsedAt}</span>
                    </div>
                    {burned ? (
                      <div className="stamp">QUEMADA</div>
                    ) : (
                      <div className="flex gap-2 mt-3">
                        <button type="button" onClick={() => eraseFootprints(id.id)} className="btn flex-1">
                          <Eraser size={13} /> Borrar huellas
                        </button>
                        <button type="button" onClick={() => burnIdentity(id.id)} className="btn btn-danger">
                          <Skull size={13} /> Quemar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* INTEL */}
          {tab === "intel" && (
            <div className="space-y-3">
              {intel.map((r) => {
                const ra = RARITY[r.rarity];
                return (
                  <div key={r.id} className="hud relative p-4 pl-5 overflow-hidden">
                    <i className="absolute left-0 top-0 bottom-0 w-1" style={{ background: ra.color }} />
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border tracking-wider"
                            style={{ color: ra.color, borderColor: ra.color + "66", background: ra.color + "14" }}
                          >
                            CLASIF. {ra.label}
                          </span>
                          <span className="text-[10px] text-[var(--dim)] font-mono">{r.createdAt}</span>
                        </div>
                        <div className="font-display text-[22px] leading-tight tracking-wide">{r.title}</div>
                      </div>
                      {r.reward && (
                        <div className="text-right shrink-0">
                          <div className="hud-head">Pago</div>
                          <div className="font-mono text-[16px] text-[var(--gold)]">${r.reward.toLocaleString("es-ES")}</div>
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--muted)] mt-1">
                      Fuente: <span className="text-[var(--text)]">{r.source}</span> · Identidad:{" "}
                      <span className="text-[var(--text)]">{r.identityUsed}</span>
                    </div>
                    <p className="text-[13px] text-zinc-300 mt-3 leading-relaxed border-l border-[var(--border-hi)] pl-3">
                      {r.content}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="tag">{INTEL_STATUS[r.status] ?? r.status}</span>
                      {r.status === "draft" && (
                        <button
                          type="button"
                          onClick={() => setIntel((p) => p.map((x) => (x.id === r.id ? { ...x, status: "sent" } : x)))}
                          className="btn btn-primary ml-auto"
                        >
                          <Send size={13} /> Enviar al jefe
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="text-[11px] text-[var(--dim)] flex items-center gap-2">
                <span className="tag tag-soon">TODO</span> Recoger intel concreta de altos mandos aún no está implementado: estos informes son de demostración.
              </div>
            </div>
          )}

          {/* HACKEOS */}
          {tab === "hack" && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-3">
              <div className="space-y-2">
                {HACK_TARGETS.map((t) => {
                  const Icon = TARGET_ICON[t.type];
                  const sel = selectedHack === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => startHack(t.id)}
                      disabled={hacking}
                      className={`hud w-full text-left p-3 transition ${
                        sel ? "!border-[var(--accent)] shadow-[0_0_18px_rgba(200,16,46,.2)]" : "hover:!border-[var(--border-hi)]"
                      } ${hacking && !sel ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-black/40 border border-[var(--border)] flex items-center justify-center shrink-0">
                          <Icon size={15} className="text-[var(--muted)]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-display text-[17px] leading-none tracking-wide truncate">{t.name}</div>
                          <div className="text-[10px] text-[var(--dim)] uppercase tracking-wider mt-1">
                            {t.type} · {t.location}
                          </div>
                        </div>
                        <Pips n={t.difficulty} />
                      </div>
                      <p className="text-[11px] text-[var(--muted)] mt-2 leading-relaxed">{t.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="term flex flex-col min-h-[300px] md:min-h-[420px]">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#16251c]">
                  <i className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] block" />
                  <i className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] block" />
                  <i className="w-2.5 h-2.5 rounded-full bg-[#27c93f] block" />
                  <span className="ml-2 text-[10px] text-[#4d7a60]">shadow@ops: ~/intrusion</span>
                  {hacking && (
                    <span className="ml-auto text-[10px] text-[#7cffb2]">
                      {Math.round((hackLog.length / hackTotal) * 100)}%
                    </span>
                  )}
                </div>
                {hacking && (
                  <div className="h-[2px] bg-[#0b1710]">
                    <i className="block h-full bg-[#7cffb2] transition-all" style={{ width: `${(hackLog.length / hackTotal) * 100}%` }} />
                  </div>
                )}
                <div className="flex-1 p-3 text-[12px] leading-[1.7] overflow-auto scroll-hidden">
                  {hackLog.length === 0 && !hacking && (
                    <div className="text-[#4d7a60]">
                      <span className="text-[#7cffb2]">$</span> selecciona un objetivo para iniciar la intrusión<span className="caret ml-1" />
                    </div>
                  )}
                  {hackLog.map((line, i) => {
                    const done = line.startsWith("DONE");
                    const warn = line.startsWith("WARN");
                    return (
                      <div
                        key={i}
                        className={done ? "text-[#d4a24c] font-bold" : warn ? "text-[#ff6a6a]" : "text-[#7cffb2]/90"}
                      >
                        <span className="text-[#4d7a60]">{done || warn ? "!" : ">"}</span> {line}
                      </div>
                    );
                  })}
                  {hacking && <span className="caret" />}
                </div>
              </div>
            </div>
          )}

          {/* HUELLAS */}
          {tab === "cover" && (
            <div className="max-w-xl">
              <p className="text-[12px] text-[var(--muted)] mb-3 leading-relaxed">
                Cada operación deja huellas. Si no limpias el heat, te descubren. Quemar corta el rastro, pero pierdes la identidad.
              </p>
              <div className="space-y-2">
                {active.length === 0 && <div className="text-[12px] text-[var(--dim)]">No tienes identidades activas.</div>}
                {active.map((id) => {
                  const h = heatLabel(id.heat);
                  return (
                    <div key={id.id} className="hud flex items-center gap-3 p-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-display text-[18px] tracking-wide leading-none">{id.name}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <HeatMeter heat={id.heat} />
                          <span className="font-mono text-[11px]" style={{ color: h.color }}>
                            {id.heat}
                          </span>
                        </div>
                      </div>
                      <button type="button" onClick={() => eraseFootprints(id.id)} className="btn">
                        <Eraser size={13} /> Limpiar
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
}

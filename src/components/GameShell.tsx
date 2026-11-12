"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  Swords,
  VenetianMask,
  Building2,
  Wallet,
  Eye,
  Flame,
  Zap,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { LogoMark, WorldTicker } from "@/components/ui";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/map", label: "Mapa", icon: Globe },
  { href: "/ops", label: "Operaciones", icon: VenetianMask },
  { href: "/battles", label: "Batallas", icon: Swords },
  { href: "/dashboard", label: "Sede", icon: Building2 },
];

function Res({
  icon: Icon,
  value,
  label,
  color,
  extra,
  hideSm,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
  extra?: React.ReactNode;
  hideSm?: boolean;
}) {
  return (
    <div className={`res ${hideSm ? "hidden md:inline-flex" : ""}`} title={`${label} · dato simulado`}>
      <Icon size={14} color={color} strokeWidth={2.2} />
      <span>{value}</span>
      {extra}
    </div>
  );
}

export default function GameShell({
  children,
  bottom,
}: {
  children: React.ReactNode;
  bottom?: React.ReactNode;
}) {
  const path = usePathname() ?? "";

  return (
    <div className="game-shell">
      {/* BARRA SUPERIOR — fija */}
      <header className="game-top flex items-center gap-2 px-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="ShadowCorps">
          <LogoMark size={30} />
          <span className="hidden sm:block font-display text-[23px] leading-none tracking-[0.1em] font-bold">
            SHADOW<span className="text-[var(--accent-hi)]">CORPS</span>
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 ml-1 sm:ml-5">
          {NAV.map((n) => {
            const active = path === n.href || path.startsWith(n.href + "/");
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                title={n.label}
                className={`relative flex items-center gap-1.5 h-[34px] px-2.5 sm:px-3 rounded-md text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? "bg-[var(--panel3)] text-white"
                    : "text-[var(--muted)] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={15} strokeWidth={2.2} className={active ? "text-[var(--accent-hi)]" : ""} />
                <span className="hidden md:inline">{n.label}</span>
                {active && (
                  <span className="absolute left-2 right-2 -bottom-[9px] h-[2px] bg-[var(--accent-hi)] shadow-[0_0_10px_var(--accent-hi)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-1.5 overflow-x-auto scroll-hidden">
          <Res icon={Wallet} value="128,4k" label="Capital" color="#d4a24c" />
          <Res icon={Eye} value="67" label="Intel" color="#7cb6ff" />
          <Res icon={Flame} value="34" label="Heat" color="#ff6a3d" hideSm />
          <Res
            icon={Zap}
            value="14/20"
            label="Energía"
            color="#ffd25a"
            hideSm
            extra={
              <span className="w-10 h-1 rounded bg-[#1a1e28] overflow-hidden">
                <i className="block h-full bg-[#ffd25a]" style={{ width: "70%" }} />
              </span>
            }
          />
        </div>

        <button
          type="button"
          className="relative w-8 h-8 shrink-0 rounded-md border border-[var(--border)] bg-[var(--panel2)] flex items-center justify-center text-[var(--muted)] hover:text-white"
          title="Notificaciones (próximamente)"
          aria-label="Notificaciones"
        >
          <Bell size={15} />
          <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent-hi)]" />
        </button>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 shrink-0 pl-1"
          title="Agente · Nv 14 (simulado)"
        >
          <span className="w-8 h-8 rounded-full bg-[var(--panel3)] border-2 border-[var(--accent)] flex items-center justify-center font-display text-[13px] font-bold tracking-wide">
            AV
          </span>
        </Link>
      </header>

      {/* CENTRO */}
      <div className="game-main">{children}</div>

      {/* BARRA INFERIOR — fija */}
      <footer className="game-bottom">{bottom ?? <WorldTicker />}</footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/map", label: "Mapa" },
  { href: "/ops", label: "Ops" },
  { href: "/battles", label: "Batallas" },
  { href: "/dashboard", label: "HQ" },
];

export default function GameShell({
  children,
  bottom,
}: {
  children: React.ReactNode;
  bottom?: React.ReactNode;
}) {
  const path = usePathname();

  return (
    <div className="game-shell">
      {/* TOP BAR — sticky */}
      <header className="game-top flex items-center px-3 gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="ShadowCorps" className="h-7 w-auto" />
        </Link>

        <nav className="hidden sm:flex items-center gap-0.5 ml-2">
          {NAV.map((n) => {
            const active = path === n.href || path.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  active
                    ? "bg-[var(--panel2)] text-white"
                    : "text-[var(--muted)] hover:text-white"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Player stats like Warera top-right */}
        <div className="flex items-center gap-1.5 overflow-x-auto scroll-hidden">
          <span className="stat-pill">💰 <strong>128.4k</strong></span>
          <span className="stat-pill">👁 <strong>67</strong></span>
          <span className="stat-pill">🔥 <strong>34</strong></span>
          <span className="stat-pill hidden md:inline-flex">⚡ <strong>14</strong></span>
        </div>

        <Link
          href="/dashboard"
          className="ml-1 w-8 h-8 rounded-full bg-[var(--panel2)] border border-[var(--border)] flex items-center justify-center text-[11px] font-semibold shrink-0"
        >
          AV
        </Link>
      </header>

      {/* MAIN */}
      <div className="game-main">{children}</div>

      {/* BOTTOM BAR — sticky */}
      <footer className="game-bottom">
        {bottom ?? (
          <div className="h-full flex items-center px-3 gap-2 overflow-x-auto scroll-hidden">
            <span className="text-[11px] text-[var(--muted)]">Selecciona un país en el mapa</span>
          </div>
        )}
      </footer>
    </div>
  );
}
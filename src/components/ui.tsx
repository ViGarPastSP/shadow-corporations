import { TICKER } from "@/data/simworld";

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0 drop-shadow-[0_0_8px_rgba(200,16,46,0.45)]"
    >
      <path
        d="M16 1.8 28.6 7v10.2c0 6.6-5.4 11.6-12.6 13.2C8.8 28.8 3.4 23.8 3.4 17.2V7z"
        fill="#0b0d12"
        stroke="#c8102e"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M11 14c0-4.5 2-6.6 5-6.6s5 2.1 5 6.6z" fill="#e8eaf0" />
      <ellipse cx="16" cy="14.4" rx="8.6" ry="2" fill="#e8eaf0" />
      <rect x="11.1" y="11.7" width="9.8" height="1.7" fill="#c8102e" />
      <circle cx="13.4" cy="20.2" r="1.15" fill="#ff2f4d" />
      <circle cx="18.6" cy="20.2" r="1.15" fill="#ff2f4d" />
      <path
        d="M9.5 26.2 16 22.8l6.5 3.4"
        stroke="#3a4050"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Marca visible de dato de demostración (no inventamos que esté "pulido"). */
export function MockTag({ children = "SIMULADO" }: { children?: React.ReactNode }) {
  return (
    <span className="tag tag-mock" title="Dato de demostración: aún no viene del backend">
      {children}
    </span>
  );
}

export function SoonTag() {
  return (
    <span className="tag tag-soon" title="Funcionalidad pendiente de implementar">
      Próximamente
    </span>
  );
}

export function StatBar({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "good" | "bad" | "neutral" | "gold";
}) {
  const color =
    tone === "good"
      ? "var(--ok)"
      : tone === "bad"
      ? "var(--accent-hi)"
      : tone === "gold"
      ? "var(--gold)"
      : "#7c8aa5";
  const v = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">{label}</span>
        <span className="font-mono text-[11px] text-[var(--text)]">{v}</span>
      </div>
      <div className="sbar">
        <i style={{ width: `${v}%`, background: color }} />
      </div>
    </div>
  );
}

export function WorldTicker() {
  const row = (key: string) => (
    <div key={key} className="flex items-center gap-10 pr-10 shrink-0">
      {TICKER.map((t, i) => (
        <span
          key={i}
          className="flex items-center gap-2 text-[12px] text-[var(--muted)] whitespace-nowrap"
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }}
          />
          {t.text}
        </span>
      ))}
    </div>
  );
  return (
    <div className="h-full flex items-center">
      <div className="shrink-0 px-4 h-full flex flex-col justify-center gap-1 border-r border-[var(--border)] bg-black/30">
        <span className="font-display text-[16px] tracking-[0.16em] text-[var(--accent-hi)] leading-none">
          MUNDO EN VIVO
        </span>
        <MockTag />
      </div>
      <div className="flex-1 overflow-hidden ticker-mask">
        <div className="ticker-track">
          {row("a")}
          {row("b")}
        </div>
      </div>
    </div>
  );
}

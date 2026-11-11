import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary/20 border border-primary/40 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-sm tracking-tighter">SC</span>
              </div>
              <span className="font-semibold hidden sm:inline tracking-tight">ShadowCorps</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1 text-sm">
              <Link href="/dashboard" className="px-3 py-1.5 rounded-md bg-surface2 text-white">
                Dashboard
              </Link>
              <Link href="#" className="px-3 py-1.5 rounded-md text-muted hover:text-white transition">
                Corporación
              </Link>
              <Link href="#" className="px-3 py-1.5 rounded-md text-muted hover:text-white transition">
                Operaciones
              </Link>
              <Link href="#" className="px-3 py-1.5 rounded-md text-muted hover:text-white transition">
                Ciudad
              </Link>
              <Link href="#" className="px-3 py-1.5 rounded-md text-muted hover:text-white transition">
                Rankings
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">Alex Voss</div>
              <div className="text-xs text-muted">Director de Operaciones</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-surface2 border border-border flex items-center justify-center text-sm font-medium">
              AV
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Capital" value="$128.400" sub="+2.3% hoy" />
          <StatCard label="Influencia" value="1.842" sub="Nivel 14" />
          <StatCard label="Información" value="67" sub="3 informes activos" />
          <StatCard label="Riesgo" value="Bajo" sub="Ninguna investigación" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Operaciones activas</h2>
                <button className="text-sm text-primary hover:underline">Nueva operación</button>
              </div>
              <div className="space-y-3">
                <OperationRow
                  title="Filtrar datos de NovaTech"
                  type="Espionaje"
                  progress={72}
                  status="En curso"
                />
                <OperationRow
                  title="Soborno al concejal de Districto 4"
                  type="Lobby"
                  progress={40}
                  status="En curso"
                />
                <OperationRow
                  title="Sabotaje de línea de producción"
                  type="Sabotaje"
                  progress={15}
                  status="Preparando"
                />
              </div>
            </section>

            <section className="bg-surface border border-border rounded-xl p-5">
              <h2 className="font-semibold mb-4">Actividad reciente</h2>
              <div className="space-y-3 text-sm">
                <ActivityItem time="hace 12 min" text="Tu corporación ganó +4% de control en Distrito Norte" />
                <ActivityItem time="hace 1 h" text="Informe de inteligencia recibido: movimientos de Apex Dynamics" />
                <ActivityItem time="hace 3 h" text="Nueva oferta de alianza de Black Ledger" />
                <ActivityItem time="hace 5 h" text="Completaste la misión diaria: Reunión de accionistas" />
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <section className="bg-surface border border-border rounded-xl p-5">
              <h2 className="font-semibold mb-3">Tu Corporación</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary">
                  NX
                </div>
                <div>
                  <div className="font-medium">Nexus Holdings</div>
                  <div className="text-xs text-muted">Rango #7 · 48 miembros</div>
                </div>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Control de ciudad</span>
                  <span>18%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Tesorería</span>
                  <span>$2.4M</span>
                </div>
              </div>
            </section>

            <section className="bg-surface border border-border rounded-xl p-5">
              <h2 className="font-semibold mb-3">Misiones diarias</h2>
              <div className="space-y-3">
                <MissionItem title="Completar 1 operación" done />
                <MissionItem title="Gastar 50 de influencia" />
                <MissionItem title="Revisar informe de inteligencia" />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-muted mt-1">{sub}</div>
    </div>
  );
}

function OperationRow({
  title,
  type,
  progress,
  status,
}: {
  title: string;
  type: string;
  progress: number;
  status: string;
}) {
  return (
    <div className="bg-surface2 border border-border rounded-lg p-3">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted">{type} · {status}</div>
        </div>
        <span className="text-xs text-muted">{progress}%</span>
      </div>
      <div className="h-1.5 bg-background rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ActivityItem({ time, text }: { time: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="text-xs text-muted w-20 shrink-0">{time}</div>
      <div className="text-sm text-zinc-300">{text}</div>
    </div>
  );
}

function MissionItem({ title, done }: { title: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
          done
            ? "bg-success border-success text-white"
            : "border-border"
        }`}
      >
        {done ? "✓" : ""}
      </div>
      <span className={`text-sm ${done ? "text-muted line-through" : ""}`}>{title}</span>
    </div>
  );
}
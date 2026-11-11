import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      <header className="border-b border-border bg-surface shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/20 border border-primary/40 rounded flex items-center justify-center">
                <span className="text-primary font-bold text-xs">SC</span>
              </div>
              <span className="font-semibold text-sm tracking-tight hidden sm:inline">ShadowCorps</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1 text-xs">
              <Link href="/dashboard" className="px-2.5 py-1 rounded bg-surface2 text-white">Dashboard</Link>
              <Link href="/map" className="px-2.5 py-1 rounded text-muted hover:text-white">Mapa</Link>
              <Link href="/ops" className="px-2.5 py-1 rounded text-muted hover:text-white">Operaciones</Link>
              <Link href="/battles" className="px-2.5 py-1 rounded text-muted hover:text-white">Batallas</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium">Alex Voss</div>
              <div className="text-[10px] text-muted">Espía · Nivel 14</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface2 border border-border flex items-center justify-center text-xs font-medium">
              AV
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto scroll-hidden max-w-7xl w-full mx-auto px-4 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <StatCard label="Capital" value="$128.400" sub="+2.3% hoy" />
          <StatCard label="Influencia" value="1.842" sub="Nivel 14" />
          <StatCard label="Heat global" value="34" sub="3 identidades activas" />
          <StatCard label="Intel pendiente" value="1" sub="Esperando al jefe" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <section className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-sm">Operaciones activas</h2>
                <Link href="/ops" className="text-xs text-primary hover:underline">Centro de ops →</Link>
              </div>
              <div className="space-y-2">
                <OpRow title="Infiltración · Director de logística Apex" type="Espía" progress={72} />
                <OpRow title="Hack · Cámaras puerto Valencia" type="Hackeo" progress={40} />
                <OpRow title="Limpiar rastro · identidad Robert Hale" type="Cover" progress={15} />
              </div>
            </section>

            <section className="bg-surface border border-border rounded-xl p-4">
              <h2 className="font-semibold text-sm mb-3">Actividad reciente</h2>
              <div className="space-y-2 text-xs">
                <div className="flex gap-3"><span className="text-muted w-16 shrink-0">hace 12m</span><span>Intel enviada al jefe: movimientos Apex en Valencia</span></div>
                <div className="flex gap-3"><span className="text-muted w-16 shrink-0">hace 1h</span><span>Heat de Elena Varga subió a 42 tras reunión</span></div>
                <div className="flex gap-3"><span className="text-muted w-16 shrink-0">hace 3h</span><span>Nueva batalla territorial en Norte de España</span></div>
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <section className="bg-surface border border-border rounded-xl p-4">
              <h2 className="font-semibold text-sm mb-2">Accesos rápidos</h2>
              <div className="grid grid-cols-1 gap-1.5">
                <Link href="/ops" className="text-xs bg-surface2 hover:bg-zinc-700 rounded-md px-3 py-2">Identidades y heat</Link>
                <Link href="/ops" className="text-xs bg-surface2 hover:bg-zinc-700 rounded-md px-3 py-2">Hackeos</Link>
                <Link href="/map" className="text-xs bg-surface2 hover:bg-zinc-700 rounded-md px-3 py-2">Mapa mundial</Link>
                <Link href="/battles" className="text-xs bg-surface2 hover:bg-zinc-700 rounded-md px-3 py-2">Batallas activas</Link>
              </div>
            </section>

            <section className="bg-surface border border-border rounded-xl p-4">
              <h2 className="font-semibold text-sm mb-2">Tu corporación</h2>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary text-xs">NX</div>
                <div>
                  <div className="text-sm font-medium">Nexus Holdings</div>
                  <div className="text-[10px] text-muted">Rango #7 · 48 miembros</div>
                </div>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between"><span className="text-muted">Control</span><span>18%</span></div>
                <div className="flex justify-between"><span className="text-muted">Tesorería</span><span>$2.4M</span></div>
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
    <div className="bg-surface border border-border rounded-xl p-3">
      <div className="text-[10px] text-muted mb-0.5">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-[10px] text-muted mt-0.5">{sub}</div>
    </div>
  );
}

function OpRow({ title, type, progress }: { title: string; type: string; progress: number }) {
  return (
    <div className="bg-surface2 border border-border rounded-lg p-2.5">
      <div className="flex justify-between gap-2 mb-1.5">
        <div>
          <div className="text-xs font-medium">{title}</div>
          <div className="text-[10px] text-muted">{type}</div>
        </div>
        <span className="text-[10px] text-muted">{progress}%</span>
      </div>
      <div className="h-1 bg-background rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
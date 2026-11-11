import Link from "next/link";

export default function HomePage() {
  return (
    <main className="h-screen overflow-hidden flex flex-col">
      <header className="border-b border-border bg-surface/80 backdrop-blur-md shrink-0">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/20 border border-primary/40 rounded flex items-center justify-center">
              <span className="text-primary font-bold text-xs">SC</span>
            </div>
            <span className="font-semibold tracking-tight text-sm">ShadowCorps</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login" className="text-xs text-muted hover:text-white">Entrar</Link>
            <Link href="/register" className="text-xs bg-primary hover:bg-primaryHover px-3 py-1.5 rounded-md font-medium">
              Crear cuenta
            </Link>
          </nav>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 overflow-auto scroll-hidden">
        <div className="max-w-2xl text-center space-y-6 py-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface2 border border-border text-[11px] text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Espionaje · Hackeos · Mapa mundial
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            El poder no se hereda.\n
            <span className="text-primary">Se toma.</span>
          </h1>

          <p className="text-sm sm:text-base text-muted max-w-md mx-auto leading-relaxed">
            Crea identidades, borra huellas, hackea servidores y vende intel al jefe.
            Controlas cada movimiento — o te descubren.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <Link href="/register" className="bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-lg text-sm font-semibold">
              Empezar ahora
            </Link>
            <Link href="/map" className="border border-border hover:border-zinc-500 text-white px-6 py-2.5 rounded-lg text-sm">
              Ver mapa
            </Link>
          </div>

          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="text-primary text-xs font-medium mb-1">Espía real</div>
              <p className="text-[11px] text-muted">Identidades, heat, informes al jefe. Si no limpias, te queman.</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="text-primary text-xs font-medium mb-1">Hackeos</div>
              <p className="text-[11px] text-muted">Servidores, cámaras, bancos, ficheros policiales. Cada hack deja rastro.</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="text-primary text-xs font-medium mb-1">Mapa mundi</div>
              <p className="text-[11px] text-muted">Países clicables, regiones, batallas territoriales y rutas.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
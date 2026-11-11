import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary/20 border border-primary/40 rounded-lg flex items-center justify-center overflow-hidden">
              <span className="text-primary font-bold text-sm tracking-tighter">SC</span>
            </div>
            <span className="font-semibold tracking-tight text-[15px]">ShadowCorps</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-muted hover:text-white transition"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="text-sm bg-primary hover:bg-primaryHover px-4 py-1.5 rounded-md font-medium transition"
            >
              Crear cuenta
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface2 border border-border text-xs text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Beta cerrada · Próximamente
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            El poder no se hereda.\n
            <span className="text-primary">Se toma.</span>
          </h1>

          <p className="text-lg text-muted max-w-xl mx-auto leading-relaxed">
            En un mundo controlado por megacorporaciones, tú decides si eres un ejecutivo,
            un espía o el que mueve los hilos desde las sombras.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/register"
              className="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Empezar ahora
            </Link>
            <Link
              href="/dashboard"
              className="border border-border hover:border-zinc-500 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Ver demo del dashboard
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="text-primary text-sm font-medium mb-2">Economía</div>
              <p className="text-sm text-muted">
                Construye empresas, controla recursos y manipula mercados.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="text-primary text-sm font-medium mb-2">Espionaje</div>
              <p className="text-sm text-muted">
                Roba información, sabotea rivales y chantajea a políticos.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="text-primary text-sm font-medium mb-2">Poder</div>
              <p className="text-sm text-muted">
                Controla distritos, coloca gente en el gobierno y domina la ciudad.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-sm text-muted">
        © 2026 ShadowCorps · shadowcorp.pro
      </footer>
    </main>
  );
}
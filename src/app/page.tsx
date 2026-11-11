import Link from "next/link";

export default function HomePage() {
  return (
    <div className="h-dvh overflow-hidden flex flex-col bg-[#0b0f14]">
      <header className="h-12 flex items-center justify-between px-4 border-b border-[#243041] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="ShadowCorps" className="h-7" />
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-xs text-[#8b9bb0] hover:text-white px-3 py-1.5">Entrar</Link>
          <Link href="/register" className="text-xs bg-[#c41e3a] hover:bg-[#a01830] text-white px-3 py-1.5 rounded-md font-medium">
            Crear cuenta
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 overflow-hidden">
        <div className="max-w-lg text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1a212b] border border-[#243041] text-[11px] text-[#8b9bb0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c41e3a] animate-pulse" />
            Mafias · Espionaje · Territorio
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            El poder no se hereda.\n<span className="text-[#c41e3a]">Se toma.</span>
          </h1>
          <p className="text-sm text-[#8b9bb0] leading-relaxed">
            Identidades falsas, hackeos, intel al jefe y guerras por el mapa.
            Si no borras las huellas, te descubren.
          </p>
          <div className="flex gap-2 justify-center pt-1">
            <Link href="/register" className="bg-[#c41e3a] hover:bg-[#a01830] text-white px-5 py-2.5 rounded-lg text-sm font-semibold">
              Empezar
            </Link>
            <Link href="/map" className="border border-[#243041] hover:border-zinc-500 px-5 py-2.5 rounded-lg text-sm">
              Abrir mapa
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
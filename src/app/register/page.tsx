import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-sm font-bold">
              SC
            </div>
            <span className="font-semibold text-lg">Shadow Corporations</span>
          </Link>
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="text-muted text-sm mt-1">Elige tu camino en las sombras</p>
        </div>

        <form className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Nombre de usuario</label>
            <input
              type="text"
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition"
              placeholder="alexvoss"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Email</label>
            <input
              type="email"
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition"
              placeholder="alex@email.com"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Contraseña</label>
            <input
              type="password"
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">Especialización inicial</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "executive", label: "Ejecutivo", desc: "Gestión y liderazgo" },
                { id: "spy", label: "Espía", desc: "Información y sabotaje" },
                { id: "lobbyist", label: "Lobbyista", desc: "Influencia política" },
                { id: "financier", label: "Financiero", desc: "Capital y mercados" },
              ].map((spec) => (
                <label
                  key={spec.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-zinc-500 cursor-pointer transition"
                >
                  <input type="radio" name="spec" value={spec.id} className="accent-primary" />
                  <div>
                    <div className="text-sm font-medium">{spec.label}</div>
                    <div className="text-xs text-muted">{spec.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primaryHover text-white font-medium py-2.5 rounded-lg transition mt-2"
          >
            Crear cuenta
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
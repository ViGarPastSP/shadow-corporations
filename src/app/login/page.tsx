import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 bg-primary/20 border border-primary/40 rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-sm tracking-tighter">SC</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">ShadowCorps</span>
          </Link>
          <h1 className="text-2xl font-bold">Entrar</h1>
          <p className="text-muted text-sm mt-1">Accede a tu cuenta</p>
        </div>

        <form className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Email o usuario</label>
            <input
              type="text"
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition"
              placeholder="alex@nexus.com"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Contraseña</label>
            <input
              type="password"
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primaryHover text-white font-medium py-2.5 rounded-lg transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Crear una
          </Link>
        </p>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

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
          <p className="text-muted text-sm mt-1">Accede a tu cuenta de mafioso</p>
        </div>

        <form onSubmit={handleLogin} className="bg-surface border border-border rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-muted mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition"
              placeholder="alex@shadowcorps.com"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primaryHover disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition"
          >
            {loading ? "Entrando..." : "Entrar"}
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
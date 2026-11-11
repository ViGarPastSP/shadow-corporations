"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SPECIALIZATIONS = [
  { id: "executive", label: "Ejecutivo", desc: "Gestión y liderazgo" },
  { id: "spy", label: "Espía", desc: "Información y sabotaje" },
  { id: "enforcer", label: "Sicario", desc: "Batallas y control territorial" },
  { id: "financier", label: "Financiero", desc: "Capital y lavado de dinero" },
  { id: "trafficker", label: "Traficante", desc: "Rutas y contrabando" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [specialization, setSpecialization] = useState("executive");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, specialization },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Create player profile
    if (authData.user) {
      const { error: profileError } = await supabase.from("players").insert({
        user_id: authData.user.id,
        username,
        display_name: username,
        specialization,
      });

      if (profileError) {
        // Profile might fail if table constraints, but auth succeeded
        console.error("Profile error:", profileError);
      }
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 bg-primary/20 border border-primary/40 rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-sm tracking-tighter">SC</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">ShadowCorps</span>
          </Link>
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="text-muted text-sm mt-1">Únete al bajo mundo</p>
        </div>

        <form onSubmit={handleRegister} className="bg-surface border border-border rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-muted mb-1.5">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={20}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition"
              placeholder="DonAlex"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition"
              placeholder="alex@email.com"
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
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">Especialización</label>
            <div className="grid grid-cols-1 gap-2">
              {SPECIALIZATIONS.map((spec) => (
                <label
                  key={spec.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    specialization === spec.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-zinc-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="spec"
                    value={spec.id}
                    checked={specialization === spec.id}
                    onChange={() => setSpecialization(spec.id)}
                    className="accent-primary"
                  />
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
            disabled={loading}
            className="w-full bg-primary hover:bg-primaryHover disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition mt-2"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
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
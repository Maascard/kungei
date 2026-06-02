"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError("Неверный логин или пароль");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-soft"
      >
        <h1 className="mb-1 font-display text-2xl text-forest">Kungei · Админка</h1>
        <p className="mb-6 text-sm text-charcoal/60">Вход в панель управления</p>

        <label className="label">Логин</label>
        <input
          className="field mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <label className="label">Пароль</label>
        <input
          className="field mb-5"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Вход…" : "Войти"}
        </button>
      </form>
    </div>
  );
}

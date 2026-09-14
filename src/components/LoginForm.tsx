"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      login,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setError("Identifiant ou mot de passe incorrect");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Identifiant</label>
        <input
          type="text"
          required
          autoFocus
          value={login}
          onChange={(event) => setLogin(event.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {isSubmitting ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}

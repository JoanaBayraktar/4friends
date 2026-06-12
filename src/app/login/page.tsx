"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage, randomAvatarColor, usernameToEmail } from "@/lib/auth";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const email = usernameToEmail(username);

      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.trim().toLowerCase(),
              name: name.trim(),
              pronouns: pronouns.trim() || null,
              invite_code: inviteCode.trim(),
              color: randomAvatarColor(),
            },
          },
        });
        if (signUpError) throw signUpError;

        // If "Confirm email" is off, sign-up already returns a session.
        // If not, log in right away – the account is confirmed either way.
        if (!data.session) {
          const { error: signInError } = await supabase.auth.signInWithPassword(
            { email, password }
          );
          if (signInError) throw signInError;
        }
      }

      router.push("/group");
      router.refresh();
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl bg-white p-6 shadow-sm"
      >
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">4Friends</h1>
          <p className="text-sm text-zinc-500">
            {mode === "login"
              ? "Schön, dass du wieder da bist."
              : "Tritt deinem Freundeskreis bei."}
          </p>
        </div>

        <div className="flex gap-1.5 rounded-full bg-zinc-100 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 rounded-full py-1.5 transition-colors ${
              mode === "login"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500"
            }`}
          >
            Anmelden
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`flex-1 rounded-full py-1.5 transition-colors ${
              mode === "register"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500"
            }`}
          >
            Registrieren
          </button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="username" className="text-sm font-medium text-zinc-700">
              Benutzername
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="z. B. joey"
              required
              autoFocus
              autoComplete="username"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-base focus:border-zinc-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-zinc-700">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-base focus:border-zinc-400 focus:outline-none"
            />
          </div>

          {mode === "register" && (
            <>
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium text-zinc-700">
                  Dein Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="So sehen dich deine Freund:innen"
                  required
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-base focus:border-zinc-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="pronouns" className="text-sm font-medium text-zinc-700">
                  Pronomen{" "}
                  <span className="font-normal text-zinc-400">(optional)</span>
                </label>
                <input
                  id="pronouns"
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                  placeholder="z. B. sie/ihr, er/ihm, they/them"
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-base focus:border-zinc-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="inviteCode" className="text-sm font-medium text-zinc-700">
                  Einladungscode
                </label>
                <input
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="z. B. #Couscous-Salat-2026"
                  required
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-base focus:border-zinc-400 focus:outline-none"
                />
              </div>
            </>
          )}
        </div>

        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-2 text-center text-sm text-rose-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading
            ? "Einen Moment …"
            : mode === "login"
              ? "Anmelden"
              : "Konto erstellen"}
        </button>
      </form>
    </main>
  );
}

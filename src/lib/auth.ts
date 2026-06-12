// Helpers for the username/password auth flow.
//
// Supabase Auth itself only knows e-mail addresses, so each account gets a
// synthetic "<username>@4friends.app" address behind the scenes. Combined
// with "Confirm email" turned off in the Supabase dashboard, this gives us
// plain username + password accounts with no e-mail step.

export const AUTH_EMAIL_DOMAIN = "4friends.app";

export function usernameToEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${AUTH_EMAIL_DOMAIN}`;
}

export const AVATAR_COLORS = [
  "bg-rose-300",
  "bg-amber-300",
  "bg-emerald-300",
  "bg-sky-300",
  "bg-violet-300",
  "bg-pink-300",
  "bg-lime-300",
  "bg-cyan-300",
];

export function randomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Maps raw Supabase auth errors to friendly German messages.
export function authErrorMessage(error: unknown): string {
  const raw =
    error instanceof Error ? error.message : String(error ?? "");
  const message = raw.toLowerCase();

  if (
    message.includes("invalid_invite_code") ||
    message.includes("database error")
  ) {
    return "Ungültiger Einladungscode.";
  }
  if (
    message.includes("already registered") ||
    message.includes("user already exists") ||
    message.includes("already been registered")
  ) {
    return "Dieser Benutzername ist schon vergeben.";
  }
  if (message.includes("invalid login credentials")) {
    return "Benutzername oder Passwort ist falsch.";
  }
  if (message.includes("password") && message.includes("at least")) {
    return "Das Passwort muss mindestens 6 Zeichen lang sein.";
  }
  return raw || "Etwas ist schiefgelaufen. Versuch's nochmal.";
}

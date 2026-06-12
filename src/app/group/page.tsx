import Link from "next/link";
import { Header } from "@/components/Header";
import { MOCK_GROUP, MOCK_PROFILES } from "@/lib/mock-data";

export default function GroupOverviewPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {MOCK_GROUP.name}
          </h1>
          <p className="text-sm text-zinc-500">
            Wähle eine Person aus – die App überrascht dich mit einer
            Mini-Aufgabe für sie.
          </p>
        </div>

        <ul className="grid grid-cols-3 gap-6 sm:grid-cols-4">
          {MOCK_PROFILES.map((profile) => (
            <li key={profile.id} className="flex flex-col items-center gap-2">
              <Link
                href={`/group/${profile.id}`}
                className="group flex flex-col items-center gap-2 text-center"
              >
                <span
                  className={`flex h-20 w-20 items-center justify-center rounded-full text-xl font-semibold shadow-sm transition-transform group-hover:scale-105 ${profile.color}`}
                >
                  {profile.initials}
                </span>
                <span className="font-medium text-zinc-900">
                  {profile.name}
                </span>
                <span className="text-xs text-zinc-400">
                  {profile.pronouns ?? " "}
                </span>
              </Link>

              <Link
                href={`/group/${profile.id}/profile`}
                className="text-xs text-zinc-400 underline-offset-2 hover:text-zinc-600 hover:underline"
              >
                Profil ansehen
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">4Friends</h1>
        <p className="text-lg text-zinc-600">
          Was sehen deine Freund:innen in dir? Lass deinen Freundeskreis
          ein Profil voller liebevoller Eindrücke für dich zusammenstellen.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          Mit Freundeskreis-Code starten
        </Link>
      </div>
    </main>
  );
}

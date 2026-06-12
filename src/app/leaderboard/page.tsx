import { Header } from "@/components/Header";
import { Leaderboard } from "@/components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Rangliste</h1>
          <p className="text-sm text-zinc-500">
            Wer hat sich diese Woche am meisten Mühe für die Crew gemacht?
          </p>
        </div>

        <Leaderboard />
      </main>
    </div>
  );
}

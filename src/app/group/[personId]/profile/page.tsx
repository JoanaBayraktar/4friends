import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { AnswerCard } from "@/components/AnswerCard";
import {
  getProfileById,
  MOCK_PROFILE_ANSWERS,
  MOCK_PROFILE_SUMMARY,
} from "@/lib/mock-data";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ personId: string }>;
}) {
  const { personId } = await params;
  const profile = getProfileById(personId);
  if (!profile) notFound();

  const summary = MOCK_PROFILE_SUMMARY[profile.id];
  const answers = MOCK_PROFILE_ANSWERS[profile.id] ?? [];
  const totalAnswers = answers.reduce(
    (sum, qa) => sum + qa.answers.length,
    0
  );

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span
            className={`flex h-24 w-24 items-center justify-center rounded-full text-3xl font-semibold shadow-sm ${profile.color}`}
          >
            {profile.initials}
          </span>
          <div>
            <h1 className="flex items-center justify-center gap-1.5 text-2xl font-semibold tracking-tight">
              {profile.name}
              {summary?.approved && (
                <span
                  title={`${profile.name} hat dieses Profil freigegeben`}
                  className="text-orange-500"
                >
                  ✓
                </span>
              )}
            </h1>
            <p className="text-sm text-zinc-500">
              Das denkt euer Freundeskreis über {profile.name}
            </p>
          </div>
        </div>

        {summary ? (
          <div className="space-y-8">
            {!summary.approved && (
              <p className="rounded-xl bg-amber-100 px-4 py-2 text-sm text-amber-800">
                Dieses Profil wurde noch nicht von {profile.name} freigegeben.
              </p>
            )}

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="leading-relaxed text-zinc-800">
                {summary.content}
              </p>
            </div>

            <section className="space-y-3">
              <p className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
                Eigenschaften, die andere besonders oft genannt haben
              </p>
              <div className="flex flex-wrap gap-2">
                {summary.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-900"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {answers.length > 0 && (
              <section className="space-y-3">
                <p className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
                  Antworten aus dem Freundeskreis
                </p>
                <div className="space-y-3">
                  {answers.map((qa) => (
                    <AnswerCard
                      key={qa.question}
                      question={qa.question}
                      answers={qa.answers}
                    />
                  ))}
                </div>
              </section>
            )}

            <p className="rounded-2xl bg-orange-50 px-4 py-3 text-center text-sm text-orange-900">
              Dein Freundeskreis hat {totalAnswers}{" "}
              {totalAnswers === 1 ? "Frage" : "Fragen"} über {profile.name}{" "}
              beantwortet 💛
            </p>
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-5 text-sm text-zinc-500 shadow-sm">
            Noch nicht genug Antworten, um ein Profil zu erstellen. Sobald
            Freund:innen Fragen beantwortet und Tags ausgewählt haben,
            entsteht hier {profile.name}s Profil.
          </p>
        )}
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { AnswerCard } from "@/components/AnswerCard";
import { useAuth } from "@/hooks/useAuth";
import { useProfileData } from "@/hooks/useProfileData";
import { ProfileEditor } from "./ProfileEditor";
import { ProfileExtras } from "./ProfileExtras";
import { ProfileStats } from "./ProfileStats";

export default function MyProfilePage() {
  const { profile } = useAuth();
  const { summary, answers, tags, stats, hydrated } = useProfileData(
    profile?.id ?? null
  );

  if (!profile) {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Dein Profil
            </h1>
            <p className="text-sm text-zinc-500">
              So sehen dich deine Freund:innen. Du entscheidest, was davon
              sichtbar wird.
            </p>
          </div>
          <Link
            href={`/group/${profile.id}/profile`}
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-white"
          >
            Vorschau: dein freigegebenes Profil
          </Link>
        </div>

        <div className="space-y-10">
          <section className="space-y-3">
            <p className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
              Deine Stats
            </p>
            <ProfileStats
              answeredAboutCount={stats.answeredAboutCount}
              topReplierId={stats.topReplierId}
            />
          </section>

          <section className="space-y-3">
            <p className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
              Ergebnisse
            </p>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-medium text-zinc-700">
                Eigenschaften, die dein Freundeskreis am meisten genannt hat
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <span
                      key={tag.label}
                      className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-900"
                    >
                      {tag.label}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-zinc-400">
                    {hydrated
                      ? "Noch keine Tags vorhanden."
                      : "Wird geladen …"}
                  </p>
                )}
              </div>
            </div>

            {answers.length > 0 && (
              <div className="space-y-3">
                {answers.map((qa) => (
                  <AnswerCard
                    key={qa.question}
                    question={qa.question}
                    answers={qa.answers}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <p className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
              Mehr über dich
            </p>
            <ProfileExtras />
            <ProfileEditor
              userId={profile.id}
              initialContent={summary?.content ?? ""}
              initialApproved={summary?.approved ?? false}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

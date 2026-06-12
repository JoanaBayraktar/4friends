"use client";

import { useLikes } from "@/hooks/useLikes";

export function AnswerCard({
  question,
  answers,
}: {
  question: string;
  answers: { id: string; text: string; likes?: number }[];
}) {
  const { hydrated, isLiked, toggleLike } = useLikes();

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="mb-1.5 text-sm font-medium text-zinc-700">{question}</p>
      <div className="divide-y divide-zinc-100">
        {answers.map((answer) => {
          const liked = hydrated && isLiked(answer.id);
          const likeCount = (answer.likes ?? 0) + (liked ? 1 : 0);
          return (
            <div
              key={answer.id}
              className="flex items-start gap-3 py-2 first:pt-0 last:pb-0"
            >
              <p className="flex-1 text-sm leading-relaxed text-zinc-600">
                {answer.text}
              </p>
              <button
                type="button"
                onClick={() => toggleLike(answer.id)}
                aria-label={
                  liked ? "Antwort nicht mehr herzen" : "Antwort herzen"
                }
                aria-pressed={liked}
                className="flex shrink-0 flex-col items-center gap-0.5"
              >
                <span
                  className={`text-lg transition-transform hover:scale-110 ${
                    liked ? "scale-110" : ""
                  }`}
                >
                  {liked ? "❤️" : "🤍"}
                </span>
                <span className="text-[11px] font-medium text-zinc-400 tabular-nums">
                  {likeCount}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { MockQuestion, MockSliderQuestion } from "@/lib/mock-data";

type TextItem = MockQuestion;
type SliderItem = MockSliderQuestion;

export function getStopText(item: SliderItem, value: number): string {
  let closest = item.stops[0];
  for (const stop of item.stops) {
    if (Math.abs(stop.value - value) < Math.abs(closest.value - value)) {
      closest = stop;
    }
  }
  return closest.text;
}

type Props =
  | {
      mode: "text";
      items: TextItem[];
      onComplete: (answers: Record<string, string>) => void;
    }
  | {
      mode: "slider";
      items: SliderItem[];
      onComplete: (answers: Record<string, number>) => void;
    };

export function QuestionFlow(props: Props) {
  const { mode, items } = props;
  const [index, setIndex] = useState(0);
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [sliderAnswers, setSliderAnswers] = useState<Record<string, number>>(
    {}
  );
  const [sliderTouched, setSliderTouched] = useState<Set<string>>(new Set());

  const item = items[index];
  const isLast = index === items.length - 1;

  function goNext(skip: boolean) {
    const next = { ...sliderAnswers };
    if (mode === "slider" && !skip && !sliderTouched.has(item.id)) {
      next[item.id] = 50;
    }

    if (isLast) {
      if (mode === "text") {
        const answers = { ...textAnswers };
        if (skip) delete answers[item.id];
        props.onComplete(answers);
      } else {
        const answers = { ...next };
        if (skip) delete answers[item.id];
        props.onComplete(answers);
      }
      return;
    }

    if (mode === "slider") setSliderAnswers(next);
    if (skip && mode === "text") {
      setTextAnswers((prev) => {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      });
    }
    setIndex((i) => i + 1);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5">
        {items.map((it, i) => (
          <span
            key={it.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= index ? "bg-orange-400" : "bg-orange-100"
            }`}
          />
        ))}
      </div>

      <p className="text-xs font-medium text-zinc-400">
        Frage {index + 1} von {items.length}
      </p>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="mb-4 text-lg font-medium text-zinc-900">{item.text}</p>

        {mode === "text" ? (
          <textarea
            key={item.id}
            rows={3}
            autoFocus
            value={textAnswers[item.id] ?? ""}
            onChange={(e) =>
              setTextAnswers((prev) => ({
                ...prev,
                [item.id]: e.target.value,
              }))
            }
            placeholder="Deine Antwort …"
            className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
          />
        ) : (
          <div className="space-y-3">
            <input
              key={item.id}
              type="range"
              min={0}
              max={100}
              value={sliderAnswers[item.id] ?? 50}
              onChange={(e) => {
                setSliderTouched((prev) => new Set(prev).add(item.id));
                setSliderAnswers((prev) => ({
                  ...prev,
                  [item.id]: Number(e.target.value),
                }));
              }}
              className="w-full accent-orange-400"
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{(item as SliderItem).leftLabel}</span>
              <span>{(item as SliderItem).rightLabel}</span>
            </div>
            <p className="rounded-xl bg-orange-50 px-3 py-2 text-center text-sm font-medium text-orange-900">
              {getStopText(item as SliderItem, sliderAnswers[item.id] ?? 50)}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => goNext(true)}
          className="flex-1 rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-white"
        >
          Überspringen
        </button>
        <button
          type="button"
          onClick={() => goNext(false)}
          className="flex-1 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          {isLast ? "Fertig" : "Weiter"}
        </button>
      </div>
    </div>
  );
}

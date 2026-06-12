"use client";

import { useState } from "react";

export function TagPicker({
  tags,
  onComplete,
}: {
  tags: string[];
  onComplete: (selected: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(tag: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selected.has(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-zinc-700 shadow-sm hover:bg-zinc-100"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onComplete(Array.from(selected))}
        className="w-full rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Auswahl speichern
      </button>
    </div>
  );
}

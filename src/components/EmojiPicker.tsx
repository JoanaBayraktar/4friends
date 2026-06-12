"use client";

import { useState } from "react";

const EMOJIS = [
  "😀", "😂", "😍", "🥳", "😎", "🤔", "😴", "😭",
  "👀", "👍", "🙌", "🙏", "🔥", "✨", "🎉", "❤️",
  "💯", "😅", "🥺", "😏", "🤝", "👏", "😆", "🫶",
];

export function EmojiPicker({
  onSelect,
}: {
  onSelect: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Emoji einfügen"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-lg transition-colors hover:bg-zinc-50"
      >
        😀
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-12 right-0 z-20 grid w-56 grid-cols-6 gap-1 rounded-2xl bg-white p-3 shadow-lg">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onSelect(emoji);
                  setOpen(false);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors hover:bg-orange-50"
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

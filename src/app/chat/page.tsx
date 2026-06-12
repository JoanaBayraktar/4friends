"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { EmojiPicker } from "@/components/EmojiPicker";
import { useChat } from "@/hooks/useChat";
import { CURRENT_USER_ID } from "@/lib/chat";
import { getProfileById } from "@/lib/mock-data";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatPage() {
  const { messages, sendMessage } = useChat();
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(CURRENT_USER_ID, text.trim());
    setText("");
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-orange-50">
      <Header />
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
          {messages.map((message) => {
            const author = getProfileById(message.fromUserId);
            const isMe = message.fromUserId === CURRENT_USER_ID;
            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  isMe ? "flex-row-reverse" : ""
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    author?.color ?? "bg-zinc-200"
                  }`}
                >
                  {author?.initials ?? "?"}
                </span>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    isMe
                      ? "rounded-br-sm bg-zinc-900 text-white"
                      : "rounded-bl-sm bg-white text-zinc-900"
                  }`}
                >
                  {!isMe && (
                    <p className="mb-0.5 text-xs font-medium text-zinc-500">
                      {author?.name ?? "Unbekannt"}
                    </p>
                  )}
                  <p>{message.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isMe ? "text-zinc-400" : "text-zinc-400"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex shrink-0 gap-2 border-t border-orange-100 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Schreib etwas Nettes …"
            className="flex-1 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:border-zinc-400 focus:outline-none"
          />
          <EmojiPicker onSelect={(emoji) => setText((prev) => prev + emoji)} />
          <button
            type="submit"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Senden
          </button>
        </form>
      </main>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { CHAT_STORAGE_KEY, SEED_MESSAGES, type ChatMessage } from "@/lib/chat";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
        setMessages(JSON.parse(stored) as ChatMessage[]);
      } catch {
        setMessages(SEED_MESSAGES);
      }
    }
    setHydrated(true);
  }, []);

  const sendMessage = useCallback((fromUserId: string, text: string) => {
    setMessages((prev) => {
      const next: ChatMessage[] = [
        ...prev,
        {
          id: crypto.randomUUID(),
          fromUserId,
          text,
          createdAt: new Date().toISOString(),
        },
      ];
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { messages, hydrated, sendMessage };
}

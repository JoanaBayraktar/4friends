"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessage } from "@/lib/chat";

export function useChat() {
  const { profile, userId } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const groupId = profile?.group_id ?? null;

  useEffect(() => {
    if (!groupId) return;
    const currentGroupId = groupId;
    let active = true;

    async function load() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("group_id", currentGroupId)
        .order("created_at", { ascending: true });
      if (!active) return;
      setMessages(
        (data ?? []).map((m) => ({
          id: m.id,
          fromUserId: m.from_user_id,
          text: m.text,
          createdAt: m.created_at,
        }))
      );
      setHydrated(true);
    }
    load();

    const channel = supabase
      .channel(`messages:${currentGroupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `group_id=eq.${currentGroupId}`,
        },
        (payload) => {
          const m = payload.new as {
            id: string;
            from_user_id: string;
            text: string;
            created_at: string;
          };
          setMessages((prev) =>
            prev.some((p) => p.id === m.id)
              ? prev
              : [
                  ...prev,
                  {
                    id: m.id,
                    fromUserId: m.from_user_id,
                    text: m.text,
                    createdAt: m.created_at,
                  },
                ]
          );
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [groupId, supabase]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!groupId || !userId) return;
      await supabase
        .from("messages")
        .insert({ group_id: groupId, from_user_id: userId, text });
    },
    [groupId, userId, supabase]
  );

  return { messages, hydrated, sendMessage };
}

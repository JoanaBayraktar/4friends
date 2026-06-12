// Chat message shape, backed by the `messages` table (see
// supabase/migrations/0002_*.sql and src/hooks/useChat.ts).

export type ChatMessage = {
  id: string;
  fromUserId: string;
  text: string;
  createdAt: string;
};

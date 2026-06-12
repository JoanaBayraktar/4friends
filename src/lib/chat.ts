// Placeholder chat data, persisted in localStorage until a real
// `messages` table (see supabase/migrations/0002_*.sql) is connected.

export const CHAT_STORAGE_KEY = "4friends_chat_messages";

// In the mock setup, this is "you".
export const CURRENT_USER_ID = "joey";

export type ChatMessage = {
  id: string;
  fromUserId: string;
  text: string;
  createdAt: string;
};

export const SEED_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    fromUserId: "mia",
    text: "Heyyy, hat schon jemand Joeys Profil ausgefüllt? 👀",
    createdAt: "2026-06-10T18:02:00.000Z",
  },
  {
    id: "m2",
    fromUserId: "ben",
    text: "Jaa gerade eben, war richtig schön Sachen aufzuschreiben ☺️",
    createdAt: "2026-06-10T18:03:30.000Z",
  },
  {
    id: "m3",
    fromUserId: "lou",
    text: "Lasst uns das diese Woche für alle machen!",
    createdAt: "2026-06-10T18:05:00.000Z",
  },
];

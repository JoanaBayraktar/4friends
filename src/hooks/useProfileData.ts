"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { ProfileSummary } from "@/lib/supabase/types";

export type ProfileAnswer = {
  id: string;
  text: string;
  likes: number;
};

export type ProfileQuestionAnswers = {
  question: string;
  answers: ProfileAnswer[];
};

export type ProfileTag = {
  label: string;
  count: number;
};

export type ProfileStats = {
  answeredAboutCount: number;
  topReplierId: string | null;
};

// Loads everything the friend group has contributed about a given person:
// the generated/approved summary, grouped freitext answers (with like
// counts), the most-picked trait tags, and a couple of stats.
export function useProfileData(aboutUserId: string | null) {
  const { userId } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [answers, setAnswers] = useState<ProfileQuestionAnswers[]>([]);
  const [tags, setTags] = useState<ProfileTag[]>([]);
  const [stats, setStats] = useState<ProfileStats>({
    answeredAboutCount: 0,
    topReplierId: null,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!aboutUserId) return;
    const currentAboutUserId = aboutUserId;
    let active = true;

    async function load() {
      const [{ data: freitext }, { data: traits }, { data: summaryRow }] =
        await Promise.all([
          supabase
            .from("freitext_answers")
            .select("id, from_user_id, question_text, answer_text")
            .eq("about_user_id", currentAboutUserId),
          supabase
            .from("trait_votes")
            .select("trait_label")
            .eq("about_user_id", currentAboutUserId),
          supabase
            .from("profile_summaries")
            .select("*")
            .eq("about_user_id", currentAboutUserId)
            .maybeSingle(),
        ]);
      if (!active) return;

      const answerIds = (freitext ?? []).map((a) => a.id);
      const likeCounts: Record<string, number> = {};
      const likedByMe = new Set<string>();
      if (answerIds.length > 0) {
        const { data: likes } = await supabase
          .from("freitext_answer_likes")
          .select("answer_id, user_id")
          .in("answer_id", answerIds);
        for (const like of likes ?? []) {
          likeCounts[like.answer_id] = (likeCounts[like.answer_id] ?? 0) + 1;
          if (like.user_id === userId) likedByMe.add(like.answer_id);
        }
      }
      if (!active) return;

      const grouped = new Map<string, ProfileAnswer[]>();
      for (const a of freitext ?? []) {
        const total = likeCounts[a.id] ?? 0;
        const base = total - (likedByMe.has(a.id) ? 1 : 0);
        const list = grouped.get(a.question_text) ?? [];
        list.push({ id: a.id, text: a.answer_text, likes: base });
        grouped.set(a.question_text, list);
      }
      setAnswers(
        Array.from(grouped.entries()).map(([question, qaAnswers]) => ({
          question,
          answers: qaAnswers,
        }))
      );

      const traitCounts = new Map<string, number>();
      for (const t of traits ?? []) {
        traitCounts.set(
          t.trait_label,
          (traitCounts.get(t.trait_label) ?? 0) + 1
        );
      }
      const sortedTags = Array.from(traitCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([label, count]) => ({ label, count }));
      setTags(sortedTags);

      setSummary(summaryRow ?? null);

      const fromCounts = new Map<string, number>();
      for (const a of freitext ?? []) {
        fromCounts.set(a.from_user_id, (fromCounts.get(a.from_user_id) ?? 0) + 1);
      }
      let topReplierId: string | null = null;
      let max = 0;
      for (const [id, count] of fromCounts.entries()) {
        if (count > max) {
          max = count;
          topReplierId = id;
        }
      }
      setStats({ answeredAboutCount: freitext?.length ?? 0, topReplierId });

      setHydrated(true);
    }

    load();
    return () => {
      active = false;
    };
  }, [aboutUserId, userId, supabase]);

  return { summary, answers, tags, stats, hydrated };
}

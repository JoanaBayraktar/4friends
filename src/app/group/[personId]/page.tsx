"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { QuestionFlow, getStopText } from "@/components/QuestionFlow";
import { TagPicker } from "@/components/TagPicker";
import { TaskComplete } from "@/components/TaskComplete";
import { LevelUpModal } from "@/components/LevelUpModal";
import { usePoints } from "@/hooks/usePoints";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/auth";
import { getRandomSliderQuestions } from "@/lib/mock-data";
import type { MockQuestion, MockSliderQuestion } from "@/lib/mock-data";
import { getRandomQuestions } from "@/lib/question-bank";
import { getRandomTraits } from "@/lib/trait-bank";
import type { Level } from "@/lib/points";
import type { Database, Profile } from "@/lib/supabase/types";

type FreitextInsert = Database["public"]["Tables"]["freitext_answers"]["Insert"];
type SliderInsert = Database["public"]["Tables"]["slider_answers"]["Insert"];
type TraitInsert = Database["public"]["Tables"]["trait_votes"]["Insert"];

const TASK_TYPES = ["text", "tags", "slider"] as const;
type TaskType = (typeof TASK_TYPES)[number];

export default function PersonTaskPage() {
  const { personId } = useParams<{ personId: string }>();
  const { userId } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", personId)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setProfile(data ?? null);
        setProfileLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [personId, supabase]);

  // Pick the random task type only after mount, so the server-rendered
  // markup (always the same) matches the client's first render and we
  // avoid a hydration mismatch.
  const [taskType, setTaskType] = useState<TaskType | null>(null);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [sliderQuestions, setSliderQuestions] = useState<
    MockSliderQuestion[]
  >([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time random pick after mount, deliberately not derivable on the server
    setTaskType(TASK_TYPES[Math.floor(Math.random() * TASK_TYPES.length)]);
    setQuestions(getRandomQuestions(5));
    setTags(getRandomTraits(18));
    setSliderQuestions(getRandomSliderQuestions());
  }, []);
  const [done, setDone] = useState(false);
  const [levelUp, setLevelUp] = useState<Level | null>(null);
  const { addPoints } = usePoints();

  const taskTitle = useMemo(() => {
    switch (taskType) {
      case "text":
        return "Ein paar Fragen";
      case "slider":
        return "Schnell eingeordnet";
      case "tags":
        return "Eigenschaften auswählen";
      default:
        return "Eine kleine Aufgabe";
    }
  }, [taskType]);

  const taskDescription = useMemo(() => {
    if (!profile) return "";
    switch (taskType) {
      case "text":
        return `Deine Antworten fließen anonymisiert in ${profile.name}s Profil ein.`;
      case "slider":
        return `Schieb den Regler dahin, wo ${profile.name} für dich am ehesten hingehört.`;
      case "tags":
        return `Welche Eigenschaften passen am besten zu ${profile.name}? Wähle so viele aus, wie du möchtest.`;
      default:
        return `Wird gleich für ${profile.name} vorbereitet …`;
    }
  }, [taskType, profile]);

  async function finishTask(reason: string) {
    const { newLevel } = await addPoints(15, reason);
    if (newLevel) setLevelUp(newLevel);
    setDone(true);
  }

  async function handleTextComplete(answers: Record<string, string>) {
    if (userId && profile) {
      const rows: FreitextInsert[] = Object.entries(answers)
        .filter(([, text]) => text.trim().length > 0)
        .map(([questionId, text]) => ({
          from_user_id: userId,
          about_user_id: profile.id,
          question_text:
            questions.find((q) => q.id === questionId)?.text ?? questionId,
          answer_text: text.trim(),
        }));
      if (rows.length > 0) {
        await supabase
          .from("freitext_answers")
          .upsert(rows, { onConflict: "from_user_id,about_user_id,question_text" });
      }
    }
    await finishTask("text_task");
  }

  async function handleSliderComplete(answers: Record<string, number>) {
    if (userId && profile) {
      const rows: SliderInsert[] = Object.entries(answers).map(
        ([questionId, value]) => {
          const item = sliderQuestions.find((q) => q.id === questionId);
          return {
            from_user_id: userId,
            about_user_id: profile.id,
            question_text: item?.text ?? questionId,
            value,
            stop_text: item ? getStopText(item, value) : "",
          };
        }
      );
      if (rows.length > 0) {
        await supabase
          .from("slider_answers")
          .upsert(rows, { onConflict: "from_user_id,about_user_id,question_text" });
      }
    }
    await finishTask("slider_task");
  }

  async function handleTagsComplete(selected: string[]) {
    if (userId && profile && selected.length > 0) {
      const rows: TraitInsert[] = selected.map((trait_label) => ({
        from_user_id: userId,
        about_user_id: profile.id,
        trait_label,
      }));
      await supabase
        .from("trait_votes")
        .upsert(rows, {
          onConflict: "from_user_id,about_user_id,trait_label",
          ignoreDuplicates: true,
        });
    }
    await finishTask("tags_task");
  }

  if (profileLoaded && !profile) {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
          <p className="rounded-2xl bg-white p-5 text-sm text-zinc-500 shadow-sm">
            Diese Person wurde nicht gefunden.{" "}
            <Link href="/group" className="font-medium underline">
              Zurück zur Übersicht
            </Link>
          </p>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
          <div className="h-40 animate-pulse rounded-2xl bg-white/60" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold ${profile.color}`}
            >
              {getInitials(profile.name)}
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {taskTitle}: {profile.name}
              </h1>
              <p className="text-sm text-zinc-500">{taskDescription}</p>
            </div>
          </div>
          <Link
            href={`/group/${profile.id}/profile`}
            className="shrink-0 text-sm font-medium text-zinc-500 underline-offset-2 hover:underline"
          >
            Profil ansehen
          </Link>
        </div>

        {taskType === null ? (
          <div className="h-40 animate-pulse rounded-2xl bg-white/60" />
        ) : done ? (
          <TaskComplete name={profile.name} />
        ) : taskType === "text" ? (
          <QuestionFlow
            mode="text"
            items={questions}
            onComplete={handleTextComplete}
          />
        ) : taskType === "slider" ? (
          <QuestionFlow
            mode="slider"
            items={sliderQuestions}
            onComplete={handleSliderComplete}
          />
        ) : (
          <TagPicker tags={tags} onComplete={handleTagsComplete} />
        )}
      </main>

      {levelUp && (
        <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />
      )}
    </div>
  );
}

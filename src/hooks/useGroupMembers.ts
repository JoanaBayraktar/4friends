"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

// All profiles in the signed-in user's group (i.e. "die Crew").
export function useGroupMembers() {
  const { profile } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [members, setMembers] = useState<Profile[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const groupId = profile?.group_id ?? null;

  useEffect(() => {
    if (!groupId) return;
    let active = true;

    supabase
      .from("profiles")
      .select("*")
      .eq("group_id", groupId)
      .order("name")
      .then(({ data }) => {
        if (!active) return;
        setMembers(data ?? []);
        setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, [groupId, supabase]);

  function getMember(id: string): Profile | undefined {
    return members.find((m) => m.id === id);
  }

  return { members, hydrated, getMember };
}

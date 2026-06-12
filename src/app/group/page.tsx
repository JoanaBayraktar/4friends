import Link from "next/link";
import { Header } from "@/components/Header";
import { Avatar } from "@/components/Avatar";
import { createClient } from "@/lib/supabase/server";

export default async function GroupOverviewPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  let groupName = "";
  let members: {
    id: string;
    name: string;
    pronouns: string | null;
    color: string;
    image_url: string | null;
  }[] = [];

  if (userData.user) {
    const { data: myProfile } = await supabase
      .from("profiles")
      .select("group_id")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (myProfile) {
      const [{ data: group }, { data: profiles }] = await Promise.all([
        supabase
          .from("groups")
          .select("name")
          .eq("id", myProfile.group_id)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("id, name, pronouns, color, image_url")
          .eq("group_id", myProfile.group_id)
          .order("name"),
      ]);

      groupName = group?.name ?? "";
      members = profiles ?? [];
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {groupName}
          </h1>
          <p className="text-sm text-zinc-500">
            Wähle eine Person aus – die App überrascht dich mit einer
            Mini-Aufgabe für sie.
          </p>
        </div>

        <ul className="grid grid-cols-3 gap-6 sm:grid-cols-4">
          {members.map((profile) => (
            <li key={profile.id} className="flex flex-col items-center gap-2">
              <Link
                href={`/group/${profile.id}`}
                className="group flex flex-col items-center gap-2 text-center"
              >
                <Avatar
                  name={profile.name}
                  color={profile.color}
                  imageUrl={profile.image_url}
                  className="h-20 w-20 text-xl shadow-sm transition-transform group-hover:scale-105"
                />
                <span className="font-medium text-zinc-900">
                  {profile.name}
                </span>
                <span className="text-xs text-zinc-400">
                  {profile.pronouns ?? " "}
                </span>
              </Link>

              <Link
                href={`/group/${profile.id}/profile`}
                className="text-xs text-zinc-400 underline-offset-2 hover:text-zinc-600 hover:underline"
              >
                Profil ansehen
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

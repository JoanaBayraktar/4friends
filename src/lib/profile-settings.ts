// Editable account/profile fields, backed by columns on the `profiles`
// table (see supabase/migrations).

export type ProfileSettings = {
  name: string;
  pronouns: string;
  favoriteSong: string;
  notifications: boolean;
};

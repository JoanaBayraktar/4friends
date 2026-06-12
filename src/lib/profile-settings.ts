// Placeholder profile/account settings, persisted in localStorage until
// these fields live on the `profiles` table (see supabase/migrations).

export const PROFILE_SETTINGS_KEY = "4friends_profile_settings";

export type ProfileSettings = {
  name: string;
  pronouns: string;
  favoriteSong: string;
  notifications: boolean;
};

export const DEFAULT_PROFILE_SETTINGS: ProfileSettings = {
  name: "Joey",
  pronouns: "er/ihm",
  favoriteSong: "",
  notifications: true,
};

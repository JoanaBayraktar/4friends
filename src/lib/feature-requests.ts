// Stores ideas/feature requests submitted by users from the settings page,
// persisted in localStorage until a real `feature_requests` table exists.

export const FEATURE_REQUESTS_KEY = "4friends_feature_requests";

export type FeatureRequestType = "feature" | "question";

export type FeatureRequest = {
  id: string;
  type: FeatureRequestType;
  text: string;
  createdAt: string;
};

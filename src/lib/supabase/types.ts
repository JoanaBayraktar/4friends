export type Database = {
  public: {
    Tables: {
      groups: {
        Row: {
          id: string;
          name: string;
          invite_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          invite_code: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["groups"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          group_id: string;
          name: string;
          pronouns: string | null;
          image_url: string | null;
          username: string | null;
          color: string;
          favorite_song: string | null;
          notifications: boolean;
          points: number;
          created_at: string;
        };
        Insert: {
          id: string;
          group_id: string;
          name: string;
          pronouns?: string | null;
          image_url?: string | null;
          username?: string | null;
          color?: string;
          favorite_song?: string | null;
          notifications?: boolean;
          points?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          text: string;
          type: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          text: string;
          type?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
        Relationships: [];
      };
      answers: {
        Row: {
          id: string;
          from_user_id: string;
          about_user_id: string;
          question_id: string;
          text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          from_user_id: string;
          about_user_id: string;
          question_id: string;
          text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["answers"]["Insert"]>;
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          label: string;
        };
        Insert: {
          id?: string;
          label: string;
        };
        Update: Partial<Database["public"]["Tables"]["tags"]["Insert"]>;
        Relationships: [];
      };
      user_tag_votes: {
        Row: {
          from_user_id: string;
          about_user_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          from_user_id: string;
          about_user_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_tag_votes"]["Insert"]
        >;
        Relationships: [];
      };
      profile_summaries: {
        Row: {
          id: string;
          about_user_id: string;
          content: string;
          approved: boolean;
          approved_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          about_user_id: string;
          content?: string;
          approved?: boolean;
          approved_at?: string | null;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["profile_summaries"]["Insert"]
        >;
        Relationships: [];
      };
      point_events: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          reason: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["point_events"]["Insert"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          group_id: string;
          from_user_id: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          from_user_id: string;
          text: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };
      freitext_answers: {
        Row: {
          id: string;
          from_user_id: string;
          about_user_id: string;
          question_text: string;
          answer_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          from_user_id: string;
          about_user_id: string;
          question_text: string;
          answer_text: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["freitext_answers"]["Insert"]
        >;
        Relationships: [];
      };
      trait_votes: {
        Row: {
          from_user_id: string;
          about_user_id: string;
          trait_label: string;
          created_at: string;
        };
        Insert: {
          from_user_id: string;
          about_user_id: string;
          trait_label: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trait_votes"]["Insert"]>;
        Relationships: [];
      };
      slider_answers: {
        Row: {
          id: string;
          from_user_id: string;
          about_user_id: string;
          question_text: string;
          value: number;
          stop_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          from_user_id: string;
          about_user_id: string;
          question_text: string;
          value: number;
          stop_text: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["slider_answers"]["Insert"]
        >;
        Relationships: [];
      };
      freitext_answer_likes: {
        Row: {
          answer_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          answer_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["freitext_answer_likes"]["Insert"]
        >;
        Relationships: [];
      };
      feature_requests: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          type: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          type: string;
          text: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["feature_requests"]["Insert"]
        >;
        Relationships: [];
      };
      profile_picture_suggestions: {
        Row: {
          id: string;
          about_user_id: string;
          suggested_by_user_id: string;
          image_url: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          about_user_id: string;
          suggested_by_user_id: string;
          image_url: string;
          status?: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["profile_picture_suggestions"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

export type Group = Database["public"]["Tables"]["groups"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type Answer = Database["public"]["Tables"]["answers"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type UserTagVote =
  Database["public"]["Tables"]["user_tag_votes"]["Row"];
export type ProfileSummary =
  Database["public"]["Tables"]["profile_summaries"]["Row"];
export type PointEvent = Database["public"]["Tables"]["point_events"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type ProfilePictureSuggestion =
  Database["public"]["Tables"]["profile_picture_suggestions"]["Row"];
export type FreitextAnswer =
  Database["public"]["Tables"]["freitext_answers"]["Row"];
export type TraitVote = Database["public"]["Tables"]["trait_votes"]["Row"];
export type SliderAnswer =
  Database["public"]["Tables"]["slider_answers"]["Row"];
export type FreitextAnswerLike =
  Database["public"]["Tables"]["freitext_answer_likes"]["Row"];
export type FeatureRequestRow =
  Database["public"]["Tables"]["feature_requests"]["Row"];

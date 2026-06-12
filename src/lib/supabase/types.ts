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
      };
      profiles: {
        Row: {
          id: string;
          group_id: string;
          name: string;
          pronouns: string | null;
          image_url: string | null;
          points: number;
          created_at: string;
        };
        Insert: {
          id: string;
          group_id: string;
          name: string;
          pronouns?: string | null;
          image_url?: string | null;
          points?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
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
      };
    };
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

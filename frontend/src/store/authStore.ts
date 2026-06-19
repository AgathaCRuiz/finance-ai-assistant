import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthStore {
  session: Session | null;
  user: User | null;
  loading: boolean;

  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  init: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  user: null,
  loading: true,

  init: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({
        session,
        user: session?.user ?? null,
        loading: false,
      });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        loading: false,
      });
    });
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/app`,
      },
    });

    console.log("GOOGLE DATA:", data);
    console.log("GOOGLE ERROR:", error);

    if (error) {
      throw error;
    }
  },

  signInWithEmail: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("LOGIN DATA:", data);
      console.log("LOGIN ERROR:", error);

      return {
        error: error?.message ?? null,
      };
    } catch (err) {
      console.error("LOGIN EXCEPTION:", err);

      return {
        error: err instanceof Error ? err.message : "Erro desconhecido",
      };
    }
  },

  signUpWithEmail: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
        },
      });

      console.log("SIGNUP DATA:", data);
      console.log("SIGNUP ERROR:", error);

      if (error) {
        console.error("SUPABASE ERROR:", error);
      }

      return {
        error: error?.message ?? null,
      };
    } catch (err) {
      console.error("SIGNUP EXCEPTION:", err);

      return {
        error: err instanceof Error ? err.message : "Erro desconhecido",
      };
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("SIGNOUT ERROR:", error);
      return;
    }

    set({
      session: null,
      user: null,
    });
  },
}));
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
  signIn: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<void>;
  signInWithOAuth: (provider: 'google') => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isInitialized: false,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ 
        session, 
        user: session?.user || null,
        isInitialized: true,
        isLoading: false
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event: AuthChangeEvent, newSession: Session | null) => {
        set({ 
          session: newSession, 
          user: newSession?.user || null,
          isLoading: false
        });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },
  signIn: async (email, password) => {
    set({ isLoading: true });
    try {
      if (password) {
        // Mock email/password login
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Magic link
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  signUp: async (email, password, fullName) => {
    set({ isLoading: true });
    try {
      if (password) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  signInWithOAuth: async (provider) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/dashboard',
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('OAuth error:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  signOut: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ user: null, session: null, isLoading: false });
  }
}));

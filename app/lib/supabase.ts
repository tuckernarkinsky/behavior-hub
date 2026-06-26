import { createClient } from '@supabase/supabase-js';

// In production (Vercel) the real keys come from environment variables.
// Locally, if .env.local is missing, we fall back to harmless placeholders
// so the app still loads (the landing page works) instead of crashing with
// "supabaseUrl is required". Sign-in won't work locally without real keys,
// but the page renders. Add NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY to
// .env.local to enable local login.
const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  || 'https://placeholder.supabase.co';
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  organization: string;
};

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data ?? null;
}

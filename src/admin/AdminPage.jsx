import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminUnauthorized } from './AdminUnauthorized';
import { Loader2 } from 'lucide-react';

export function AdminPage() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    if (!isSupabaseConfigured || !supabase) {
      const timer = setTimeout(() => {
        if (!ignore) setLoading(false);
      }, 0);
      return () => {
        ignore = true;
        clearTimeout(timer);
      };
    }

    async function initAuth() {
      try {
        const { data: { session: initSession } } = await supabase.auth.getSession();
        if (ignore) return;
        setSession(initSession);

        if (initSession?.user) {
          const { data, error } = await supabase
            .from('admins')
            .select('id, email')
            .eq('id', initSession.user.id)
            .maybeSingle();

          if (ignore) return;
          setIsAdmin(!error && Boolean(data));
        } else {
          setIsAdmin(null);
        }
      } catch {
        if (!ignore) setIsAdmin(false);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        if (ignore) return;
        setSession(currentSession);

        if (currentSession?.user) {
          try {
            const { data, error } = await supabase
              .from('admins')
              .select('id, email')
              .eq('id', currentSession.user.id)
              .maybeSingle();

            if (!ignore) {
              setIsAdmin(!error && Boolean(data));
            }
          } catch {
            if (!ignore) setIsAdmin(false);
          }
        } else {
          setIsAdmin(null);
        }
        setLoading(false);
      }
    );

    return () => {
      ignore = true;
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setIsAdmin(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F2EA] bg-paper text-[#1A1A1A] flex flex-col items-center justify-center p-4 font-body relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8B6914] via-[#C9A96B] to-[#8B6914]" />
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A96B] mb-3" />
        <p className="font-mono text-xs text-[#7A6A50] tracking-[0.2em] uppercase font-semibold">
          Verifying Admin Authorization...
        </p>
      </div>
    );
  }

  // Not logged in -> Show Login form
  if (!session) {
    return (
      <AdminLogin
        onLoginSuccess={(newSession) => {
          setSession(newSession);
          if (newSession?.user) {
            setLoading(true);
            supabase
              .from('admins')
              .select('id, email')
              .eq('id', newSession.user.id)
              .maybeSingle()
              .then(({ data, error }) => {
                setIsAdmin(!error && Boolean(data));
              })
              .finally(() => setLoading(false));
          }
        }}
      />
    );
  }

  // Logged in, but unauthorized by admins table / RLS
  if (isAdmin === false) {
    return (
      <AdminUnauthorized
        user={session.user}
        onSignOut={handleSignOut}
      />
    );
  }

  // Logged in and authorized admin
  return (
    <AdminDashboard
      user={session.user}
      onSignOut={handleSignOut}
    />
  );
}

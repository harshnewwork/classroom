import { Link } from 'react-router-dom';
import { ShieldAlert, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { NavLogo } from '../components/ui/Logo';

export function AdminUnauthorized({ user, onSignOut }) {
  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    if (onSignOut) onSignOut();
  };

  return (
    <div className="min-h-screen bg-[#F7F2EA] bg-paper text-[#1A1A1A] flex flex-col justify-center items-center p-4 font-body relative">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8B6914] via-[#C9A96B] to-[#8B6914]" />

      <div className="w-full max-w-md bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-6 sm:p-8 shadow-sm text-center">
        <div className="mb-4 flex justify-center">
          <NavLogo />
        </div>

        <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-[#FFF1F0] border border-[#F8D7D4] text-[#9B3329] mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-display font-bold text-[#1A1A1A] mb-2">Access Restricted</h2>
        <p className="text-xs text-[#7A6A50] mb-4 leading-relaxed font-body">
          You are signed in as <strong className="text-[#1A1A1A]">{user?.email || 'authenticated user'}</strong>, but this email is not listed in the studio <code className="text-[#3E2F1F] bg-[#EADCC8] px-1 py-0.5 rounded-sm font-mono text-[11px]">admins</code> authorization table.
        </p>

        <div className="bg-[#FAF6F0] border border-[#DDD0B8] rounded-sm p-3.5 text-xs text-[#7A6A50] text-left mb-6 space-y-1.5 font-mono">
          <p className="font-semibold text-[#1A1A1A] font-body text-xs">To authorize this account in Supabase:</p>
          <p className="text-[10px] text-[#A8883F] break-all select-all">
            INSERT INTO public.admins (id, email) VALUES ('{user?.id}', '{user?.email}') ON CONFLICT (id) DO NOTHING;
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSignOut}
            className="flex-1 bg-[#1A1A1A] hover:bg-[#3E2F1F] text-[#F7F2EA] font-semibold py-2.5 px-4 rounded-sm text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
          <Link
            to="/"
            className="flex-1 bg-transparent hover:bg-[#EADCC8] border border-[#DDD0B8] text-[#1A1A1A] font-medium py-2.5 px-4 rounded-sm text-xs flex items-center justify-center transition-colors"
          >
            Return to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}

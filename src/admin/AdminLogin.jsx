import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { NavLogo } from '../components/ui/Logo';

export function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setErrorMsg('Supabase credentials are not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      return;
    }

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg('Invalid email or password. Please verify your admin credentials.');
        } else if (error.status === 429 || error.message.toLowerCase().includes('rate limit')) {
          setErrorMsg('Too many attempts. Supabase rate limit reached. Please wait a moment before trying again.');
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      if (data?.session) {
        if (onLoginSuccess) onLoginSuccess(data.session);
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2EA] bg-paper text-[#1A1A1A] flex flex-col justify-center items-center p-4 sm:p-6 font-body relative">
      {/* Top signature gold accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8B6914] via-[#C9A96B] to-[#8B6914]" />

      <div className="w-full max-w-md">
        {/* Branding header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <NavLogo />
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-[#1A1A1A]">
            Admin Studio Portal
          </h1>
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#7A6A50] mt-1.5">
            Classroom Availability & Enquiries Management
          </p>
        </div>

        {/* Configuration alert if .env not setup */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-sm bg-[#FFF1F0] border border-[#F8D7D4] text-[#9B3329] text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#9B3329] text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Supabase Not Connected</span>
            </div>
            <p>
              Environment variables <code className="bg-[#EADCC8] px-1 py-0.5 rounded text-[#1A1A1A]">VITE_SUPABASE_URL</code> and <code className="bg-[#EADCC8] px-1 py-0.5 rounded text-[#1A1A1A]">VITE_SUPABASE_ANON_KEY</code> must be configured in <code className="bg-[#EADCC8] px-1 py-0.5 rounded text-[#1A1A1A]">.env</code>.
            </p>
          </div>
        )}

        {/* Login Form Card */}
        <div className="bg-[#F7F2EA] border border-[#DDD0B8] rounded-sm p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#DDD0B8]">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[#7A6A50] uppercase">
              <ShieldCheck className="w-4 h-4 text-[#C9A96B]" />
              <span>Manager Sign In</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-sm bg-[#EADCC8] text-[#3E2F1F] font-mono border border-[#DDD0B8]">
              RLS Protected
            </span>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-sm bg-[#FFF1F0] border border-[#F8D7D4] text-[#9B3329] text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#9B3329] flex-shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A6A50] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#A89880] pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mentorsstudio.com"
                  autoComplete="email"
                  required
                  disabled={loading || !isSupabaseConfigured}
                  className="w-full bg-white border border-[#DDD0B8] rounded-sm pl-10 pr-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-[#A89880] focus:outline-none focus:border-[#C9A96B] transition-colors disabled:opacity-50 font-body"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A6A50] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#A89880] pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  disabled={loading || !isSupabaseConfigured}
                  className="w-full bg-white border border-[#DDD0B8] rounded-sm pl-10 pr-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-[#A89880] focus:outline-none focus:border-[#C9A96B] transition-colors disabled:opacity-50 font-body"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="w-full mt-2 bg-[#C9A96B] hover:bg-[#D4B87A] text-[#1A1A1A] font-display font-semibold py-3 px-4 rounded-sm text-sm flex items-center justify-center gap-2 transition-all border border-[#C9A96B] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm tracking-wide"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#1A1A1A]" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#1A1A1A]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#DDD0B8] text-center">
            <p className="font-mono text-[10px] text-[#7A6A50] leading-relaxed">
              Authorized studio managers only. This internal portal is unlinked from the public site.
            </p>
          </div>
        </div>

        {/* Back to public site button */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="font-mono text-xs text-[#7A6A50] hover:text-[#1A1A1A] transition-colors inline-flex items-center gap-1.5"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}

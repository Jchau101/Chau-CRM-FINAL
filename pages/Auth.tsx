import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }

      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl bg-white/80 border border-black/5 shadow-lg shadow-black/5 backdrop-blur p-8 space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-black">
            <span className="text-white font-bold text-xs">C</span>
          </div>
          <h1 className="text-xl font-medium text-neutral-900">
            {mode === 'signup' ? 'Create your Chau account' : 'Welcome back'}
          </h1>
          <p className="text-xs text-neutral-500">
            {mode === 'signup'
              ? 'Sign up to start managing your leads and pipeline.'
              : 'Log in to continue where you left off.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs text-neutral-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black/70"
            />
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-xs text-neutral-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black/70"
            />
          </div>

          {error && (
            <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black text-white text-sm py-2.5 font-medium shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading
              ? mode === 'signup'
                ? 'Creating account...'
                : 'Signing in...'
              : mode === 'signup'
              ? 'Sign up'
              : 'Log in'}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="underline underline-offset-2"
                onClick={() => setMode('signin')}
              >
                Log in
              </button>
            </>
          ) : (
            <>
              New here?{' '}
              <button
                type="button"
                className="underline underline-offset-2"
                onClick={() => setMode('signup')}
              >
                Create an account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};



'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Bricolage_Grotesque } from 'next/font/google';
import { toast } from '@/components/Toast';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
});

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signInWithEmail, signUpWithEmail, signInWithProvider } = useAuth();
  const router = useRouter();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await signInWithEmail(email, password);
      } else {
        result = await signUpWithEmail(email, password);
      }

      if (result.error) {
        setError(result.error.message);
        toast.error(result.error.message);
      } else {
        toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Something went wrong');
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    setError('');

    try {
      const { error } = await signInWithProvider(provider);
      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        toast.success('Signed in successfully!');
      }
    } catch (err) {
      setError('Something went wrong');
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center px-6 ${bricolageGrotesque.variable}`} style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <line x1="9" x2="15" y1="10" y2="10"/>
              <line x1="12" x2="12" y1="7" y2="13"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your feedback dashboard' : 'Start collecting feedback today'}
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-4 mb-6">
          <button
            disabled={true}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 border-2 border-gray-200 rounded-xl opacity-50 cursor-not-allowed font-medium text-gray-500 relative"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
            <span className="absolute top-1 right-2 bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full text-xs font-bold">
              Coming Soon
            </span>
          </button>

          <button
            disabled={true}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 border-2 border-gray-200 rounded-xl opacity-50 cursor-not-allowed font-medium text-gray-500 relative"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>Continue with GitHub</span>
            <span className="absolute top-1 right-2 bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full text-xs font-bold">
              Coming Soon
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-gray-800 placeholder-gray-500"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-gray-800 placeholder-gray-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}

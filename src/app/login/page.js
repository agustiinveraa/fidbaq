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
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors disabled:opacity-50 font-medium text-gray-700"
          >
            <span className="text-xl">🔍</span>
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => handleOAuthSignIn('github')}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors disabled:opacity-50 font-medium text-gray-700"
          >
            <span className="text-xl">🐙</span>
            <span>Continue with GitHub</span>
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

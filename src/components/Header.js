'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header({ title, subtitle, showUserMenu = true, showLogo = true, actions = null }) {
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 ">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        
        <div className="flex items-center space-x-3">
          {showLogo && (
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
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
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {actions}
          
          {showUserMenu && user && (
            <div className="relative user-menu-container">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] transform-gpu"
              >
                <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="font-medium text-gray-800 text-sm">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
                <svg 
                  className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* User Dropdown Menu */}
              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-10 animate-in slide-in-from-top-2 fade-in-50 zoom-in-95 duration-300 transform-gpu origin-top-right">
                  <div className="p-1">
                    <button
                    //TODO: COMING SOON
                      onClick={() => router.push('/?upgrade=true#pricing')}
                      className="w-full text-left px-4 py-1 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-medium flex items-center space-x-2"
                    >
                      <Crown className='w-4'></Crown>
                      <span>Upgrade</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-1 text-red-700 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-medium flex items-center space-x-2"
                    >
                      <LogOut className='w-4' />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!user && showUserMenu && (
            <a
              href="/login"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 transform-gpu"
            >
              Sign In
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

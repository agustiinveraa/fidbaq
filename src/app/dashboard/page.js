'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBoards, createBoard } from '@/lib/database';
import { Bricolage_Grotesque } from 'next/font/google';
import { ArrowDown, MoreHorizontal, MoreVertical } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from '@/components/Toast';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
});

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Redirect if not authenticated (but wait for auth to finish loading)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch boards
  useEffect(() => {
    const fetchBoards = async () => {
      if (!user) return;
      
      setLoading(true);
      const { data, error } = await getUserBoards();
      
      if (error) {
        console.error('Error fetching boards:', error);
      } else {
        setBoards(data || []);
      }
      setLoading(false);
    };

    fetchBoards();
  }, [user]);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim() || createLoading) return;

    setCreateLoading(true);
    const { data, error } = await createBoard({
      name: newBoardName.trim()
    });

    if (error) {
      console.error('Error creating board:', error);
      toast.error('Error creating board: ' + error.message);
    } else {
      setBoards([data, ...boards]);
      setNewBoardName('');
      toast.success('Board created successfully!');
    }
    setCreateLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada exitosamente');
      router.push('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const handleBoardClick = (boardId) => {
    router.push(`/dashboard/${boardId}`);
  };

  if (authLoading || !user) return null;

  return (
    <div className={`min-h-screen bg-white ${bricolageGrotesque.variable}`} style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-6">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          
          <div className="flex items-center space-x-4">
            <div className="relative user-menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 text-">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <MoreVertical className='text-gray-800'/>
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-10 animate-in slide-in-from-top-2 fade-in-50 zoom-in-95 duration-300 transform-gpu origin-top-right">
                  <div className="py-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-medium flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
          <div className="text-gray-800 px-4 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200">
            💡 Give &quot;fidbaq&quot;
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Welcome to your Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Manage your feedback boards efficiently</p>
        </div>

        {/* Create New Board Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-10">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create New Board
            </h2>
            
            <div className="space-y-4">
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Enter board name..."
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              
              <button
                onClick={handleCreateBoard}
                disabled={createLoading || !newBoardName.trim()}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createLoading ? 'Creating...' : 'Create Board'}
              </button>
            </div>
          </div>
        </div>

        {/* Boards Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Your Boards ({boards.length})
            </h2>
            {boards.length > 0 && (
              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                {boards.length} Active
              </div>
            )}
          </div>

          {boards.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
              <div className="text-gray-400 text-5xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No boards yet</h3>
              <p className="text-gray-500">Create your first board to get started collecting feedback</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board, index) => (
                <div
                  key={board.id}
                  onClick={() => handleBoardClick(board.id)}
                  className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] transform-gpu duration-200"
                >
                  {/* <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-lg ${
                      index % 3 === 0 ? 'bg-emerald-500' :
                      index % 3 === 1 ? 'bg-emerald-400' :
                      'bg-emerald-600'
                    }`}>
                      {board.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">→</span>
                      </div>
                    </div>
                  </div> */}
                  
                  <h3 className="font-bold text-gray-800 text-xl mb-2">{board.name}</h3>
                  <p className="text-gray-600 text-sm">Click to manage feedback and responses</p>
                  
                  <div className="mt-4 text-xs text-gray-400">
                    Created {new Date(board.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

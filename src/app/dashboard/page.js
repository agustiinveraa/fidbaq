'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlan } from '@/hooks/useUserPlan';
import { getUserBoards, createBoard } from '@/lib/database';
import { Bricolage_Grotesque } from 'next/font/google';
import { ArrowDown, Crown, MoreHorizontal } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Header from '@/components/Header';
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
  const { plan, isPro } = useUserPlan();

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

    // Verificar límite para usuarios free
    if (!isPro && boards.length >= 3) {
      toast.error('Free users can only create up to 3 boards. Upgrade to Pro for unlimited boards!');
      return;
    }

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
    <div className={`min-h-screen bg-gray-50 ${bricolageGrotesque.variable}`} style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
      <Header 
        title="Dashboard" 
        subtitle="Manage your feedback boards"
        actions={
          <a className="text-gray-800 px-4 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200" href='https://www.fidbaq.xyz/board/fidbaq-fqizgu'>
            💡 Give &quot;fidbaq&quot;
          </a>
        }
      />

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
        <div className="bg-white rounded-2xl p-8 mb-10 shadow-sm border border-gray-200">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create New Board
            </h2>
            
            {!isPro && boards.length >= 3 ? (
              // Mensaje de upgrade para usuarios free que alcanzaron el límite
              <div className="bg-gray-100 p-3 rounded-xl flex flex-col justify-center items-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  You&apos;ve reached the limit!
                </h3>
                <p className="text-gray-600 mb-4">
                  Free users can create up to 3 boards. Upgrade to Pro for unlimited boards and more features.
                </p>
                <button
                  onClick={() => router.push('/?upgrade=true')}
                  className="flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-600 border-0 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 transform-gpu cursor-pointer w-auto"
                >
                  <Crown className='w-4 h-4' />
                  <span>Upgrade to pro</span>
                </button>
              </div>
            ) : (
              // Formulario normal para crear board
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
                
                {!isPro && (
                  <p className="text-sm text-gray-500 mt-2">
                    {3 - boards.length} boards remaining on free plan
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Boards Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Your Boards ({boards.length}{!isPro ? '/3' : ''})
            </h2>
            <div className="flex items-center gap-3">
              {boards.length > 0 && (
                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                  {boards.length} Active
                </div>
              )}
              {!isPro && (
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  Free Plan
                </div>
              )}
            </div>
          </div>

          {boards.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-white">
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
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] transform-gpu duration-200 shadow-sm"
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

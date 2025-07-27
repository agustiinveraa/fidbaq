'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getBoardById, getBoardPosts, updateBoard, deleteBoard, voteOnPost, updatePostStatus } from '@/lib/database';
import { Bricolage_Grotesque } from 'next/font/google';
import { ArrowUpRight, CopyCheck, Delete, DeleteIcon, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from '@/components/Toast';
import { confirmModal } from '@/components/ConfirmModal';
import AnimatedDropdown from '@/components/AnimatedDropdown';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
});

const statusConfig = {
  'pending': { emoji: '⏳', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  'in_progress': { emoji: '🚧', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  'completed': { emoji: '✅', label: 'Completed', color: 'bg-green-100 text-green-800' },
  'rejected': { emoji: '❌', label: 'Rejected', color: 'bg-red-100 text-red-800' }
};

const statusOptions = [
  { value: 'pending', emoji: '🟡', label: 'Pending' },
  { value: 'in_progress', emoji: '🔵', label: 'In Progress' },
  { value: 'completed', emoji: '🟢', label: 'Completed' },
  { value: 'rejected', emoji: '🔴', label: 'Rejected' }
];

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [board, setBoard] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicLink, setPublicLink] = useState('');
  const [theme, setTheme] = useState('light');
  
  // Redirect if not authenticated (but wait for auth to finish loading)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch board and posts
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !params.boardId) return;
      
      setLoading(true);
      
      // Fetch board
      const { data: boardData, error: boardError } = await getBoardById(params.boardId);
      if (boardError) {
        console.error('Error fetching board:', boardError);
        router.push('/dashboard');
        return;
      }
      
      setBoard(boardData);
      setPublicLink(`${window.location.origin}/board/${boardData.public_link}`);
      setTheme(boardData.theme || 'light');
      
      // Fetch posts
      const { data: postsData, error: postsError } = await getBoardPosts(params.boardId);
      if (postsError) {
        console.error('Error fetching posts:', postsError);
      } else {
        setPosts(postsData || []);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [user, params.boardId, router]);

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    toast.success('Link copied to clipboard!');
  };

  const handleThemeChange = async (newTheme) => {
    if (!board) return;
    
    const { error } = await updateBoard(board.id, { theme: newTheme });
    if (error) {
      console.error('Error updating theme:', error);
      toast.error('Error updating theme');
    } else {
      setTheme(newTheme);
      setBoard({ ...board, theme: newTheme });
      toast.success('Theme updated successfully!');
    }
  };

  const handleDeleteBoard = async () => {
    if (!board) return;
    
    const confirmed = await confirmModal.show(
      'Delete Board',
      'Are you sure you want to delete this board? This action cannot be undone.',
      'Delete',
      'Cancel'
    );
    
    if (confirmed) {
      const { error } = await deleteBoard(board.id);
      if (error) {
        console.error('Error deleting board:', error);
        toast.error('Error deleting board');
      } else {
        toast.success('Board deleted successfully');
        router.push('/dashboard');
      }
    }
  };

  const handleVote = async (postId) => {
    const { data, error } = await voteOnPost(postId, 'upvote');
    if (error) {
      console.error('Error voting:', error);
      toast.error('Error voting on post');
    } else {
      toast.success('Vote registered!');
      // Refresh posts to get updated vote counts
      const { data: postsData } = await getBoardPosts(params.boardId);
      if (postsData) {
        setPosts(postsData);
      }
    }
  };

  const handleStatusChange = async (postId, newStatus) => {
    const { data, error } = await updatePostStatus(postId, newStatus);
    if (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating post status');
    } else {
      toast.success('Status updated successfully!');
      // Update the post in the local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, status: newStatus }
          : post
      ));
    }
  };

  if (authLoading || !user) return null;

   if (loading) {
    return <LoadingSpinner message="Cargando board..." />;
  }

  if (!board) {
    return (
      <div className={`min-h-screen bg-white flex items-center justify-center ${bricolageGrotesque.variable}`} style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Board not found</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white ${bricolageGrotesque.variable}`} style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-6">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <button 
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
          >
            <span>←</span>
            <span className="font-medium">Back</span>
          </button>
          <a className="text-gray-800 px-4 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200" href='https://fidbaq.xyz/board/fidbaq'>
            💡 Give &quot;fidbaq&quot;
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Board Settings */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {board.name} — {posts.length} Post{posts.length !== 1 ? 's' : ''}
              </h1>
              <p className="text-gray-600 mb-8">
                {posts.length === 0 ? 'No posts yet. Share your board with the world!' : 'Manage your feedback board settings'}
              </p>

              {/* <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Theme
                </label>
                <select 
                  value={theme}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div> */}

              {/* Public Link */}
              <div className="mb-3">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Public link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={publicLink}
                    readOnly
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-l-xl text-gray-800 bg-gray-50"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 border-2 border-l-0 border-emerald-500 rounded-r-xl text-white transition-colors"
                    title="Copy link"
                  >
                    <CopyCheck />
                  </button>
                  {/* <a
                    className="px- py-2 bg-emerald-500 hover:bg-emerald-600 border-2 border-l-0 border-emerald-500 rounded-r-lg text-white transition-colors"
                    title="Copy link"
                    href={publicLink}
                  >
                    <ArrowUpRight />
                  </a> */}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={handleDeleteBoard}
                className="flex items-center space-x-2 text-gray-800 p-3 transition-colors hover:bg-gray-300 rounded-lg"
              >
                <span className="font-bold text-sm">Delete</span>
                <span ><Trash2 className='w-5'/></span>
              </button>
            </div>
          </div>

          {/* Right Content - Posts */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Feedback Posts
              </h2>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
                <div className="text-gray-400 text-5xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Share your board with the world to start collecting feedback</p>
                <button 
                  onClick={handleCopyLink}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 transform-gpu"
                >
                  Copy Public Link
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => {
                  const status = statusConfig[post.status] || statusConfig['pending'];
                  return (
                    <div
                      key={post.id}
                      className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-emerald-500 transition-all animate-in fade-in-50 slide-in-from-bottom-4 duration-300"
                      style={{ animationDelay: `${posts.indexOf(post) * 100}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {post.title}
                          </h3>
                          {post.description && (
                            <p className="text-gray-600 mb-3">{post.description}</p>
                          )}
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.emoji} {status.label}
                            </span>
                            {post.author_name && (
                              <span className="text-xs text-gray-500">
                                by {post.author_name}
                              </span>
                            )}
                            {/* Status Change Dropdown */}
                            <AnimatedDropdown
                              value={post.status}
                              onChange={(newStatus) => handleStatusChange(post.id, newStatus)}
                              options={statusOptions}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleVote(post.id)}
                            className="flex items-center justify-center w-12 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-white transition-all duration-200 hover:scale-110 active:scale-95 transform-gpu hover:shadow-lg"
                          >
                            ↑
                          </button>
                          <div className="bg-emerald-500 text-white px-3 py-2 rounded-xl font-bold min-w-[3rem] text-center">
                            {post.votes_count || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

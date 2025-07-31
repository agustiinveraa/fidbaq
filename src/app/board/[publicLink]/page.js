'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getBoardByPublicLink, getBoardPosts, createPost, voteOnPost } from '@/lib/database';
import { Bricolage_Grotesque } from 'next/font/google';
import LoadingSpinner from '@/components/LoadingSpinner';
import Header from '@/components/Header';
import { toast } from '@/components/Toast';
import { useAuth } from '@/contexts/AuthContext';
import Comments from '@/components/Comments';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
});

const statusConfig = {
  'pending': { emoji: '⏳', label: 'Under Review', color: 'bg-yellow-100 text-yellow-800' },
  'in_progress': { emoji: '🚧', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  'completed': { emoji: '✅', label: 'Completed', color: 'bg-green-100 text-green-800' },
  'rejected': { emoji: '❌', label: 'Not Planned', color: 'bg-red-100 text-red-800' }
};

export default function PublicBoardPage() {
  const params = useParams();
  const { user } = useAuth();
  const [board, setBoard] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    author_name: '',
    author_email: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.publicLink) return;
      
      setLoading(true);
      
      // Fetch board
      const { data: boardData, error: boardError } = await getBoardByPublicLink(params.publicLink);
      if (boardError) {
        console.error('Error fetching board:', boardError);
        setLoading(false);
        return;
      }
      
      setBoard(boardData);
      
      // Fetch posts
      const { data: postsData, error: postsError } = await getBoardPosts(boardData.id);
      if (postsError) {
        console.error('Error fetching posts:', postsError);
      } else {
        setPosts(postsData || []);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [params.publicLink]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to submit feedback');
      return;
    }
    
    if (!newPost.title.trim() || submitting) return;

    setSubmitting(true);
    const { data, error } = await createPost({
      ...newPost,
      board_id: board.id
    });

    if (error) {
      console.error('Error creating post:', error);
      toast.error('Error submitting feedback. Please try again.');
    } else {
      setPosts([data, ...posts]);
      setNewPost({ title: '', description: '', author_name: '', author_email: '' });
      setShowNewPostForm(false);
      toast.success('Thank you for your feedback!');
    }
    setSubmitting(false);
  };

  const handleVote = async (postId) => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }
    
    const { data, error } = await voteOnPost(postId, 'upvote');
    if (error) {
      console.error('Error voting:', error);
      toast.error('Error voting. Please try again.');
    } else {
      toast.success('Vote registered!');
      // Refresh posts to get updated vote counts
      const { data: postsData } = await getBoardPosts(board.id);
      if (postsData) {
        setPosts(postsData);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando feedback board..." />;
  }

  if (!board) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${bricolageGrotesque.variable}`} style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Board not found</h1>
          <p className="text-gray-600">This feedback board doesn&apos;t exist or is not public.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${bricolageGrotesque.variable}`} style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
      <Header 
        title={board.name}
        subtitle="Share your feedback and feature requests"
        actions={
          <button
            onClick={() => user ? setShowNewPostForm(true) : toast.error('Please sign in to submit feedback')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 transform-gpu"
          >
            💡 Submit Feedback
          </button>
        }
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* New Post Form */}
        {showNewPostForm && (
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Submit New Feedback</h2>
            
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="What feature would you like to see?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-gray-800 placeholder-gray-500"
                />
              </div>
              
              <div>
                <textarea
                  placeholder="Describe your idea in more detail (optional)"
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors resize-none text-gray-800 placeholder-gray-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={newPost.author_name}
                  onChange={(e) => setNewPost({ ...newPost, author_name: e.target.value })}
                  className="px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-gray-800 placeholder-gray-500"
                />
                
                <input
                  type="email"
                  placeholder="Your email (optional)"
                  value={newPost.author_email}
                  onChange={(e) => setNewPost({ ...newPost, author_email: e.target.value })}
                  className="px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-gray-800 placeholder-gray-500"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={submitting || !newPost.title.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Feedback ({posts.length})
          </h2>

          {posts.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-white">
              <div className="text-gray-400 text-5xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No feedback yet</h3>
              <p className="text-gray-500 mb-4">Be the first to share your ideas!</p>
              <button
                onClick={() => setShowNewPostForm(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-xl font-semibold transition-colors"
              >
                Submit First Feedback
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const status = statusConfig[post.status] || statusConfig['pending'];
                return (
                  <div
                    key={post.id}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-emerald-500 transition-all animate-in fade-in-50 slide-in-from-bottom-4 duration-300 shadow-sm"
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
                          <span className="text-xs text-gray-400">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleVote(post.id)}
                          className={`flex items-center justify-center w-12 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-white transition-all duration-200 hover:scale-110 active:scale-95 transform-gpu hover:shadow-lg ${!user ? 'opacity-70' : ''}`}
                          title={!user ? 'Sign in to vote' : 'Vote for this post'}
                        >
                          ↑
                        </button>
                        <div className="bg-emerald-500 text-white px-3 py-2 rounded-xl font-bold min-w-[3rem] text-center">
                          {post.votes_count || 0}
                        </div>
                      </div>
                    </div>
                    
                    {/* Comments Section */}
                    <Comments postId={post.id} isPublicBoard={true} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getPostComments, createComment, updateComment, deleteComment, deleteCommentRPC, deleteCommentSimple } from '@/lib/database';
import { toast } from '@/components/Toast';
import { MessageCircle, Send, Edit2, Trash2, Check, X } from 'lucide-react';

export default function Comments({ postId, isPublicBoard = false }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Load comments when component mounts
  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      const { data, error } = await getPostComments(postId);
      
      if (error) {
        console.error('Error loading comments:', error);
        toast.error('Error loading comments');
      } else {
        console.log('Loaded comments:', data);
        setComments(data || []);
      }
      setLoading(false);
    };

    loadComments();
  }, [postId]);

  const reloadComments = async () => {
    setLoading(true);
    const { data, error } = await getPostComments(postId);
    
    if (error) {
      console.error('Error loading comments:', error);
      toast.error('Error loading comments');
    } else {
      setComments(data || []);
    }
    setLoading(false);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // For public boards, require name
    if (isPublicBoard && !user && !authorName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setSubmitting(true);
    
    const commentData = {
      content: newComment.trim(),
      post_id: postId,
      ...(isPublicBoard && !user && {
        author_name: authorName.trim(),
        author_email: authorEmail.trim() || null
      })
    };

    const { data, error } = await createComment(commentData);
    
    if (error) {
      console.error('Error creating comment:', error);
      toast.error('Error posting comment');
    } else {
      setComments([...comments, data]);
      setNewComment('');
      if (isPublicBoard && !user) {
        setAuthorName('');
        setAuthorEmail('');
      }
      toast.success('Comment posted!');
    }
    setSubmitting(false);
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    const { data, error } = await updateComment(commentId, editContent.trim());
    
    if (error) {
      console.error('Error updating comment:', error);
      toast.error('Error updating comment');
    } else {
      setComments(comments.map(comment => 
        comment.id === commentId ? { ...comment, content: editContent.trim() } : comment
      ));
      setEditingComment(null);
      setEditContent('');
      toast.success('Comment updated!');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      console.log('Deleting comment with ID:', commentId);
      
      // Try multiple deletion methods
      let result = await deleteComment(commentId);
      
      if (result.error) {
        console.log('Standard delete failed, trying simple method:', result.error);
        result = await deleteCommentSimple(commentId);
      }
      
      if (result.error) {
        console.log('Simple delete failed, trying RPC method:', result.error);
        result = await deleteCommentRPC(commentId);
      }
      
      if (result.error) {
        console.error('All delete methods failed:', result.error);
        toast.error(`Error deleting comment: ${result.error.message}`);
      } else {
        console.log('Comment deleted successfully');
        setComments(comments.filter(comment => comment.id !== commentId));
        toast.success('Comment deleted!');
      }
    } catch (err) {
      console.error('Unexpected error deleting comment:', err);
      toast.error('Unexpected error occurred while deleting comment');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      {/* Comments Toggle */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm font-medium">
          {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}` : 'Comments'}
        </span>
      </button>

      {showComments && (
        <div className="space-y-4">
          {/* New Comment Form */}
          <form onSubmit={handleSubmitComment} className="space-y-3">
            {/* Anonymous user fields for public boards */}
            {isPublicBoard && !user && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your name *"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="px-3 py-2 text-gray-500 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Your email (optional)"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  className="px-3 py-2 text-gray-500 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
            
            <div className="flex space-x-2">
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-2 border text-gray-500 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 resize-none"
                rows="3"
                maxLength="500"
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim() || (isPublicBoard && !user && !authorName.trim())}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-sm text-gray-900">
                          {comment.author_name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      
                      {editingComment === comment.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 resize-none"
                            rows="3"
                            maxLength="500"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditComment(comment.id)}
                              className="flex items-center space-x-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingComment(null);
                                setEditContent('');
                              }}
                              className="flex items-center space-x-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-xs transition-colors"
                            >
                              <X className="w-3 h-3" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      )}
                    </div>
                    
                    {/* Edit/Delete buttons for comment author */}
                    {user && comment.author_id === user.id && editingComment !== comment.id && (
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => {
                            setEditingComment(comment.id);
                            setEditContent(comment.content);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit comment"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            console.log('Deleting comment:', comment.id, 'User ID:', user?.id, 'Comment author ID:', comment.author_id);
                            handleDeleteComment(comment.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

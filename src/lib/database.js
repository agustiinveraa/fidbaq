import { supabase } from './supabase.js'

// =============================================
// BOARDS FUNCTIONS
// =============================================

/**
 * Get all boards for the authenticated user
 */
export async function getUserBoards() {
  const { 
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }

  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get a specific board by ID
 */
export async function getBoardById(boardId) {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('id', boardId)
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get a board by public link
 */
export async function getBoardByPublicLink(publicLink) {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('public_link', publicLink)
    .eq('is_public', true)
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Create a new board
 */
export async function createBoard(boardData) {
  const { 
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }

  // Generate a unique public link
  const publicLink = boardData.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') + '-' + Math.random().toString(36).substr(2, 6)

  const { data, error } = await supabase
    .from('boards')
    .insert([
      {
        name: boardData.name,
        description: boardData.description || null,
        public_link: publicLink,
        theme: boardData.theme || 'light',
        is_public: boardData.is_public !== false, // Default to true
        owner_id: user.id
      }
    ])
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Update a board
 */
export async function updateBoard(boardId, updates) {
  const { data, error } = await supabase
    .from('boards')
    .update(updates)
    .eq('id', boardId)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Delete a board
 */
export async function deleteBoard(boardId) {
  const { error } = await supabase
    .from('boards')
    .delete()
    .eq('id', boardId)

  if (error) {
    return { error }
  }

  return { error: null }
}

// =============================================
// POSTS FUNCTIONS
// =============================================

/**
 * Get all posts for a board
 */
export async function getBoardPosts(boardId) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('board_id', boardId)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Create a new post
 */
export async function createPost(postData) {
  const { 
    data: { user }
  } = await supabase.auth.getUser()

  const insertData = {
    title: postData.title,
    description: postData.description || null,
    board_id: postData.board_id,
    status: postData.status || 'pending'
  }

  // Add author info based on authentication status
  if (user) {
    insertData.author_id = user.id
  } else {
    insertData.author_email = postData.author_email
    insertData.author_name = postData.author_name
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([insertData])
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Update post status
 */
export async function updatePostStatus(postId, status) {
  
  const { data, error } = await supabase
    .from('posts')
    .update({ status })
    .eq('id', postId)
    .select()


  if (error) {
    return { data: null, error }
  }

  if (data && data.length > 0) {
    return { data: data[0], error: null }
  } else {
    return { data: null, error: { message: 'Post not found or not updated' } }
  }
}

/**
 * Delete a post
 */
export async function deletePost(postId) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) {
    return { error }
  }

  return { error: null }
}

// =============================================
// VOTES FUNCTIONS
// =============================================

/**
 * Vote on a post
 */
export async function voteOnPost(postId, voteType = 'upvote') {
  
  const { 
    data: { user }
  } = await supabase.auth.getUser()


  // Check if user already voted
  let existingVoteQuery = supabase
    .from('votes')
    .select('*')
    .eq('post_id', postId)

  if (user) {
    existingVoteQuery = existingVoteQuery.eq('user_id', user.id)
  } else {
    // For anonymous users, we'd need to track by IP
    // This is a simplified version - you'd want to implement IP tracking
    return { data: null, error: { message: 'Anonymous voting not implemented yet' } }
  }

  const { data: existingVotes, error: voteCheckError } = await existingVoteQuery


  if (voteCheckError) {
    return { data: null, error: voteCheckError }
  }

  const existingVote = existingVotes && existingVotes.length > 0 ? existingVotes[0] : null

  if (existingVote) {
    // User already voted, toggle or remove vote
    if (existingVote.vote_type === voteType) {
      // Remove vote
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('id', existingVote.id)

      if (error) {
        return { data: null, error }
      }

      // Manually update vote count as backup
      await updatePostVoteCount(postId);

      return { data: { action: 'removed' }, error: null }
    } else {
      // Change vote type
      const { data, error } = await supabase
        .from('votes')
        .update({ vote_type: voteType })
        .eq('id', existingVote.id)
        .select()

      if (error) {
        return { data: null, error }
      }

      // Manually update vote count as backup
      await updatePostVoteCount(postId);

      return { data: { action: 'updated', vote: data[0] }, error: null }
    }
  } else {
    // Create new vote
    const insertData = {
      post_id: postId,
      vote_type: voteType
    }

    if (user) {
      insertData.user_id = user.id
    }

    const { data, error } = await supabase
      .from('votes')
      .insert([insertData])
      .select()

    if (error) {
      return { data: null, error }
    }


    // Manually update vote count as backup
    await updatePostVoteCount(postId);

    return { data: { action: 'created', vote: data[0] }, error: null }
  }
}

/**
 * Get user's vote for a post
 */
export async function getUserVoteForPost(postId) {
  const { 
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: null }
  }

  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Manually update vote count for a post (backup function)
 */
export async function updatePostVoteCount(postId) {
  try {
    // Count total upvotes for this post
    const { data: votes, error: countError } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('post_id', postId)
      .eq('vote_type', 'upvote')

    if (countError) {
      return
    }

    const voteCount = votes ? votes.length : 0

    // Update the post's vote count
    const { error: updateError } = await supabase
      .from('posts')
      .update({ votes_count: voteCount })
      .eq('id', postId)

    if (updateError) {
    }
  } catch (error) {
  }
}

// =============================================
// COMMENTS FUNCTIONS
// =============================================

/**
 * Get all comments for a specific post
 */
export async function getPostComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Create a new comment
 */
export async function createComment(commentData) {
  const { 
    data: { user }
  } = await supabase.auth.getUser()

  // Check if user is authenticated
  if (user) {
    // Authenticated user comment
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          content: commentData.content,
          post_id: commentData.post_id,
          author_id: user.id,
          author_email: user.email,
          author_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'
        }
      ])
      .select()
      .single()

    if (error) {
      return { data: null, error }
    }

    return { data, error: null }
  } else {
    // Anonymous user comment (for public boards)
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          content: commentData.content,
          post_id: commentData.post_id,
          author_email: commentData.author_email || null,
          author_name: commentData.author_name || 'Anonymous'
        }
      ])
      .select()
      .single()

    if (error) {
      return { data: null, error }
    }

    return { data, error: null }
  }
}

/**
 * Update an existing comment
 */
export async function updateComment(commentId, content) {
  const { 
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } }
  }

  const { data, error } = await supabase
    .from('comments')
    .update({ 
      content,
      updated_at: new Date().toISOString()
    })
    .eq('id', commentId)
    .eq('author_id', user.id) // Only allow updating own comments
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId) {
  try {
    const { 
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }


    // First, verify the comment exists and belongs to the user
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('id, author_id, author_name, content')
      .eq('id', commentId)
      .single()

    if (fetchError) {
      return { data: null, error: fetchError }
    }

    if (!existingComment) {
      return { data: null, error: { message: 'Comment not found' } }
    }


    // Check if user is the author
    if (existingComment.author_id !== user.id) {
      return { data: null, error: { message: 'Not authorized to delete this comment' } }
    }

    // Attempt deletion
    const { error: deleteError, count } = await supabase
      .from('comments')
      .delete({ count: 'exact' })
      .eq('id', commentId)
      .eq('author_id', user.id)

    if (deleteError) {
      return { data: null, error: deleteError }
    }


    if (count === 0) {
      return { data: null, error: { message: 'Failed to delete comment - no rows affected' } }
    }

    return { data: true, error: null }
  } catch (err) {
    return { data: null, error: { message: 'Unexpected error occurred', details: err.message } }
  }
}

/**
 * Alternative delete comment function using RPC (Remote Procedure Call)
 * This can bypass RLS policies if needed
 */
export async function deleteCommentRPC(commentId) {
  try {
    const { 
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }


    // Use RPC to call a database function
    const { data, error } = await supabase.rpc('delete_user_comment', {
      comment_id: commentId,
      user_id: user.id
    });

    if (error) {
      return { data: null, error }
    }

    return { data: data, error: null }
  } catch (err) {
    return { data: null, error: { message: 'Unexpected error occurred', details: err.message } }
  }
}

/**
 * Simple delete comment function - bypasses some checks
 */
export async function deleteCommentSimple(commentId) {
  try {
    const { 
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }


    // Direct delete without pre-checks
    const { error, count } = await supabase
      .from('comments')
      .delete({ count: 'exact' })
      .match({ id: commentId, author_id: user.id })

    if (error) {
      return { data: null, error }
    }

    
    if (count === 0) {
      return { data: null, error: { message: 'No comment found to delete or not authorized' } }
    }

    return { data: true, error: null }
  } catch (err) {
    return { data: null, error: { message: 'Unexpected error occurred', details: err.message } }
  }
}

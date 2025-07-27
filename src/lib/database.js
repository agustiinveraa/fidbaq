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
    console.error('Error fetching user boards:', error)
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
    console.error('Error fetching board:', error)
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
    console.error('Error fetching board by public link:', error)
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
    console.error('Error creating board:', error)
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
    console.error('Error updating board:', error)
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
    console.error('Error deleting board:', error)
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
  console.log('Fetching posts for board:', boardId);
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('board_id', boardId)
    .order('created_at', { ascending: false })

  console.log('Posts data received:', data);

  if (error) {
    console.error('Error fetching board posts:', error)
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
    console.error('Error creating post:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Update post status
 */
export async function updatePostStatus(postId, status) {
  console.log('Updating post status:', { postId, status });
  
  const { data, error } = await supabase
    .from('posts')
    .update({ status })
    .eq('id', postId)
    .select()

  console.log('Update result:', { data, error });

  if (error) {
    console.error('Error updating post status:', error)
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
    console.error('Error deleting post:', error)
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
  console.log('Voting on post:', { postId, voteType });
  
  const { 
    data: { user }
  } = await supabase.auth.getUser()

  console.log('User voting:', user?.id);

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

  console.log('Existing votes:', existingVotes);

  if (voteCheckError) {
    console.error('Error checking existing vote:', voteCheckError)
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
        console.error('Error removing vote:', error)
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
        console.error('Error updating vote:', error)
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
      console.error('Error creating vote:', error)
      return { data: null, error }
    }

    console.log('Vote created:', data[0]);

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
    console.error('Error fetching user vote:', error)
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
      console.error('Error counting votes:', countError)
      return
    }

    const voteCount = votes ? votes.length : 0
    console.log('Updating post vote count:', { postId, voteCount })

    // Update the post's vote count
    const { error: updateError } = await supabase
      .from('posts')
      .update({ votes_count: voteCount })
      .eq('id', postId)

    if (updateError) {
      console.error('Error updating post vote count:', updateError)
    }
  } catch (error) {
    console.error('Error in updatePostVoteCount:', error)
  }
}

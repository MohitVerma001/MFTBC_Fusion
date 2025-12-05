import { supabase } from '../lib/supabase';

const getAnonymousUserId = () => {
  let userId = localStorage.getItem('anonymous_user_id');
  if (!userId) {
    userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('anonymous_user_id', userId);
  }
  return userId;
};

export const engagementApi = {
  async toggleLike(blogId) {
    try {
      const userId = getAnonymousUserId();

      const { data: existingLike, error: checkError } = await supabase
        .from('blog_likes')
        .select('*')
        .eq('blog_id', blogId)
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from('blog_likes')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) throw deleteError;

        const { count } = await supabase
          .from('blog_likes')
          .select('*', { count: 'exact', head: true })
          .eq('blog_id', blogId);

        return {
          success: true,
          liked: false,
          likeCount: count || 0
        };
      } else {
        const { error: insertError } = await supabase
          .from('blog_likes')
          .insert({ blog_id: blogId, user_id: userId });

        if (insertError) throw insertError;

        const { count } = await supabase
          .from('blog_likes')
          .select('*', { count: 'exact', head: true })
          .eq('blog_id', blogId);

        return {
          success: true,
          liked: true,
          likeCount: count || 0
        };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getLikeCount(blogId) {
    try {
      const { count, error } = await supabase
        .from('blog_likes')
        .select('*', { count: 'exact', head: true })
        .eq('blog_id', blogId);

      if (error) throw error;

      return {
        success: true,
        count: count || 0
      };
    } catch (error) {
      console.error('Error getting like count:', error);
      return {
        success: false,
        count: 0
      };
    }
  },

  async checkUserLiked(blogId) {
    try {
      const userId = getAnonymousUserId();

      const { data, error } = await supabase
        .from('blog_likes')
        .select('*')
        .eq('blog_id', blogId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      return {
        success: true,
        liked: !!data
      };
    } catch (error) {
      console.error('Error checking user liked:', error);
      return {
        success: false,
        liked: false
      };
    }
  },

  async addComment(blogId, content, userName = 'Anonymous', parentCommentId = null) {
    try {
      const userId = getAnonymousUserId();

      const { data, error } = await supabase
        .from('blog_comments')
        .insert({
          blog_id: blogId,
          user_id: userId,
          user_name: userName,
          comment: content,
          parent_comment_id: parentCommentId
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getComments(blogId) {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('blog_id', blogId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Error getting comments:', error);
      return {
        success: false,
        data: []
      };
    }
  },

  async deleteComment(commentId) {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting comment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async toggleBookmark(blogId) {
    try {
      const userId = getAnonymousUserId();

      const { data: existingBookmark, error: checkError } = await supabase
        .from('blog_bookmarks')
        .select('*')
        .eq('blog_id', blogId)
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingBookmark) {
        const { error: deleteError } = await supabase
          .from('blog_bookmarks')
          .delete()
          .eq('id', existingBookmark.id);

        if (deleteError) throw deleteError;

        return {
          success: true,
          bookmarked: false
        };
      } else {
        const { error: insertError } = await supabase
          .from('blog_bookmarks')
          .insert({ blog_id: blogId, user_id: userId });

        if (insertError) throw insertError;

        return {
          success: true,
          bookmarked: true
        };
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async checkUserBookmarked(blogId) {
    try {
      const userId = getAnonymousUserId();

      const { data, error } = await supabase
        .from('blog_bookmarks')
        .select('*')
        .eq('blog_id', blogId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      return {
        success: true,
        bookmarked: !!data
      };
    } catch (error) {
      console.error('Error checking user bookmarked:', error);
      return {
        success: false,
        bookmarked: false
      };
    }
  }
};

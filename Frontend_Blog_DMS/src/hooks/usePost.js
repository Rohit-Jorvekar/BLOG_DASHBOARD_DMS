import { useState, useEffect } from 'react';
import { postsApi } from '../lib/api';
import toast from 'react-hot-toast';

export function usePost(id) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seoScore, setSeoScore] = useState(null);

  const fetchPost = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await postsApi.getById(id);
      setPost(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeoScore = async () => {
    if (!id) return;
    
    try {
      const data = await postsApi.getSeoScore(id);
      setSeoScore(data);
    } catch (err) {
      console.error('Error fetching SEO score:', err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const updatePost = async (data) => {
    try {
      const updated = await postsApi.update(id, data);
      setPost(updated);
      toast.success('Post updated successfully');
      return updated;
    } catch (err) {
      toast.error('Failed to update post');
      console.error('Error updating post:', err);
      throw err;
    }
  };

  return {
    post,
    loading,
    error,
    seoScore,
    updatePost,
    refetch: fetchPost,
    fetchSeoScore,
  };
}
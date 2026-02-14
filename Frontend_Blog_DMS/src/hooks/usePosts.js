import { useState, useEffect } from 'react';
import { postsApi } from '../lib/api';
import toast from 'react-hot-toast';

export function usePosts(initialParams = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    sort: 'DESC',
    ...initialParams,
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsApi.getAll(params);
      setPosts(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [params]);

  const updateParams = (newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const deletePost = async (id) => {
    try {
      await postsApi.delete(id);
      toast.success('Post deleted successfully');
      fetchPosts(); // Refresh list
    } catch (err) {
      toast.error('Failed to delete post');
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  const togglePublish = async (id) => {
    try {
      await postsApi.togglePublish(id);
      toast.success('Post status updated');
      fetchPosts(); // Refresh list
    } catch (err) {
      toast.error('Failed to update post status');
      console.error('Error toggling publish:', err);
      throw err;
    }
  };

  return {
    posts,
    loading,
    error,
    meta,
    params,
    updateParams,
    deletePost,
    togglePublish,
    refetch: fetchPosts,
  };
}
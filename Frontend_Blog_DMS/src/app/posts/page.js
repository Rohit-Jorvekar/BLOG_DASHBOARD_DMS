'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { usePosts } from '../../hooks/usePosts';
import Header from '../../components/layout/Header';
import PostCard from '../../components/posts/PostCard';
import PostFilters from '../../components/posts/PostFilters';
import DeleteConfirmModal from '../../components/posts/DeleteConfirmModal';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import { postsApi } from '../../lib/api';
import { formatDate } from '../../lib/utils';
import Card, { CardBody } from '../../components/ui/Card';
import PostForm from '../../components/posts/PostForm';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function PostsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = searchParams.get('action');
  const postId = searchParams.get('id');

  const { posts, loading, meta, updateParams, deletePost, togglePublish } = usePosts();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, post: null });
  const [deleting, setDeleting] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);

  // Load post for edit/preview
  useEffect(() => {
    const fetchPost = async () => {
      if ((action === 'edit' || action === 'preview') && postId) {
        setLoadingPost(true);
        try {
          const data = await postsApi.getById(postId);
          setCurrentPost(data);
        } catch (error) {
          console.error('Error:', error);
          toast.error('Failed to load post');
        } finally {
          setLoadingPost(false);
        }
      }
    };

    fetchPost();
  }, [action, postId]);

  const handleFilterChange = (filters) => {
    updateParams({ ...filters, page: 1 });
  };

  const handlePageChange = (page) => {
    updateParams({ page });
  };

  const handleDeleteClick = (post) => {
    setDeleteModal({ isOpen: true, post });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.post) return;
    
    setDeleting(true);
    try {
      await deletePost(deleteModal.post.id);
      setDeleteModal({ isOpen: false, post: null });
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdatePost = async (formData) => {
    try {
      await postsApi.update(postId, formData);
      toast.success('Post updated successfully!');
      router.push('/posts');
    } catch (error) {
      toast.error('Failed to update post');
      throw error;
    }
  };

  // Show Preview
  if (action === 'preview' && postId) {
    if (loadingPost) {
      return (
        <>
          <Header title="Loading Preview..." />
          <div className="p-8 flex items-center justify-center">
            <div className="spinner"></div>
          </div>
        </>
      );
    }

    if (!currentPost) {
      return (
        <>
          <Header title="Post Not Found" />
          <div className="p-8">
            <Card>
              <CardBody>
                <p className="text-center text-gray-500">Post not found</p>
              </CardBody>
            </Card>
          </div>
        </>
      );
    }

    return (
      <>
        <Header
          title="Preview Mode"
          subtitle="This is how your post will appear to readers"
          action={
            <div className="flex gap-2">
              <Link href="/posts">
                <Button variant="outline">← Back to Posts</Button>
              </Link>
              <Link href={`/posts?action=edit&id=${postId}`}>
                <Button>Edit Post</Button>
              </Link>
            </div>
          }
        />

        <div className="p-8 max-w-5xl mx-auto">
          {/* Warning Banner */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Preview Mode:</strong> Views are not being counted.
                </p>
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <Card>
            <CardBody className="p-8">
              {currentPost.featuredImage && (
                <div className="w-full h-96 mb-6 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={currentPost.featuredImage}
                    alt={currentPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="mb-6">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
                  {currentPost.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {currentPost.title}
              </h1>

              <div className="flex items-center gap-4 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {currentPost.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{currentPost.authorName}</p>
                    <p className="text-xs text-gray-500">{formatDate(currentPost.createdAt)}</p>
                  </div>
                </div>
                <span className="text-sm">•</span>
                <span className="text-sm">{currentPost.readTime} min read</span>
              </div>

              {currentPost.tags && currentPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {currentPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: currentPost.content }}
              />

              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">About the Author</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary-700">
                        {currentPost.authorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{currentPost.authorName}</p>
                      <p className="text-sm text-gray-600">Content Creator</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  // Show Edit Form
  if (action === 'edit' && postId) {
    if (loadingPost) {
      return (
        <>
          <Header title="Loading..." />
          <div className="p-8 flex items-center justify-center">
            <div className="spinner"></div>
          </div>
        </>
      );
    }

    if (!currentPost) {
      return (
        <>
          <Header title="Post Not Found" />
          <div className="p-8">
            <Card>
              <CardBody>
                <p className="text-center text-gray-500">Post not found</p>
              </CardBody>
            </Card>
          </div>
        </>
      );
    }

    return (
      <>
        <Header
          title="Edit Post"
          subtitle={`Editing: ${currentPost.title}`}
        />

        <div className="p-8">
          <PostForm
            initialData={currentPost}
            onSubmit={handleUpdatePost}
            submitLabel="Update Post"
          />
        </div>
      </>
    );
  }

  // Show Posts List (default)
  return (
    <>
      <Header
        title="All Posts"
        subtitle={`Manage your blog posts (${meta.total} total)`}
        action={
          <Link href="/posts/new">
            <Button>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Post
            </Button>
          </Link>
        }
      />

      <div className="p-8">
        <PostFilters onFilterChange={handleFilterChange} />

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="spinner"></div>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new blog post.
            </p>
            <div className="mt-6">
              <Link href="/posts/new">
                <Button>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Post
                </Button>
              </Link>
            </div>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDeleteClick}
                onTogglePublish={togglePublish}
              />
            ))}
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, post: null })}
        onConfirm={handleDeleteConfirm}
        postTitle={deleteModal.post?.title}
        loading={deleting}
      />
    </>
  );
}
'use client';

import { useRouter } from 'next/navigation';
import { postsApi } from '../../../lib/api';
import toast from 'react-hot-toast';
import Header from '../../../components/layout/Header';
import PostForm from '../../../components/posts/PostForm';

export default function NewPostPage() {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      const newPost = await postsApi.create(formData);
      toast.success('Post created successfully!');
      router.push(`/posts/${newPost.id}`);
    } catch (error) {
      toast.error('Failed to create post');
      throw error;
    }
  };

  return (
    <>
      <Header
        title="Create New Post"
        subtitle="Write and publish your blog content"
      />

      <div className="p-8">
        <PostForm onSubmit={handleSubmit} submitLabel="Create Post" />
      </div>
    </>
  );
}
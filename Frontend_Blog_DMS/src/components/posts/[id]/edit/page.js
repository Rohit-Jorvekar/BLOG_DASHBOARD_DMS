'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePost } from '@/hooks/usePost';
import { postsApi } from '../../../../lib/api';
import toast from 'react-hot-toast';
import Header from '../../../../components/layout/Header';
import PostForm from '../../../../components/posts/PostForm';
import Card, { CardBody } from '../../../ui/Card';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { post, loading } = usePost(params.id);

  const handleSubmit = async (formData) => {
    try {
      await postsApi.update(params.id, formData);
      toast.success('Post updated successfully!');
      router.push(`/posts/${params.id}`);
    } catch (error) {
      toast.error('Failed to update post');
      throw error;
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Loading..." />
        <div className="p-8 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header title="Post Not Found" />
        <div className="p-8">
          <Card>
            <CardBody>
              <p className="text-center text-gray-500">Post not found.</p>
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
        subtitle={`Editing: ${post.title}`}
      />

      <div className="p-8">
        <PostForm
          initialData={post}
          onSubmit={handleSubmit}
          submitLabel="Update Post"
        />
      </div>
    </>
  );
}
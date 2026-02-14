'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usePost } from '../../../../hooks/usePost';
import Header from '../../../../components/layout/Header';
import PostPreview from '../../../../components/posts/PostPreview';
import Button from '../../../../components/ui/Button';
import Card, { CardBody } from '../../../../components/ui/Card';

export default function PreviewPostPage() {
  const params = useParams();
  const { post, loading } = usePost(params.id);

  if (loading) {
    return (
      <>
        <Header title="Loading Preview..." />
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
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">Post not found</h3>
                <p className="text-gray-500 mb-6">The post you're looking for doesn't exist.</p>
                <Link href="/posts">
                  <Button>Back to Posts</Button>
                </Link>
              </div>
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
            <Link href={`/posts/${post.id}`}>
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Post
              </Button>
            </Link>
            <Link href={`/posts/${post.id}/edit`}>
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Post
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Preview Mode:</strong> Views are not being counted. This is how your post will look when published.
              </p>
            </div>
          </div>
        </div>

        <PostPreview post={post} />
      </div>
    </>
  );
}